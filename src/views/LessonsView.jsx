import { useEffect, useRef, useState } from "react";
import { COURSE_UNITS, LESSONS, skillLabel } from "../data/lessons";
import { normaliseAnswer, speak } from "../utils/language";
import { ProgressBar, XpPop } from "../components/Common";
import { Icons } from "../components/Icons";
import { buzz } from "../utils/haptics";

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function makeExercises(lesson) {
  const phrases = (lesson.phrases || []).filter((p) => p && p.pt && p.en);
  const allEnglish = LESSONS.flatMap((l) => l.phrases.map((p) => p.en));
  const distractors = (correct) => shuffle(allEnglish.filter((x) => x !== correct)).slice(0, 3);
  const tags = lesson.skillTags;
  const multiWord = (p) => p.pt.trim().split(/\s+/).length >= 2;

  const choice = (p, title = "Meaning check", listen = false) => ({
    type: "choice", listen, title,
    prompt: p.pt, answer: p.en,
    choices: shuffle([p.en, ...distractors(p.en)]),
    tags, say: p.pt, review: { pt: p.pt, en: p.en },
  });
  const order = (p) => ({
    type: "order", title: "Build the phrase",
    prompt: p.en, answer: p.pt, words: shuffle(p.pt.split(/\s+/)),
    tags, say: p.pt, review: { pt: p.pt, en: p.en },
  });
  const blank = (p) => {
    const words = p.pt.split(/\s+/);
    const bi = Math.max(0, Math.min(words.length - 1, Math.floor(words.length / 2)));
    const answerWord = words[bi].replace(/[.,!?]/g, "");
    const prompt = words.map((w, i) => (i === bi ? "____" : w)).join(" ");
    return { type: "blank", title: "Missing word", prompt, answer: answerWord, full: p.pt, translation: p.en, tags, say: p.pt, review: { pt: p.pt, en: p.en } };
  };
  const dictation = (p) => ({
    type: "dictation", title: "Listen and type",
    prompt: p.pt, answer: p.pt, translation: p.en,
    tags: [...tags, "listening"], say: p.pt, review: { pt: p.pt, en: p.en },
  });

  // One exercise per phrase, cycling through types so longer lessons = more
  // questions. Single-word phrases skip word-order / fill-in-the-blank.
  const ex = [];
  phrases.forEach((p, i) => {
    const cycle = i % 4;
    if (cycle === 0) ex.push(choice(p));
    else if (cycle === 1) ex.push(multiWord(p) ? order(p) : choice(p, "Listen & choose", true));
    else if (cycle === 2) ex.push(multiWord(p) ? blank(p) : dictation(p));
    else ex.push(dictation(p));
  });

  // Mixed extras for variety: a listening-choice and a dictation recall.
  if (phrases[0]) ex.push(choice(phrases[0], "Listen & choose", true));
  if (phrases[1]) ex.push(dictation(phrases[1]));

  return ex.length ? ex : [choice(phrases[0] || { pt: "Oi", en: "Hi" })];
}

function Exercise({ exercise, onAnswer }) {
  const [selected, setSelected] = useState("");
  const [typed, setTyped] = useState("");
  const [built, setBuilt] = useState([]);
  const [pool, setPool] = useState(exercise.words || []);
  const [eliminated, setEliminated] = useState([]);
  const [hadMistake, setHadMistake] = useState(false);

  const meta = { tags: exercise.tags, title: exercise.title, say: exercise.say, review: exercise.review };

  const submit = (value) => {
    const answer = value ?? selected ?? typed;
    const correct = normaliseAnswer(answer) === normaliseAnswer(exercise.answer);
    onAnswer({ correct, userAnswer: answer, expected: exercise.answer, ...meta });
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
        <textarea className="tg-ta" value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Type what you hear in Portuguese" />
        <button className="tg-btn tg-btn-primary" disabled={!typed.trim()} onClick={() => submit(typed)}>Check</button>
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
      <button className="tg-mini" onClick={() => speak(exercise.full)}>{Icons.speaker} Hear full phrase</button>
      <button className="tg-btn tg-btn-primary" disabled={!typed.trim()} onClick={() => submit(typed)}>Check</button>
    </div>
  );
}

const XP_PER_CORRECT = 10;

