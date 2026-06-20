import { useEffect, useMemo, useRef, useState } from "react";

const prefersReduced = () => {
  try { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
  catch { return false; }
};

export function ProgressBar({ value }) {
  return <div className="tg-bar"><i style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>;
}

export function EmptyState({ title, text, action }) {
  return <div className="tg-empty"><b>{title}</b><span>{text}</span>{action}</div>;
}

export function Dots() {
  return <div className="tg-dots" aria-label="Typing"><i/><i/><i/></div>;
}

export function CountUp({ value, duration = 600 }) {
  const [n, setN] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const from = prev.current;
    const to = Number(value) || 0;
    prev.current = to;
    if (from === to || prefersReduced()) { setN(to); return; }
    let raf;
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round(from + (to - from) * p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{n}</>;
}

const CONFETTI_COLORS = ["#1E7A5E", "#E85C3F", "#F2A93C", "#13573F"];
export function Confetti({ count = 26 }) {
  const pieces = useMemo(() => Array.from({ length: count }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.3,
    rot: Math.random() * 360,
    bg: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  })), [count]);
  if (prefersReduced()) return null;
  return (
    <div className="tg-confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <span key={i} style={{ left: `${p.left}%`, background: p.bg, animationDelay: `${p.delay}s`, transform: `rotate(${p.rot}deg)` }} />
      ))}
    </div>
  );
}

export function DailyRing({ value = 0, goal = 10 }) {
  const pct = goal > 0 ? Math.max(0, Math.min(1, value / goal)) : 0;
  const r = 13;
  const c = 2 * Math.PI * r;
  const done = pct >= 1;
  return (
    <div className="tg-ring" title={`${value}/${goal} hoje`} aria-label={`Daily goal ${value} of ${goal}`}>
      <svg viewBox="0 0 32 32" width="30" height="30">
        <circle cx="16" cy="16" r={r} fill="none" stroke="rgba(30,122,94,.18)" strokeWidth="4" />
        <circle cx="16" cy="16" r={r} fill="none" stroke={done ? "#E8553A" : "#1E7A5E"} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct)} transform="rotate(-90 16 16)"
          style={{ transition: "stroke-dashoffset .6s ease, stroke .3s ease" }} />
      </svg>
      <span className="tg-ring-label">{done ? "✓" : <CountUp value={value} />}</span>
    </div>
  );
}
