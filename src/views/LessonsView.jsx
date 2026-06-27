import { Fragment, useEffect, useRef, useState } from "react";
import { COURSE_UNITS, LESSONS, skillLabel } from "../data/lessons";
import { normaliseAnswer, speak } from "../utils/language";
import { answerMatches } from "../utils/answers";
import { makeExercises } from "../utils/exercises";
import { readJSON, writeJSON } from "../services/storage";
import { ProgressBar, XpPop } from "../components/Common";
import { Icons } from "../components/Icons";
import { buzz } from "../utils/haptics";

// Map each unit to a CEFR level for path signposting.
const UNIT_LEVEL = {
  start: "A1", cafe: "A1", city: "A1", people: "A1", daily: "A1", bridge: "A1",
  "a2-past": "A2", "a2-future": "A2",
  "b1-core": "B1", "b1-real": "B1",
  "b2-core": "B2", "b2-real": "B2",
  "c1-lang": "C1", "c1-ideias": "C1",
};
const LEVEL_ORDER = ["A1", "A2", "B1", "B2", "C1"];
const LEVEL_LABEL = { A1: "Beginner", A2: "Elementary", B1: "Intermediate", B2: "Upper-intermediate", C1: "Advanced" };
const lessonsInLevel = (lvl) => LESSONS.filter((l) => UNIT_LEVEL[l.unit] === lvl);

// Like normaliseAnswer but keeps accents, so we can tell when an answer was
// only correct after ignoring them (to nudge the learner about accents).
const normKeepAccents = (s) => String(s || "").toLowerCase().replace(/[.,!?;:]/g, "").replace(/\s+/g, " ").trim();

// On-screen accent keys so learners can type Portuguese diacritics on a phone.
const ACCENT_CHARS = ["á", "â", "ã", "à", "ç", "é", "ê", "í", "ó", "ô", "õ", "ú"];
function AccentKeys({ onInsert }) {
  return (
    <div className="tg-accents">
      {ACCENT_CHARS.map((c) => (
        // onMouseDown preventDefault keeps the input focused/caret intact
        <button type="button" key={c} className="tg-accent-key" onMouseDown={(e) => e.preventDefault()} onClick={() => onInsert(c)}>{c}</button>
      ))}
    </div>
  );
}

