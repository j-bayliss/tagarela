import { Icons } from "./Icons";
import { DailyRing } from "./Common";

export default function Header({ streak, progress, daily, dailyGoal, onSettings }) {
  return (
    <header className="tg-header">
      <div className="tg-brandrow">
        <div>
          <div className="tg-brand">tagarel<span>a</span></div>
          <div className="tg-tagline">Seu parceiro de português brasileiro</div>
        </div>
        <div className="tg-head-actions">
          {typeof daily === "number" ? <DailyRing value={daily} goal={dailyGoal || 10} /> : null}
          {streak?.count > 0 ? <div className="tg-chip fire">🔥 {streak.count}</div> : null}
          <button className="tg-gear" onClick={onSettings} aria-label="Settings">{Icons.gear}</button>
        </div>
      </div>
      <svg className="tg-wave" viewBox="0 0 480 26" preserveAspectRatio="none" aria-hidden="true"><path d="M0 16 C70 0, 150 0, 240 16 S410 32, 480 12" fill="none" stroke="rgba(30,122,94,.20)" strokeWidth="4" strokeLinecap="round"/></svg>
    </header>
  );
}
