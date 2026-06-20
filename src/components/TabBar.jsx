import { Icons } from "./Icons";

export const TABS = [
  { id: "today", label: "Hoje", icon: "today" },
  { id: "lessons", label: "Aulas", icon: "lessons" },
  { id: "practice", label: "Praticar", icon: "practice" },
  { id: "review", label: "Revisão", icon: "review" },
];

export default function TabBar({ active, onChange, dueCount }) {
  return (
    <nav className="tg-tabbar">
      {TABS.map((tab) => (
        <button key={tab.id} className={`tg-tab ${active === tab.id ? "active" : ""}`} onClick={() => onChange(tab.id)} aria-label={tab.label}>
          <span className="tg-tabicon">{Icons[tab.icon]}</span>
          <span className="lbl">{tab.label}</span>
          {tab.id === "review" && dueCount > 0 ? <span className="tg-tabbadge">{dueCount > 99 ? "99+" : dueCount}</span> : null}
        </button>
      ))}
    </nav>
  );
}