function Exercise({ exercise, onAnswer }) {
  const [selected, setSelected] = useState("");
  const [typed, setTyped] = useState("");
  const [typed2, setTyped2] = useState("");
  const [built, setBuilt] = useState([]);
  const [pool, setPool] = useState(exercise.words || []);
  const [eliminated, setEliminated] = useState([]);
  const [hadMistake, setHadMistake] = useState(false);
  const inputRef = useRef(null);
  const input2Ref = useRef(null);
  const [clozeFocus, setClozeFocus] = useState("a");

  // Insert an accent character at the caret of a given field.
  const insertInto = (ref, value, setValue) => (ch) => {
    const el = ref.current;
    if (!el || el.selectionStart == null) { setValue(value + ch); return; }
    const s = el.selectionStart, e = el.selectionEnd;
    setValue(value.slice(0, s) + ch + value.slice(e));
    requestAnimationFrame(() => { try { el.focus(); el.setSelectionRange(s + 1, s + 1); } catch {} });
    buzz(4);
  };

  const meta = { tags: exercise.tags, title: exercise.title, say: exercise.say, review: exercise.review, note: exercise.note };

  const submit = (value) => {
    const answer = value ?? selected ?? typed;
    const correct = answerMatches(answer, exercise.answer, exercise.accept);
    // Only nudge about accents when the accents are the *only* difference.
    const accentNote = correct && normaliseAnswer(answer) === normaliseAnswer(exercise.answer) && normKeepAccents(answer) !== normKeepAccents(exercise.answer) ? exercise.answer : null;
    onAnswer({ correct, userAnswer: answer, expected: exercise.answer, accentNote, ...meta });
  };

  if (exercise.type === "choice") {
    const checkChoice = () => {
      if (selected === exercise.answer) {
        onAnswer({ correct: !hadMistake, recovered: hadMistake, userAnswer: selected, expected: exercise.answer, ...meta });
      } else {
        buzz([0, 18, 80, 18]);
        setEliminated((e) => e.concat(selected));
        setHadMistake(true);
        setSelected("");
      }
    };
    return (
      <div className="tg-card lesson-exercise">
        <div className="tg-label">{exercise.title}</div>
        {exercise.listen ? (
          <button className="tg-listen" onClick={() => speak(exercise.say)}>{Icons.speaker} Play phrase</button>
        ) : (
          <>
            <div className="tg-big-pt">{exercise.prompt}</div>
            <button className="tg-mini" onClick={() => speak(exercise.prompt)}>{Icons.speaker} Hear it</button>
          </>
        )}
        <div className="tg-options">
          {exercise.choices.map((choice) => {
            const out = eliminated.includes(choice);
            return (
              <button
                key={choice}
                className={`${selected === choice ? "selected" : ""} ${out ? "eliminated" : ""}`}
                disabled={out}
                onClick={() => { if (!out) { buzz(6); setSelected(choice); } }}
              >{choice}</button>
            );
          })}
        </div>
        {hadMistake ? <div className="tg-retry-hint">Not quite — pick another answer.</div> : null}
        <button className="tg-btn tg-btn-primary" disabled={!selected} onClick={checkChoice}>Check</button>
      </div>
    );
  }

  if (exercise.type === "order") {
    const add = (word, idx) => {
      buzz(6);
      setBuilt((b) => b.concat(word));
      setPool((p) => p.filter((_, i) => i !== idx));
    };
    const undo = () => {
      const last = built[built.length - 1];
      if (!last) return;
      setBuilt((b) => b.slice(0, -1));
      setPool((p) => p.concat(last));
    };
    return (
      <div className="tg-card lesson-exercise">
        <div className="tg-label">{exercise.title}</div>
        <div className="tg-prompt-en">{exercise.prompt}</div>
        <div className="tg-build-line">{built.length ? built.join(" ") : "Tap the words in order"}</div>
        <div className="tg-word-pool">{pool.map((word, idx) => <button key={`${word}-${idx}`} onClick={() => add(word, idx)}>{word}</button>)}</div>
        <button className="tg-mini" onClick={undo}>Undo</button>
        <button className="tg-btn tg-btn-primary" disabled={!built.length} onClick={() => submit(built.join(" "))}>Check</button>
      </div>
    );
  }

  if (exercise.type === "dictation") {
    return (
      <div className="tg-card lesson-exercise">
        <div className="tg-label">{exercise.title}</div>
        <button className="tg-listen" onClick={() => speak(exercise.prompt)}>{Icons.speaker} Play Portuguese</button>
        <div className="tg-meaning">{exercise.translation}</div>
        <textarea ref={inputRef} className="tg-ta" value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Type what you hear in Portuguese" autoCapitalize="none" autoCorrect="off" spellCheck="false" />
        <AccentKeys onInsert={insertInto(inputRef, typed, setTyped)} />
        <button className="tg-btn tg-btn-primary" disabled={!typed.trim()} onClick={() => submit(typed)}>Check</button>
      </div>
    );
  }

  if (exercise.type === "cloze2") {
    const seg = exercise.prompt.split("____");
    const check = () => {
      const ok = answerMatches(typed, exercise.answers[0]) && answerMatches(typed2, exercise.answers[1]);
      const accentNote = ok && (normKeepAccents(typed) !== normKeepAccents(exercise.answers[0]) || normKeepAccents(typed2) !== normKeepAccents(exercise.answers[1])) ? exercise.answers.join(", ") : null;
      onAnswer({ correct: ok, userAnswer: `${typed}, ${typed2}`, expected: exercise.answers.join(", "), accentNote, ...meta });
    };
    return (
      <div className="tg-card lesson-exercise">
        <div className="tg-label">{exercise.title}</div>
        {exercise.translation ? <div className="tg-meaning">"{exercise.translation}"</div> : null}
        <div className="tg-blank-line">
          <span className="tg-blank-ctx">{seg[0]}</span>
          <input ref={inputRef} className="tg-blank-input" value={typed} onChange={(e) => setTyped(e.target.value)} onFocus={() => setClozeFocus("a")} placeholder="?" autoCapitalize="none" autoCorrect="off" spellCheck="false" size={Math.max(4, exercise.answers[0].length + 1)} />
          <span className="tg-blank-ctx">{seg[1]}</span>
          <input ref={input2Ref} className="tg-blank-input" value={typed2} onChange={(e) => setTyped2(e.target.value)} onFocus={() => setClozeFocus("b")} placeholder="?" autoCapitalize="none" autoCorrect="off" spellCheck="false" size={Math.max(4, exercise.answers[1].length + 1)} />
          <span className="tg-blank-ctx">{seg[2]}</span>
        </div>
        <AccentKeys onInsert={clozeFocus === "b" ? insertInto(input2Ref, typed2, setTyped2) : insertInto(inputRef, typed, setTyped)} />
        <button className="tg-mini" onClick={() => speak(exercise.full)}>{Icons.speaker} Hear full phrase</button>
        <button className="tg-btn tg-btn-primary" disabled={!typed.trim() || !typed2.trim()} onClick={check}>Check</button>
      </div>
    );
  }

  if (exercise.type === "mistake") {
    const tokens = exercise.wrong.split(/\s+/);
    const check = () => {
      const tk = tokens[selected] || "";
      const clean = tk.replace(/[.,!?;:]/g, "").toLowerCase();
      const correct = clean === exercise.wrongWord.toLowerCase();
      onAnswer({ correct, userAnswer: tk, expected: exercise.answer, ...meta });
    };
    return (
      <div className="tg-card lesson-exercise">
        <div className="tg-label">{exercise.title}</div>
        <div className="tg-meaning">Tap the word that's wrong, then check.</div>
        <div className="tg-word-pool">
          {tokens.map((tk, i) => (
            <button key={i} className={selected === i ? "selected" : ""} onClick={() => { buzz(6); setSelected(i); }}>{tk}</button>
          ))}
        </div>
        <button className="tg-btn tg-btn-primary" disabled={selected === ""} onClick={check}>Check</button>
      </div>
    );
  }

  if (exercise.type === "transform") {
    return (
      <div className="tg-card lesson-exercise">
        <div className="tg-label">{exercise.title}</div>
        <div className="tg-coach">🔁 {exercise.instruction}</div>
        <div className="tg-prompt-en">{exercise.prompt}</div>
        <button className="tg-mini" onClick={() => speak(exercise.prompt)}>{Icons.speaker} Hear original</button>
        <textarea ref={inputRef} className="tg-ta" value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Rewrite it in Portuguese" autoCapitalize="none" autoCorrect="off" spellCheck="false" />
        <AccentKeys onInsert={insertInto(inputRef, typed, setTyped)} />
        <button className="tg-btn tg-btn-primary" disabled={!typed.trim()} onClick={() => submit(typed)}>Check</button>
      </div>
    );
  }

  if (exercise.type === "produce") {
    return (
      <div className="tg-card lesson-exercise">
        <div className="tg-label">{exercise.title}</div>
        <div className="tg-meaning">Say this in Portuguese — no word tiles this time.</div>
        <div className="tg-prompt-en">{exercise.prompt}</div>
        <textarea ref={inputRef} className="tg-ta" value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Type it in Portuguese…" autoCapitalize="none" autoCorrect="off" spellCheck="false" />
        <AccentKeys onInsert={insertInto(inputRef, typed, setTyped)} />
        <button className="tg-btn tg-btn-primary" disabled={!typed.trim()} onClick={() => submit(typed)}>Check</button>
      </div>
    );
  }

  if (exercise.type === "pick") {
    return (
      <div className="tg-card lesson-exercise">
        <div className="tg-label">{exercise.title}</div>
        {exercise.instruction ? <div className="tg-coach">🧩 {exercise.instruction}</div> : null}
        <div className="tg-prompt-en">{exercise.prompt}</div>
        <div className="tg-options">
          {exercise.choices.map((c) => (
            <button key={c} className={selected === c ? "selected" : ""} onClick={() => { buzz(6); setSelected(c); }}>{c}</button>
          ))}
        </div>
        <button className="tg-btn tg-btn-primary" disabled={!selected} onClick={() => {
          const correct = selected === exercise.answer;
          onAnswer({ correct, userAnswer: selected, expected: exercise.answer, ...meta });
        }}>Check</button>
      </div>
    );
  }

  if (exercise.type === "convo") {
    return (
      <div className="tg-card lesson-exercise">
        <div className="tg-label">{exercise.title}</div>
        {exercise.instruction ? <div className="tg-meaning">{exercise.instruction}</div> : null}
        <div className="tg-convo">
          {exercise.lines.map((l, i) => (
            <div key={i} className="tg-convo-line">
              <span className="tg-convo-who">{l.who}</span>
              <span className={`tg-convo-pt ${l.pt === "____" ? "gap" : ""}`}>{l.pt === "____" ? "…" : l.pt}</span>
            </div>
          ))}
        </div>
        <div className="tg-options">
          {exercise.choices.map((c) => (
            <button key={c} className={selected === c ? "selected" : ""} onClick={() => { buzz(6); setSelected(c); }}>{c}</button>
          ))}
        </div>
        <button className="tg-btn tg-btn-primary" disabled={!selected} onClick={() => {
          const correct = selected === exercise.answer;
          onAnswer({ correct, userAnswer: selected, expected: exercise.answer, ...meta });
        }}>Check</button>
      </div>
    );
  }

  // blank / missing-word exercise
  const parts = exercise.prompt.split("____");
  return (
    <div className="tg-card lesson-exercise">
      <div className="tg-label">{exercise.title}</div>
      {exercise.translation ? <div className="tg-meaning">"{exercise.translation}"</div> : null}
      <div className="tg-blank-line">
        <span className="tg-blank-ctx">{parts[0]}</span>
        <input
          ref={inputRef}
          className="tg-blank-input"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder="?"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck="false"
          size={Math.max(4, exercise.answer.length + 1)}
        />
        <span className="tg-blank-ctx">{parts[1]}</span>
      </div>
      <AccentKeys onInsert={insertInto(inputRef, typed, setTyped)} />
      <button className="tg-mini" onClick={() => speak(exercise.full)}>{Icons.speaker} Hear full phrase</button>
      <button className="tg-btn tg-btn-primary" disabled={!typed.trim()} onClick={() => submit(typed)}>Check</button>
    </div>
  );
}

