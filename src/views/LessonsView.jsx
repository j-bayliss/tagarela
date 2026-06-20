import { useEffect, useRef, useState } from "react";
import { COURSE_UNITS, LESSONS, skillLabel } from "../data/lessons";
import { normaliseAnswer, speak } from "../utils/language";
import { ProgressBar } from "../components/Common";
import { Icons } from "../components/Icons";

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function makeExercises(lesson) {
  const phrases = lesson.phrases;
  const allEnglish = LESSONS.flatMap((l) => l.phrases.map((p) => p.en));
  const p1 = phrases[0];
  const p2 = phrases[1] || phrases[0];
  const p3 = phrases[2] || phrases[0];
  const p4 = phrases[3] || phrases[0];
  const blankWords = p3.pt.split(/\s+/);
  const blankIndex = Math.max(0, Math.min(blankWords.length - 1, Math.floor(blankWords.length / 2)));
  const answerWord = blankWords[blankIndex].replace(/[.,!?]/g, "");
  const blankPrompt = blankWords.map((w, i) => i === blankIndex ? "____" : w).join(" ");

  return [
    {
      type: "choice",
      title: "Meaning check",
      prompt: p1.pt,
      answer: p1.en,
      choices: shuffle([p1.en, ...shuffle(allEnglish.filter((x) => x !== p1.en)).slice(0, 3)]),
      tags: lesson.skillTags,
    },
    {
      type: "order",
      title: "Build the phrase",
      prompt: p2.en,
      answer: p2.pt,
      words: shuffle(p2.pt.split(/\s+/)),
      tags: lesson.skillTags,
    },
    {
      type: "blank",
      title: "Missing word",
      prompt: blankPrompt,
      answer: answerWord,
      full: p3.pt,
      tags: lesson.skillTags,
    },
    {
      type: "dictation",
      title: "Listen and type",
      prompt: p4.pt,
      answer: p4.pt,
      translation: p4.en,
      tags: [...lesson.skillTags, "listening"],
    },
  ];
}

function Exercise({ exercise, onAnswer }) {
  const [selected, setSelected] = useState("");
  const [typed, setTyped] = useState("");
  const [built, setBuilt] = useState([]);
  const [pool, setPool] = useState(exercise.words || []);

  const submit = (value) => {
    const answer = value ?? selected ?? typed;
    const correct = normaliseAnswer(answer) === normaliseAnswer(exercise.answer);
    onAnswer({ correct, userAnswer: answer, expected: exercise.answer, tags: exercise.tags });
  };

  if (exercise.type === "choice") {
    return (
      <div className="tg-card lesson-exercise">
        <div className="tg-label">{exercise.title}</div>
        <div className="tg-big-pt">{exercise.prompt}</div>
        <button className="tg-mini" onClick={() => speak(exercise.prompt)}>{Icons.speaker} Hear it</button>
        <div className="tg-options">
          {exercise.choices.map((choice) => (
            <button key={choice} className={selected === choice ? "selected" : ""} onClick={() => setSelected(choice)}>{choice}</button>
          ))}
        </div>
        <button className="tg-btn tg-btn-primary" disabled={!selected} onClick={() => submit(selected)}>Check</button>
      </div>
    );
  }

  if (exercise.type === "order") {
    const add = (word, idx) => {
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

  return (
    <div className="tg-card lesson-exercise">
      <div className="tg-label">{exercise.title}</div>
      <div className="tg-big-pt">{exercise.prompt}</div>
      <input className="tg-input full" value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Missing word" />
      <button className="tg-btn tg-btn-primary" disabled={!typed.trim()} onClick={() => submit(typed)}>Check</button>
    </div>
  );
}

function LessonRunner({ lesson, onBack, onComplete, onSave, onActivity }) {
  const exercises = useRef(makeExercises(lesson)).current;
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const handleAnswer = (result) => {
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
          <div className="tg-label">Tiny rule</div>
          <p className="tg-expl">{lesson.rule}</p>
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
        <button className="tg-btn tg-btn-primary" onClick={() => setStarted(true)}>Start playful challenge</button>
      </div>
    );
  }

  return (
    <div className="tg-screen">
      <button className="tg-back" onClick={onBack}>← Exit lesson</button>
      <div className="tg-progress-card compact">
        <div className="tg-progress-top"><b>{lesson.emoji} {lesson.title}</b><span>{idx + 1}/{exercises.length}</span></div>
        <ProgressBar value={((idx + 1) / exercises.length) * 100} />
      </div>
      <Exercise key={idx} exercise={exercises[idx]} onAnswer={handleAnswer} />
      {feedback ? (
        <div className={`tg-feedback ${feedback.correct ? "correct" : "incorrect"}`}>
          <b>{feedback.correct ? "Boa!" : "Almost."}</b>
          <span>{feedback.correct ? "That one goes into your confidence bank." : `Expected: ${feedback.expected}`}</span>
          <button className="tg-btn tg-btn-primary" onClick={next}>{idx >= exercises.length - 1 ? "See result" : "Next"}</button>
        </div>
      ) : null}
    </div>
  );
}

function LessonResult({ result, onContinue, onReview }) {
  const score = result.score;
  return (
    <div className="tg-screen">
      <div className="tg-result-card">
        <div className="tg-hero-emoji">{score >= 80 ? "🎉" : score >= 60 ? "🙂" : "💪"}</div>
        <h2>{score >= 80 ? "Boa! Aula concluída." : "Aula concluída — vamos reforçar."}</h2>
        <div className="tg-score">{score}<small>%</small></div>
        <p>{score >= 80 ? "You’re ready for the next small step." : "I saved the key phrases for review so they come back at the right time."}</p>
      </div>
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
    setLastResult({ lesson, score });
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
