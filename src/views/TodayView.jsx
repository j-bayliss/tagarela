import { LESSONS, skillLabel } from "../data/lessons";
import { PRONUNCIATION_DRILLS } from "../data/pronunciation";
import { ProgressBar } from "../components/Common";
import { skillSummary, nextLesson } from "../utils/progress";

export default function TodayView({ progress, deck, mistakes, onboarding, onStartLesson, onGoReview, onGoPractice, onStartSession }) {
  const completedCount = progress.completed?.length || 0;
  const coursePct = Math.round((completedCount / LESSONS.length) * 100);
  const due = deck.filter((card) => (card.due || 0) <= Date.now()).length;
  const difficult = deck.filter((card) => card.difficulty === "difficult").length;
  const weak = skillSummary(progress.skillStats).slice(0, 3);
  const lesson = nextLesson(progress);
  const speaking = PRONUNCIATION_DRILLS[(completedCount + difficult) % PRONUNCIATION_DRILLS.length];

  return (
    <div className="tg-screen">
      <div className="tg-hero-card compact">
        <div className="tg-hero-emoji">🌞</div>
        <h1>Today's mission</h1>
        <p>{onboarding?.dailyTarget || 10} minutes. One small lesson, a quick review, then one useful spoken phrase.</p>
        {onStartSession ? <button className="tg-btn tg-btn-primary" onClick={onStartSession}>Start today's session</button> : null}
      </div>

      <div className="tg-card mission-card primary">
        <div className="tg-label">Next best step</div>
        <div className="tg-mission-line"><span>{lesson.emoji}</span><div><b>{lesson.title}</b><small>{lesson.mission}</small></div></div>
        <button className="tg-btn tg-btn-primary" onClick={() => onStartLesson(lesson)}>Start lesson</button>
      </div>

      <div className="tg-daily-grid">
        <button className="tg-daily-card" onClick={onGoReview}>
          <b>{due}</b>
          <span>cards due</span>
          <small>{difficult} difficult</small>
        </button>
        <button className="tg-daily-card" onClick={() => onGoPractice("speak")}>
          <b>1</b>
          <span>speaking phrase</span>
          <small>{speaking.pt}</small>
        </button>
      </div>

      <div className="tg-progress-card">
        <div className="tg-progress-top"><div><div className="tg-progress-title">Course progress</div><div className="tg-progress-meta">{completedCount}/{LESSONS.length} lessons • {progress.xp || 0} XP</div></div><span className="tg-pill open">{coursePct}%</span></div>
        <ProgressBar value={coursePct} />
      </div>

      <div className="tg-card">
        <div className="tg-label">Focus areas</div>
        {weak.length ? (
          <div className="tg-lesson-tags spaced">
            {weak.map((item) => <span key={item.tag} className="tg-skill weak">{skillLabel(item.tag)} · {item.pct}%</span>)}
          </div>
        ) : <p className="tg-expl">Complete a few lessons and Tagarela will start spotting weak areas automatically.</p>}
      </div>

      <div className="tg-card calm">
        <div className="tg-label">User feel note</div>
        <p className="tg-expl">You can use lessons and review without API keys. Add Anthropic/Azure later only when you want AI chat or pronunciation scoring.</p>
      </div>
    </div>
  );
}