const XP_PER_CORRECT = 10;

function LessonRunner({ lesson, onBack, onComplete, onSave, onActivity, reviewPool, skillStats }) {
  // No-audio mode: skip listening questions and don't auto-play sound.
  const [quiet, setQuiet] = useState(() => Boolean(readJSON("tagarela:quietMode", false)));
  const [exercises, setExercises] = useState(null); // built when the lesson starts
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [streak, setStreak] = useState(0);
  const [retryQueue, setRetryQueue] = useState([]); // missed exercises, re-asked once at the end
  const [missed, setMissed] = useState([]); // base indices answered wrong on the first pass

  const base = exercises || [];
  const queue = base.concat(retryQueue);
  const retrying = idx >= base.length;
  const current = queue[idx];

  const toggleQuiet = () => { const v = !quiet; setQuiet(v); writeJSON("tagarela:quietMode", v); buzz(6); };
  const start = () => { buzz(12); setExercises(makeExercises(lesson, reviewPool, skillStats, quiet, readJSON("tagarela:typing", "auto"))); setStarted(true); };

  const handleAnswer = (result) => {
    // distinct patterns: single soft pulse = correct, double knock = wrong
    buzz(result.correct ? 10 : [0, 18, 80, 18]);
    // Speak the correct phrase aloud when wrong — unless we're in no-audio mode
    if (!quiet && !result.correct && !result.recovered && result.say) speak(result.say);
    setStreak((s) => (result.correct ? s + 1 : 0));
    setFeedback(result);
    if (onActivity) onActivity();
  };

  const next = () => {
    const firstPass = idx < base.length;
    const wrong = feedback && !feedback.correct && !feedback.recovered;
    const nextResults = firstPass && feedback ? results.concat(feedback) : results;
    const nextMissed = firstPass && wrong ? missed.concat(idx) : missed;
    setResults(nextResults);
    setMissed(nextMissed);
    setFeedback(null);

    if (idx >= queue.length - 1) {
      // End of the first pass: if anything was missed, re-ask it once more.
      if (retryQueue.length === 0 && nextMissed.length > 0) {
        setRetryQueue(nextMissed.map((i) => base[i]));
        setIdx(idx + 1);
        return;
      }
      const correct = nextResults.filter((r) => r.correct).length;
      const score = Math.round((correct / base.length) * 100);
      onComplete(lesson, { score, results: nextResults });
      return;
    }
    setIdx((n) => n + 1);
  };

  if (!started) {
    return (
      <div className="tg-screen">
        <button className="tg-back" onClick={onBack}>← Back to lessons</button>
        <div className="tg-lesson-hero">
          <span>{lesson.emoji}</span>
          <h2>{lesson.title}</h2>
          <p>{lesson.mission}</p>
        </div>
        <div className="tg-card">
          <div className="tg-label">Learn this</div>
          <p className="tg-expl">{lesson.teach}</p>
          <div className="tg-coach">💡 {lesson.coachTip}</div>
        </div>
        <div className="tg-card">
          <div className="tg-label">Phrase pack</div>
          {lesson.phrases.map((phrase) => (
            <div key={phrase.pt} className="tg-phrase-row">
              <div><b>{phrase.pt}</b><span>{phrase.en}</span></div>
              <button className="tg-mini round" onClick={() => speak(phrase.pt)} aria-label="Hear phrase">{Icons.speaker}</button>
            </div>
          ))}
          <button className="tg-btn tg-btn-ghost" onClick={() => lesson.phrases.forEach((p) => onSave(p.pt, p.en, "learning", lesson.skillTags))}>Save phrase pack</button>
        </div>
        <button type="button" className={`tg-quiet-toggle ${quiet ? "on" : ""}`} onClick={toggleQuiet}>
          {quiet ? "🔇 No-audio mode: ON" : "🔈 No-audio mode: off"}
          <small>{quiet ? "Skipping listening questions" : "Tap if you can't play sound or speak"}</small>
        </button>
        <button className="tg-btn tg-btn-primary" onClick={start}>Start playful challenge</button>
      </div>
    );
  }

  return (
    <div className="tg-screen">
      <button className="tg-back" onClick={onBack}>← Exit lesson</button>
      <div className="tg-progress-card compact">
        <div className="tg-progress-top">
          <b>{lesson.emoji} {lesson.title}</b>
          <span>{streak >= 3 ? <span className="tg-streak-badge">🔥 {streak} in a row!</span> : null}{idx + 1}/{queue.length}</span>
        </div>
        <ProgressBar value={((idx + 1) / queue.length) * 100} />
      </div>
      {retrying ? <div className="tg-retry-banner">🔁 Quick recap — let's nail the ones you missed.</div> : null}
      {!retrying && current.callback ? <div className="tg-review-banner">↩️ Review from an earlier lesson</div> : null}
      {!retrying && current.transfer ? <div className="tg-review-banner">🧩 New example — apply what you learned</div> : null}
      <details className="tg-learn-tip">
        <summary>💡 Quick reminder</summary>
        <p>{lesson.teach}</p>
      </details>
      <Exercise key={idx} exercise={current} onAnswer={handleAnswer} />
      {feedback ? (
        <div className={`tg-feedback ${feedback.correct ? "correct" : feedback.recovered ? "recovered" : "incorrect"}`}>
          {feedback.correct && <XpPop key={`xp-${idx}`} amount={XP_PER_CORRECT} />}
          {feedback.correct ? (
            <>
              <b>Boa! 🎉</b>
              {feedback.accentNote
                ? <span>Right! Just mind the accent: <b>{feedback.accentNote}</b></span>
                : <span>{streak >= 3 ? `🔥 ${streak} in a row — you're on fire!` : "That one goes into your confidence bank."}</span>}
            </>
          ) : feedback.recovered ? (
            <>
              <b>Got there! 🎯</b>
              <span>Right answer on the retry. I'll bring this one back for a quick review.</span>
            </>
          ) : (
            <>
              <b>Almost — here's the answer:</b>
              <div className="tg-feedback-compare">
                <div className="tg-feedback-row wrong">
                  <span className="tg-feedback-lbl">You:</span>
                  <span>{feedback.userAnswer}</span>
                </div>
                <div className="tg-feedback-row correct-ans">
                  <span className="tg-feedback-lbl">Answer:</span>
                  <span>{feedback.expected}</span>
                </div>
                <button className="tg-mini" onClick={() => speak(feedback.say || feedback.expected)}>{Icons.speaker} Hear it again</button>
              </div>
            </>
          )}
          {feedback.note ? <div className="tg-feedback-note">💡 {feedback.note}</div> : null}
          {(() => {
            const wrongNow = !feedback.correct && !feedback.recovered && idx < base.length;
            const willRetry = retryQueue.length === 0 && (missed.length + (wrongNow ? 1 : 0)) > 0;
            const finishing = idx >= queue.length - 1 && !willRetry;
            return <button className="tg-btn tg-btn-primary" onClick={() => { buzz(10); next(); }}>{finishing ? "See result" : "Next"}</button>;
          })()}
        </div>
      ) : null}
    </div>
  );
}

function LessonResult({ result, onContinue, onReview }) {
  const score = result.score;
  const results = result.results || [];
  return (
    <div className="tg-screen">
      <div className="tg-result-card">
        <div className="tg-hero-emoji">{score >= 80 ? "🎉" : score >= 60 ? "🙂" : "💪"}</div>
        <h2>{score >= 80 ? "Boa! Aula concluída." : "Aula concluída — vamos reforçar."}</h2>
        <div className="tg-score">{score}<small>%</small></div>
        <p>{score >= 80 ? "You’re ready for the next small step." : "I saved the key phrases for review so they come back at the right time."}</p>
        {result.timesDone ? <div className="tg-times-pill">{result.timesDone === 1 ? "First time completed 🎉" : `Completed ${result.timesDone}× 🔁`}</div> : null}
        {result.reachedLevel ? (
          <div className="tg-levelup">
            🏅 You've completed <b>{result.reachedLevel}</b>!{result.nextLevel ? <> On to <b>{result.nextLevel}</b>.</> : <> You've finished the whole course! 🎉</>}
          </div>
        ) : null}
      </div>

      {results.length ? (
        <div className="tg-card">
          <div className="tg-label">Your answers</div>
          <div className="tg-breakdown">
            {results.map((r, i) => (
              <div key={i} className={`tg-breakdown-row ${r.correct ? "ok" : "miss"}`}>
                <span className="tg-breakdown-mark">{r.correct ? "✓" : "✗"}</span>
                <div className="tg-breakdown-body">
                  <div className="tg-breakdown-title">{r.title}</div>
                  <div className="tg-breakdown-pt">{r.review?.pt || r.say}</div>
                  <div className="tg-breakdown-en">{r.review?.en}</div>
                </div>
                <button className="tg-mini round" aria-label="Hear phrase" onClick={() => speak(r.say || r.review?.pt)}>{Icons.speaker}</button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {result.lesson?.teach ? (
        <div className="tg-card">
          <div className="tg-label">Remember this</div>
          <p className="tg-expl">{result.lesson.teach}</p>
        </div>
      ) : null}

      <div className="tg-card">
        <div className="tg-label">What was saved</div>
        <p className="tg-expl">Lesson phrases were added to your review deck. Lower scores mark them as difficult so they appear sooner.</p>
      </div>
      <button className="tg-btn tg-btn-primary" onClick={onContinue}>Continue course</button>
      <button className="tg-btn tg-btn-ghost" onClick={onReview}>Go to review</button>
    </div>
  );
}

export default function LessonsView({ progress, setProgress, onSave, onGoReview, launchLesson, onConsumeLaunch, onActivity, startLevel = "A1" }) {
  const [activeLesson, setActiveLesson] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const completed = new Set(progress.completed || []);
  useEffect(() => {
    if (launchLesson) {
      setLastResult(null);
      setActiveLesson(launchLesson);
      onConsumeLaunch?.();
    }
  }, [launchLesson, onConsumeLaunch]);
  const pct = Math.round((completed.size / LESSONS.length) * 100);
  const nextIdx = Math.min(completed.size, LESSONS.length - 1);

  const startLesson = (lesson) => {
    setLastResult(null);
    setActiveLesson(lesson);
  };

  const completeLesson = (lesson, outcome) => {
    const score = outcome.score;
    const timesDone = Number((progress.lessonCounts || {})[lesson.id] || 0) + 1;
    setProgress((current) => {
      const done = current.completed?.includes(lesson.id) ? current.completed : [...(current.completed || []), lesson.id];
      let skillStats = current.skillStats || {};
      outcome.results.forEach((item) => {
        (item.tags || lesson.skillTags || []).forEach((tag) => {
          const cur = skillStats[tag] || { correct: 0, attempts: 0 };
          skillStats = { ...skillStats, [tag]: { correct: cur.correct + (item.correct ? 1 : 0), attempts: cur.attempts + 1 } };
        });
      });
      const counts = current.lessonCounts || {};
      return {
        ...current,
        completed: done,
        activeLessonId: (LESSONS.find((l) => !done.includes(l.id)) || lesson).id,
        lessonScores: { ...(current.lessonScores || {}), [lesson.id]: { score, when: Date.now() } },
        lessonCounts: { ...counts, [lesson.id]: Number(counts[lesson.id] || 0) + 1 },
        skillStats,
        xp: Number(current.xp || 0) + Math.max(40, score),
        lastLessonAt: Date.now(),
      };
    });
    lesson.phrases.forEach((phrase) => onSave(phrase.pt, phrase.en, score < 70 ? "difficult" : "learning", lesson.skillTags));
    // Did this completion finish a whole CEFR level for the first time?
    const lvl = UNIT_LEVEL[lesson.unit];
    const lvlLessons = lessonsInLevel(lvl);
    const prevDone = progress.completed || [];
    const wasComplete = lvlLessons.every((l) => prevDone.includes(l.id));
    const nowComplete = lvlLessons.every((l) => l.id === lesson.id || prevDone.includes(l.id));
    const reachedLevel = !wasComplete && nowComplete ? lvl : null;
    const nextLevel = reachedLevel ? LEVEL_ORDER[LEVEL_ORDER.indexOf(reachedLevel) + 1] || null : null;
    setActiveLesson(null);
    setLastResult({ lesson, score, results: outcome.results, timesDone, reachedLevel, nextLevel });
  };

  if (activeLesson) {
    // Phrases from other completed lessons, for spaced "callback" review questions.
    const reviewPool = LESSONS
      .filter((l) => completed.has(l.id) && l.id !== activeLesson.id)
      .flatMap((l) => l.phrases.map((p) => ({ pt: p.pt, en: p.en, skillTags: l.skillTags })));
    return <LessonRunner lesson={activeLesson} onBack={() => setActiveLesson(null)} onComplete={completeLesson} onSave={onSave} onActivity={onActivity} reviewPool={reviewPool} skillStats={progress.skillStats || {}} />;
  }

  if (lastResult) {
    return <LessonResult result={lastResult} onContinue={() => setLastResult(null)} onReview={onGoReview} />;
  }

  return (
    <div className="tg-screen">
      <div className="tg-progress-card">
        <div className="tg-progress-top">
          <div><div className="tg-progress-title">A1 Brazilian Portuguese path</div><div className="tg-progress-meta">{completed.size} of {LESSONS.length} lessons complete</div></div>
          <span className="tg-pill open">{pct}%</span>
        </div>
        <ProgressBar value={pct} />
      </div>

      {(() => {
        let prevLevel = null;
        return COURSE_UNITS.map((unit) => {
          const lvl = UNIT_LEVEL[unit.id] || "";
          const showDivider = lvl && lvl !== prevLevel;
          prevLevel = lvl;
          const lvlLessons = showDivider ? lessonsInLevel(lvl) : [];
          const lvlDone = showDivider ? lvlLessons.filter((l) => completed.has(l.id)).length : 0;
          const lvlComplete = showDivider && lvlLessons.length > 0 && lvlDone === lvlLessons.length;
          return (
            <Fragment key={unit.id}>
              {showDivider ? (
                <div className={`tg-level-divider lvl-${lvl} ${lvlComplete ? "done" : ""}`}>
                  <span className="tg-level-badge">{lvl}</span>
                  <div className="tg-level-info">
                    <b>{LEVEL_LABEL[lvl]}</b>
                    <small>{lvlDone}/{lvlLessons.length} lessons{lvlComplete ? " · complete ✓" : ""}</small>
                  </div>
                </div>
              ) : null}
              <section className="tg-unit">
                <div className="tg-unit-title"><span>{unit.emoji}</span><div><b>{unit.title}</b><small>{unit.subtitle}</small></div></div>
          {LESSONS.filter((lesson) => lesson.unit === unit.id).map((lesson) => {
            const idx = LESSONS.findIndex((l) => l.id === lesson.id);
            const done = completed.has(lesson.id);
            // Unlocked if reached sequentially, OR it's at/below your chosen
            // starting level (so non-beginners can jump in and move freely).
            const levelOk = LEVEL_ORDER.indexOf(UNIT_LEVEL[lesson.unit] || "A1") <= LEVEL_ORDER.indexOf(startLevel || "A1");
            const unlocked = idx === 0 || done || completed.has(LESSONS[idx - 1].id) || levelOk;
            const active = idx === nextIdx && !done;
            const score = progress.lessonScores?.[lesson.id]?.score;
            const timesDone = Number(progress.lessonCounts?.[lesson.id] || 0);
            return (
              <div key={lesson.id} className={`tg-lesson-card lvl-${UNIT_LEVEL[lesson.unit] || "A1"} ${!unlocked ? "locked" : ""} ${active ? "active" : ""}`}>
                <div className="tg-lesson-main">
                  <div className="tg-lesson-emoji">{lesson.emoji}</div>
                  <div className="tg-lesson-info">
                    <div className="tg-lesson-head">
                      <div><div className="tg-lesson-title">{lesson.title}</div><div className="tg-lesson-sub">{lesson.mission} • {lesson.minutes}</div></div>
                      <span className={`tg-pill ${done ? "done" : unlocked ? "open" : "lock"}`}>{done ? "Done" : unlocked ? "Open" : "Locked"}</span>
                    </div>
                    <div className="tg-lesson-tags">{lesson.skillTags.map((tag) => <span key={tag} className="tg-skill">{skillLabel(tag)}</span>)}</div>
                    {score || timesDone ? (
                      <div className="tg-lesson-score">
                        {score ? `Last score: ${score}%` : null}
                        {score && timesDone ? " · " : null}
                        {timesDone ? <span className="tg-times">✓ completed {timesDone}×</span> : null}
                      </div>
                    ) : null}
                    {unlocked ? <div className="tg-lesson-actions"><button className="tg-inline-btn primary" onClick={() => startLesson(lesson)}>{done ? "Practise again" : "Start"}</button><button className="tg-inline-btn" onClick={() => lesson.phrases.forEach((p) => onSave(p.pt, p.en, "learning", lesson.skillTags))}>Save phrases</button></div> : <div className="tg-small-note">Complete the previous lesson to unlock this one.</div>}
                  </div>
                </div>
              </div>
            );
          })}
              </section>
            </Fragment>
          );
        });
      })()}
    </div>
  );
}
