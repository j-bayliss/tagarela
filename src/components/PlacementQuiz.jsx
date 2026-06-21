import { useState } from "react";
import { PLACEMENT, PLACEMENT_LEVELS as LEVELS, recommendFromHistory } from "../data/placement";
import { buzz } from "../utils/haptics";

const LEVEL_LABEL = { A1: "Beginner", A2: "Elementary", B1: "Intermediate", B2: "Upper-intermediate", C1: "Advanced" };
const MAX_STEPS = 8;
const START_POS = 1; // begin at A2

// Pick an unused question nearest to the target level (so difficulty adapts).
function pickQuestion(levelIdx, used) {
  for (let d = 0; d < LEVELS.length; d++) {
    for (const li of d === 0 ? [levelIdx] : [levelIdx - d, levelIdx + d]) {
      if (li < 0 || li >= LEVELS.length) continue;
      const lvl = LEVELS[li];
      const candidates = PLACEMENT.map((q, gi) => ({ q, gi })).filter((x) => x.q.level === lvl && !used.includes(x.gi));
      if (candidates.length) return candidates[Math.floor(Math.random() * candidates.length)].gi;
    }
  }
  return null;
}

export default function PlacementQuiz({ onClose, onApply }) {
  const [current, setCurrent] = useState(() => pickQuestion(START_POS, []));
  const [used, setUsed] = useState([]);
  const [picked, setPicked] = useState(null);
  const [history, setHistory] = useState([]); // { level, correct }
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);

  const q = current != null ? PLACEMENT[current] : null;

  const pick = (c) => {
    if (picked != null || !q) return;
    const ok = c === q.answer;
    setPicked(c);
    setHistory((h) => h.concat({ level: q.level, correct: ok }));
    buzz(ok ? 10 : [0, 18, 80, 18]);
  };

  const next = () => {
    const lastOk = picked === q.answer;
    const curIdx = LEVELS.indexOf(q.level);
    const newPos = lastOk ? Math.min(LEVELS.length - 1, curIdx + 1) : Math.max(0, curIdx - 1);
    const newUsed = used.concat(current);
    const nextGi = pickQuestion(newPos, newUsed);
    if (step >= MAX_STEPS || nextGi == null) { buzz([0, 30, 40, 30]); setDone(true); return; }
    setUsed(newUsed);
    setCurrent(nextGi);
    setPicked(null);
    setStep((s) => s + 1);
  };

  // Recommendation: the highest level at which an answer was correct (the
  // adaptive staircase means you only reach hard questions by passing easier
  // ones first, so this is self-gating). No correct answers → A1.
  const correctCount = history.filter((h) => h.correct).length;
  const rec = recommendFromHistory(history);

  return (
    <div className="tg-sheet-backdrop" role="dialog" aria-modal="true">
      <div className="tg-sheet">
        {!done ? (
          <>
            <div className="tg-sheet-head"><div><b>Placement quiz</b><small>Question {step} of {MAX_STEPS} · adapts as you go</small></div><button onClick={onClose}>×</button></div>
            <div className="tg-card">
              <div className="tg-read-qtext">{q.prompt}</div>
              <div className="tg-options">
                {q.choices.map((c) => {
                  let cls = "";
                  if (picked != null) { if (c === q.answer) cls = "correct-pick"; else if (c === picked) cls = "wrong-pick"; }
                  return <button key={c} disabled={picked != null} className={cls} onClick={() => pick(c)}>{c}</button>;
                })}
              </div>
              {picked != null ? <button className="tg-btn tg-btn-primary" onClick={next}>{step >= MAX_STEPS ? "See result" : "Next"}</button> : null}
            </div>
            <p className="tg-footnote">Questions get harder or easier based on your answers. This only recommends a starting point — it won't change your progress.</p>
          </>
        ) : (
          <>
            <div className="tg-sheet-head"><div><b>Recommended start</b></div><button onClick={onClose}>×</button></div>
            <div className="tg-result-card">
              <div className="tg-hero-emoji">🎯</div>
              <h2>{rec} · {LEVEL_LABEL[rec]}</h2>
              <p>You answered {correctCount} of {history.length} correctly.</p>
            </div>
            <button className="tg-btn tg-btn-primary" onClick={() => onApply(rec)}>Use {rec} as my starting level</button>
            <button className="tg-btn tg-btn-ghost" onClick={onClose}>Maybe later</button>
            <p className="tg-footnote">Recommendation only — you can change your starting level any time, and higher levels still unlock as you progress.</p>
          </>
        )}
      </div>
    </div>
  );
}
