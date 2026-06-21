import { useEffect, useMemo, useState } from "react";
import { dueCards, reschedule } from "../services/spacedRepetition";
import { nextLesson, orderDueByWeakness, skillSummary } from "../utils/progress";
import { speak, normaliseAnswer } from "../utils/language";
import { LESSONS, skillLabel } from "../data/lessons";
import { ProgressBar, Confetti, CountUp } from "../components/Common";
import { Icons } from "../components/Icons";
import { PRONUNCIATION_DRILLS } from "../data/pronunciation";
import { readJSON } from "../services/storage";
import { buzz } from "../utils/haptics";

const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);

function buildPlan(deck, progress, quiet) {
  const lesson = nextLesson(progress);
  const skillStats = progress.skillStats || {};
  const review = orderDueByWeakness(dueCards(deck), skillStats).slice(0, 6);
  const recall = (lesson.phrases || []).slice(0, 4);

  // Target the weakest skill with a few phrases pulled from other lessons.
  const weakTag = skillSummary(skillStats)[0]?.tag;
  let weakItems = [];
  if (weakTag) {
    const pool = LESSONS.filter((l) => (l.skillTags || []).includes(weakTag) && l.id !== lesson.id).flatMap((l) => l.phrases);
    weakItems = shuffle(pool).slice(0, 3);
  }

  // Listening: hear a phrase, choose its meaning (skipped in no-audio mode).
  const allEn = LESSONS.flatMap((l) => l.phrases.map((p) => p.en));
  const listenItems = (lesson.phrases || []).slice(0, 3).map((p) => ({
    pt: p.pt, en: p.en,
    choices: shuffle([p.en, ...shuffle(allEn.filter((e) => e !== p.en)).slice(0, 2)]),
  }));

  const speakItem = recall[0] || PRONUNCIATION_DRILLS[0];

  const steps = [];
  if (review.length) steps.push({ type: "review", items: review });
  if (weakItems.length) steps.push({ type: "recall", items: weakItems, lesson: { skillTags: [weakTag] }, label: `Weak spot · ${skillLabel(weakTag)}` });
  if (recall.length) steps.push({ type: "recall", items: recall, lesson, label: `${lesson.emoji} ${lesson.title} · recall` });
  if (!quiet && listenItems.length) steps.push({ type: "listen", items: listenItems });
  steps.push(quiet ? { type: "produce", item: speakItem, lesson } : { type: "speak", item: speakItem, lesson });
  return { steps, lesson };
}

export default function SessionView({ deck, setDeck, addCard, progress, onActivity, onClose }) {
  const quiet = useMemo(() => Boolean(readJSON("tagarela:quietMode", false)), []);
  const plan = useMemo(() => buildPlan(deck, progress, quiet), []); // freeze plan at session start
  const steps = plan.steps;
  const [stepIndex, setStepIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState("");
  const [answered, setAnswered] = useState(false);
  const [tally, setTally] = useState({ reviewed: 0, recalled: 0, saved: 0, spoke: 0 });

  const bump = (key) => setTally((t) => ({ ...t, [key]: t[key] + 1 }));
  const act = () => { buzz(8); if (onActivity) onActivity(); };
  const resetSub = () => { setShow(false); setPicked(null); setTyped(""); setAnswered(false); };

  const advance = () => { resetSub(); setSubIndex(0); setStepIndex((i) => i + 1); };
  const nextSub = (items) => {
    resetSub();
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
            <div className="tg-stat"><b><CountUp value={tally.spoke} /></b><span>{quiet ? "typed" : "spoken"}</span></div>
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
          {!quiet ? <button className="tg-mini" onClick={() => speak(step.items[subIndex].pt)}>{Icons.speaker} Hear phrase</button> : null}
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
          <div className="tg-label">{step.label || "Recall"} ({subIndex + 1}/{step.items.length})</div>
          <div className="tg-card">
            <div className="tg-meaning">Say it in Portuguese</div>
            <div className="tg-big-pt">{step.items[subIndex].en}</div>
            {show ? (
              <>
                <div className="tg-corrected">{step.items[subIndex].pt}</div>
                {!quiet ? <button className="tg-mini" onClick={() => speak(step.items[subIndex].pt)}>{Icons.speaker} Hear it</button> : null}
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
      ) : step.type === "listen" ? (
        <>
          <div className="tg-label">Listen & choose ({subIndex + 1}/{step.items.length})</div>
          <div className="tg-card">
            <button className="tg-listen" onClick={() => speak(step.items[subIndex].pt)}>{Icons.speaker} Play phrase</button>
            <div className="tg-options">
              {step.items[subIndex].choices.map((c) => {
                const it = step.items[subIndex];
                let cls = "";
                if (picked != null) { if (c === it.en) cls = "correct-pick"; else if (c === picked) cls = "wrong-pick"; }
                return (
                  <button key={c} disabled={picked != null} className={cls} onClick={() => {
                    const ok = c === it.en;
                    setPicked(c); buzz(ok ? 10 : [0, 18, 80, 18]);
                    if (ok) bump("recalled"); else { addCard(it.pt, it.en, "difficult", ["listening"]); bump("saved"); }
                  }}>{c}</button>
                );
              })}
            </div>
            {picked != null ? <button className="tg-btn tg-btn-primary" onClick={() => { act(); nextSub(step.items); }}>Next</button> : null}
          </div>
        </>
      ) : step.type === "produce" ? (
        <>
          <div className="tg-label">Type it in Portuguese</div>
          <div className="tg-card">
            <div className="tg-big-pt">{step.item.en}</div>
            {answered ? (
              <>
                <div className={`tg-feedback ${picked ? "correct" : "incorrect"}`}>
                  <b>{picked ? "Boa! 🎉" : "Almost."}</b>
                  <span>{step.item.pt}</span>
                </div>
                <button className="tg-btn tg-btn-primary" onClick={() => { bump(picked ? "spoke" : "saved"); act(); advance(); }}>Finish</button>
              </>
            ) : (
              <>
                <textarea className="tg-ta" value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Type it in Portuguese…" autoCapitalize="none" autoCorrect="off" spellCheck="false" />
                <button className="tg-btn tg-btn-primary" disabled={!typed.trim()} onClick={() => {
                  const ok = normaliseAnswer(typed) === normaliseAnswer(step.item.pt);
                  setPicked(ok); setAnswered(true);
                  if (!ok) addCard(step.item.pt, step.item.en, "difficult", step.lesson?.skillTags || []);
                }}>Check</button>
              </>
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
