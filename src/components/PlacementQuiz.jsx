import { useState } from "react";
import { PLACEMENT, recommendLevel } from "../data/placement";
import { buzz } from "../utils/haptics";

const LEVEL_LABEL = { A1: "Beginner", A2: "Elementary", B1: "Intermediate", B2: "Upper-intermediate", C1: "Advanced" };

export default function PlacementQuiz({ onClose, onApply }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const q = PLACEMENT[i];
  const rec = done ? recommendLevel(correct, PLACEMENT.length) : null;

  const pick = (c) => {
    if (picked != null) return;
    const ok = c === q.answer;
    setPicked(c);
    if (ok) setCorrect((n) => n + 1);
    buzz(ok ? 10 : [0, 18, 80, 18]);
  };
  const next = () => {
    if (i + 1 >= PLACEMENT.length) { buzz([0, 30, 40, 30]); setDone(true); }
    else { setI(i + 1); setPicked(null); }
  };

  return (
    <div className="tg-sheet-backdrop" role="dialog" aria-modal="true">
      <div className="tg-sheet">
        {!done ? (
          <>
            <div className="tg-sheet-head"><div><b>Placement quiz</b><small>Question {i + 1} of {PLACEMENT.length}</small></div><button onClick={onClose}>×</button></div>
            <div className="tg-card">
              <div className="tg-read-qtext">{q.prompt}</div>
              <div className="tg-options">
                {q.choices.map((c) => {
                  let cls = "";
                  if (picked != null) { if (c === q.answer) cls = "correct-pick"; else if (c === picked) cls = "wrong-pick"; }
                  return <button key={c} disabled={picked != null} className={cls} onClick={() => pick(c)}>{c}</button>;
                })}
              </div>
              {picked != null ? <button className="tg-btn tg-btn-primary" onClick={next}>{i + 1 >= PLACEMENT.length ? "See result" : "Next"}</button> : null}
            </div>
            <p className="tg-footnote">This only recommends a starting point — it won't change your progress.</p>
          </>
        ) : (
          <>
            <div className="tg-sheet-head"><div><b>Recommended start</b></div><button onClick={onClose}>×</button></div>
            <div className="tg-result-card">
              <div className="tg-hero-emoji">🎯</div>
              <h2>{rec} · {LEVEL_LABEL[rec]}</h2>
              <p>You got {correct} of {PLACEMENT.length} right.</p>
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
