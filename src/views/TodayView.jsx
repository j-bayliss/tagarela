import { LESSONS, skillLabel } from "../data/lessons";
import { PRONUNCIATION_DRILLS } from "../data/pronunciation";
import { ProgressBar, DailyRing } from "../components/Common";
import { Icons } from "../components/Icons";
import { skillSummary, nextLesson } from "../utils/progress";
import { speak } from "../utils/language";

// A fresh phrase each day, deterministic from the date.
const PHRASE_POOL = LESSONS.flatMap((l) => l.phrases);
const phraseOfDay = () => PHRASE_POOL[Math.floor(Date.now() / 86400000) % PHRASE_POOL.length] || PHRASE_POOL[0];

export default function TodayView({ progress, deck, mistakes, onboarding, daily, dailyGoal = 10, streak, onSavePhrase, onStartLesson, onGoReview, onGoPractice, onStartSession }) {
  const completedCount = progress.completed?.length || 0;
  const coursePct = Math.round((completedCount / LESSONS.length) * 100);
  const due = deck.filter((card) => (card.due || 0) <= Date.now()).length;
  const difficult = deck.filter((card) => card.difficulty === "difficult").length;
  const weak = skillSummary(progress.skillStats).slice(0, 3);
  const lesson = nextLesson(progress);
  const speaking = PRONUNCIATION_DRILLS[(completedCount + difficult) % PRONUNCIATION_DRILLS.length];
  const potd = phraseOfDay();

  const dailyCount = daily?.count || 0;
  const streakCount = streak?.count || 0;
  const goalMet = dailyCount >= dailyGoal;
  // Adaptive recommendation: clear a review backlog first, otherwise learn.
  const reviewFirst = due >= 8;

  return (
    <div className="tg-screen">
      <div className="tg-hero-card compact">
        <div className="tg-today-top">
          <div>
            <div className="tg-hero-emoji">{goalMet ? "🎉" : "🌞"}</div>
            <h1>{goalMet ? "Goal reached!" : "Today's mission"}</h1>
          </div>
          <DailyRing value={dailyCount} goal={dailyGoal} />
        </div>
        <p>{goalMet
          ? "You've hit today's target — anything more is a bonus. Boa!"
          : `${dailyGoal} min. A quick guided session: warm-up review, recall and one spoken phrase.`}</p>
        <div className="tg-today-chips">
          {streakCount > 0 ? <span className="tg-chip fire">🔥 {streakCount}-day streak</span> : null}
          <span className="tg-chip">{Math.min(dailyCount, dailyGoal)}/{dailyGoal} today</span>
        </div>
        {onStartSession ? <button className="tg-btn tg-btn-primary" onClick={onStartSession}>{goalMet ? "Extra session" : "Start today's session"}</button> : null}
      </div>

      {reviewFirst ? (
        <div className="tg-card mission-card primary">
          <div className="tg-label">Next best step</div>
          <div className="tg-mission-line"><span>🔁</span><div><b>Clear your reviews</b><small>{due} cards are due — a quick review locks them in before new material.</small></div></div>
          <button className="tg-btn tg-btn-primary" onClick={onGoReview}>Review {due} cards</button>
        </div>
      ) : (
        <div className="tg-card mission-card primary">
          <div className="tg-label">Next best step</div>
          <div className="tg-mission-line"><span>{lesson.emoji}</span><div><b>{lesson.title}</b><small>{lesson.mission}</small></div></div>
          <button className="tg-btn tg-btn-primary" onClick={() => onStartLesson(lesson)}>Start lesson</button>
        </div>
      )}

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

      <div className="tg-card">
        <div className="tg-label">Phrase of the day</div>
        <div className="tg-big-pt">{potd.pt}</div>
        <div className="tg-meaning">{potd.en}</div>
        <div className="tg-lesson-actions">
          <button className="tg-mini" onClick={() => speak(potd.pt)}>{Icons.speaker} Hear it</button>
          {onSavePhrase ? <button className="tg-mini" onClick={() => onSavePhrase(potd.pt, potd.en, "learning")}>Save to review</button> : null}
        </div>
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
    </div>
  );
}