function LessonRunner({ lesson, onBack, onComplete, onSave, onActivity }) {
  const exercises = useRef(makeExercises(lesson)).current;
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [streak, setStreak] = useState(0);

  const handleAnswer = (result) => {
    // distinct patterns: single soft pulse = correct, double knock = wrong
    buzz(result.correct ? 10 : [0, 18, 80, 18]);
    // Speak the correct phrase aloud when the user gets it wrong (skip choice recoveries)
    if (!result.correct && !result.recovered && result.say) speak(result.say);
    setStreak((s) => (result.correct ? s + 1 : 0));
    setFeedback(result);
    if (onActivity) onActivity();
  };

  const next = () => {
    const nextResults = feedback ? results.concat(feedback) : results;
    setResults(nextResults);
    setFeedback(null);
    if (idx >= exercises.length - 1) {
      const correct = nextResults.filter((r) => r.correct).length;
      const score = Math.round((correct / exercises.length) * 100);
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
        <button className="tg-btn tg-btn-primary" onClick={() => { buzz(12); setStarted(true); }}>Start playful challenge</button>
      </div>
    );
  }

  return (
    <div className="tg-screen">
      <button className="tg-back" onClick={onBack}>← Exit lesson</button>
      <div className="tg-progress-card compact">
        <div className="tg-progress-top">
          <b>{lesson.emoji} {lesson.title}</b>
          <span>{streak >= 3 ? <span className="tg-streak-badge">🔥 {streak} in a row!</span> : null}{idx + 1}/{exercises.length}</span>
        </div>
        <ProgressBar value={((idx + 1) / exercises.length) * 100} />
      </div>
      <details className="tg-learn-tip">
        <summary>💡 Quick reminder</summary>
        <p>{lesson.teach}</p>
      </details>
      <Exercise key={idx} exercise={exercises[idx]} onAnswer={handleAnswer} />
      {feedback ? (
        <div className={`tg-feedback ${feedback.correct ? "correct" : feedback.recovered ? "recovered" : "incorrect"}`}>
          {feedback.correct && <XpPop key={`xp-${idx}`} amount={XP_PER_CORRECT} />}
          {feedback.correct ? (
            <>
              <b>Boa! 🎉</b>
              <span>{streak >= 3 ? `🔥 ${streak} in a row — you're on fire!` : "That one goes into your confidence bank."}</span>
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
          <button className="tg-btn tg-btn-primary" onClick={() => { buzz(10); next(); }}>{idx >= exercises.length - 1 ? "See result" : "Next"}</button>
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

export default function LessonsView({ progress, setProgress, onSave, onGoReview, launchLesson, onConsumeLaunch, onActivity }) {
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
    setProgress((current) => {
      const done = current.completed?.includes(lesson.id) ? current.completed : [...(current.completed || []), lesson.id];
      let skillStats = current.skillStats || {};
      outcome.results.forEach((item) => {
        (item.tags || lesson.skillTags || []).forEach((tag) => {
          const cur = skillStats[tag] || { correct: 0, attempts: 0 };
          skillStats = { ...skillStats, [tag]: { correct: cur.correct + (item.correct ? 1 : 0), attempts: cur.attempts + 1 } };
        });
      });
      return {
        ...current,
        completed: done,
        activeLessonId: (LESSONS.find((l) => !done.includes(l.id)) || lesson).id,
        lessonScores: { ...(current.lessonScores || {}), [lesson.id]: { score, when: Date.now() } },
        skillStats,
        xp: Number(current.xp || 0) + Math.max(40, score),
        lastLessonAt: Date.now(),
      };
    });
    lesson.phrases.forEach((phrase) => onSave(phrase.pt, phrase.en, score < 70 ? "difficult" : "learning", lesson.skillTags));
    setActiveLesson(null);
    setLastResult({ lesson, score, results: outcome.results });
  };

  if (activeLesson) {
    return <LessonRunner lesson={activeLesson} onBack={() => setActiveLesson(null)} onComplete={completeLesson} onSave={onSave} onActivity={onActivity} />;
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

      {COURSE_UNITS.map((unit) => (
        <section key={unit.id} className="tg-unit">
          <div className="tg-unit-title"><span>{unit.emoji}</span><div><b>{unit.title}</b><small>{unit.subtitle}</small></div></div>
          {LESSONS.filter((lesson) => lesson.unit === unit.id).map((lesson) => {
            const idx = LESSONS.findIndex((l) => l.id === lesson.id);
            const done = completed.has(lesson.id);
            const unlocked = idx === 0 || completed.has(LESSONS[idx - 1].id) || done;
            const active = idx === nextIdx && !done;
            const score = progress.lessonScores?.[lesson.id]?.score;
            return (
              <div key={lesson.id} className={`tg-lesson-card ${!unlocked ? "locked" : ""} ${active ? "active" : ""}`}>
                <div className="tg-lesson-main">
                  <div className="tg-lesson-emoji">{lesson.emoji}</div>
                  <div className="tg-lesson-info">
                    <div className="tg-lesson-head">
                      <div><div className="tg-lesson-title">{lesson.title}</div><div className="tg-lesson-sub">{lesson.mission} • {lesson.minutes}</div></div>
                      <span className={`tg-pill ${done ? "done" : unlocked ? "open" : "lock"}`}>{done ? "Done" : unlocked ? "Open" : "Locked"}</span>
                    </div>
                    <div className="tg-lesson-tags">{lesson.skillTags.map((tag) => <span key={tag} className="tg-skill">{skillLabel(tag)}</span>)}</div>
                    {score ? <div className="tg-lesson-score">Last score: {score}%</div> : null}
                    {unlocked ? <div className="tg-lesson-actions"><button className="tg-inline-btn primary" onClick={() => startLesson(lesson)}>{done ? "Practise again" : "Start"}</button><button className="tg-inline-btn" onClick={() => lesson.phrases.forEach((p) => onSave(p.pt, p.en, "learning", lesson.skillTags))}>Save phrases</button></div> : <div className="tg-small-note">Complete the previous lesson to unlock this one.</div>}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
