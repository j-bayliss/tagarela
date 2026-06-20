import { useEffect, useMemo, useState } from "react";
import { dueCards, reschedule } from "../services/spacedRepetition";
import { nextLesson } from "../utils/progress";
import { speak } from "../utils/language";
import { ProgressBar, Confetti, CountUp } from "../components/Common";
import { Icons } from "../components/Icons";
import { PRONUNCIATION_DRILLS } from "../data/pronunciation";
import { buzz } from "../utils/haptics";

function buildPlan(deck, progress) {
  const lesson = nextLesson(progress);
  const review = dueCards(deck).slice(0, 6);
  const recall = (lesson.phrases || []).slice(0, 4);
  const speakItem = (lesson.phrases && lesson.phrases[0]) || PRONUNCIATION_DRILLS[0];
  const steps = [];
  if (review.length) steps.push({ type: "review", items: review });
  if (recall.length) steps.push({ type: "recall", items: recall, lesson });
  steps.push({ type: "speak", item: speakItem, lesson });
  return { steps, lesson };
}

export default function SessionView({ deck, setDeck, addCard, progress, onActivity, onClose }) {
  const plan = useMemo(() => buildPlan(deck, progress), []); // freeze plan at session start
  const steps = plan.steps;
  const [stepIndex, setStepIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [tally, setTally] = useState({ reviewed: 0, recalled: 0, saved: 0, spoke: 0 });

  const bump = (key) => setTally((t) => ({ ...t, [key]: t[key] + 1 }));
  const act = () => { buzz(8); if (onActivity) onActivity(); };

  const advance = () => {
    setShow(false);
    setSubIndex(0);
    setStepIndex((i) => i + 1);
  };
  const nextSub = (items) => {
    setShow(false);
    if (subIndex + 1 >= items.length) advance();
    else setSubIndex((n) => n + 1);
  };

  const done = stepIndex >= steps.length;
  useEffect(() => { if (done) buzz([0, 30, 40, 30]); }, [done]);
  const pct = Math.round((stepIndex / steps.length) * 100);
  const step = steps[stepIndex];

  return (
    <div className="tg-screen tg-session">
      <div className="tg-session-head">
        <button className="tg-back" onClick={onClose} aria-label="Close session">✕ Exit</button>
        <div className="tg-session-progress"><ProgressBar value={done ? 100 : pct} /></div>
      </div>

      {done ? (
        <div className="tg-summary">
          <Confetti />
          <div className="tg-hero-emoji tg-pop">🎉</div>
          <h1>Session complete</h1>
          <p className="tg-expl">Boa! You showed up today — that's what builds fluency.</p>
          <div className="tg-summary-grid">
            <div className="tg-stat"><b><CountUp value={tally.reviewed} /></b><span>reviewed</span></div>
            <div className="tg-stat"><b><CountUp value={tally.recalled} /></b><span>recalled</span></div>
            <div className="tg-stat"><b><CountUp value={tally.spoke} /></b><span>spoken</span></div>
            <div className="tg-stat"><b><CountUp value={tally.saved} /></b><span>saved</span></div>
          </div>
          <button className="tg-btn tg-btn-primary" onClick={onClose}>Done</button>
        </div>
      ) : step.type === "review" ? (
        <>
          <div className="tg-label">Warm-up · review ({subIndex + 1}/{step.items.length})</div>
          <button className={"tg-flash" + (show ? " is-flipped" : "")} onClick={() => setShow((s) => !s)}>
            <span className="tg-flash-front">{step.items[subIndex].pt}</span>
            {show ? <span className="tg-flash-back">{step.items[subIndex].en}</span> : <span className="tg-flash-hint">tap to reveal</span>}
          </button>
          <button className="tg-mini" onClick={() => speak(step.items[subIndex].pt)}>{Icons.speaker} Hear phrase</button>
          {show ? (
            <div className="tg-rate">
              {["again", "good", "easy"].map((g) => (
                <button key={g} className={g} onClick={() => {
                  const card = step.items[subIndex];
                  setDeck((prev) => prev.map((item) => item.id === card.id ? reschedule(item, g) : item));
                  bump("reviewed"); act(); nextSub(step.items);
                }}>{g === "again" ? "Again" : g === "good" ? "Good" : "Easy"}</button>
              ))}
            </div>
          ) : null}
        </>
      ) : step.type === "recall" ? (
        <>
          <div className="tg-label">{step.lesson.emoji} {step.lesson.title} · recall ({subIndex + 1}/{step.items.length})</div>
          <div className="tg-card">
            <div className="tg-meaning">Say it in Portuguese</div>
            <div className="tg-big-pt">{step.items[subIndex].en}</div>
            {show ? (
              <>
                <div className="tg-corrected">{step.items[subIndex].pt}</div>
                <button className="tg-mini" onClick={() => speak(step.items[subIndex].pt)}>{Icons.speaker} Hear it</button>
                <div className="tg-rate">
                  <button className="good" onClick={() => { bump("recalled"); act(); nextSub(step.items); }}>Got it</button>
                  <button className="again" onClick={() => {
                    const it = step.items[subIndex];
                    addCard(it.pt, it.en, "difficult", step.lesson.skillTags || []);
                    bump("recalled"); bump("saved"); act(); nextSub(step.items);
                  }}>Missed — save it</button>
                </div>
              </>
            ) : (
              <button className="tg-btn tg-btn-primary" onClick={() => setShow(true)}>Show answer</button>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="tg-label">Speak it out loud</div>
          <div className="tg-card">
            <div className="tg-big-pt">{step.item.pt}</div>
            <div className="tg-meaning">{step.item.en}</div>
            <button className="tg-btn tg-btn-ghost" onClick={() => speak(step.item.pt)}>{Icons.speaker} Hear it</button>
            <button className="tg-btn tg-btn-primary" onClick={() => { bump("spoke"); act(); advance(); }}>I said it</button>
          </div>
        </>
      )}
    </div>
  );
}
