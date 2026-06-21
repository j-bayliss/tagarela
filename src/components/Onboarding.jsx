import { useState } from "react";
import PlacementQuiz from "./PlacementQuiz";

const GOALS = [
  { id: "travel", emoji: "✈️", title: "Holiday survival", text: "Cafés, hotels, taxis and useful questions." },
  { id: "conversation", emoji: "💬", title: "Friendly conversation", text: "Introduce yourself and keep simple chats going." },
  { id: "food", emoji: "☕", title: "Food and cafés", text: "Order confidently and understand menus." },
  { id: "course", emoji: "🏆", title: "Full beginner path", text: "A playful A1 course from zero to useful." },
];

const TARGETS = [
  { id: 5, title: "5 min", text: "Tiny daily habit" },
  { id: 10, title: "10 min", text: "Best balance" },
  { id: 15, title: "15 min", text: "Faster progress" },
];

export default function Onboarding({ onComplete }) {
  const [goal, setGoal] = useState("travel");
  const [target, setTarget] = useState(10);
  const [startLevel, setStartLevel] = useState(null);
  const [quizOpen, setQuizOpen] = useState(false);

  if (quizOpen) {
    return <PlacementQuiz onClose={() => setQuizOpen(false)} onApply={(lv) => { setStartLevel(lv); setQuizOpen(false); }} />;
  }

  return (
    <div className="tg-onboarding">
      <div className="tg-hero-card">
        <div className="tg-hero-emoji">🇧🇷</div>
        <h1>Vamos falar português brasileiro.</h1>
        <p>Short, useful, playful lessons first. API keys are optional and can be added later for AI chat and pronunciation scoring.</p>
      </div>

      <div className="tg-card">
        <div className="tg-label">Choose your first goal</div>
        <div className="tg-choice-grid single">
          {GOALS.map((item) => (
            <button key={item.id} className={`tg-choice ${goal === item.id ? "selected" : ""}`} onClick={() => setGoal(item.id)}>
              <span>{item.emoji}</span>
              <b>{item.title}</b>
              <small>{item.text}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="tg-card">
        <div className="tg-label">Daily pace</div>
        <div className="tg-choice-grid">
          {TARGETS.map((item) => (
            <button key={item.id} className={`tg-choice compact ${target === item.id ? "selected" : ""}`} onClick={() => setTarget(item.id)}>
              <b>{item.title}</b>
              <small>{item.text}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="tg-card">
        <div className="tg-label">Already know some Portuguese?</div>
        {startLevel ? (
          <p className="tg-expl">Recommended start: <b>{startLevel}</b>. You can change this any time in settings.</p>
        ) : (
          <p className="tg-expl">Take a quick adaptive placement quiz for a level recommendation — or just start from the beginning.</p>
        )}
        <button className="tg-btn tg-btn-ghost" type="button" onClick={() => setQuizOpen(true)}>{startLevel ? "Retake placement quiz" : "📝 Take placement quiz"}</button>
      </div>

      <button className="tg-btn tg-btn-primary" onClick={() => onComplete({ goal, dailyTarget: target, startLevel: startLevel || "A1", variant: "pt-BR", completedAt: Date.now() })}>
        {startLevel && startLevel !== "A1" ? `Start at ${startLevel}` : "Start Aula 1"}
      </button>
      <p className="tg-footnote">Locked to Brazilian Portuguese for now: pronunciation, lesson wording and tutor prompts all use pt-BR.</p>
    </div>
  );
}
