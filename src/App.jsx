import { useEffect, useState } from "react";
import Header from "./components/Header";
import TabBar from "./components/TabBar";
import Onboarding from "./components/Onboarding";
import SettingsSheet from "./components/SettingsSheet";
import TodayView from "./views/TodayView";
import LessonsView from "./views/LessonsView";
import PracticeView from "./views/PracticeView";
import ReviewView from "./views/ReviewView";
import SessionView from "./views/SessionView";
import { KEYS, dayString, readJSON, writeJSON } from "./services/storage";
import { makeCard, normaliseCard } from "./services/spacedRepetition";
import { defaultProgress, normaliseProgress } from "./utils/progress";

function makeMistake(input) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    original: input.original || "",
    correctedPt: input.correctedPt || "",
    note: input.note || "",
    grammarPoint: input.grammarPoint || "",
    examplePt: input.examplePt || "",
    exampleEn: input.exampleEn || "",
    ts: Date.now(),
  };
}

function normaliseMistake(mistake) {
  return {
    id: mistake.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    original: mistake.original || "",
    correctedPt: mistake.correctedPt || "",
    note: mistake.note || "",
    grammarPoint: mistake.grammarPoint || "",
    examplePt: mistake.examplePt || "",
    exampleEn: mistake.exampleEn || "",
    ts: Number(mistake.ts || Date.now()),
  };
}

function updateStreak(existing) {
  const today = dayString();
  const current = existing && existing.last ? existing : { count: 0, last: "" };
  if (current.last === today) return current;
  const yesterday = dayString(Date.now() - 86400000);
  return { count: current.last === yesterday ? Number(current.count || 0) + 1 : 1, last: today };
}

export default function App() {
  const [tab, setTab] = useState("today");
  const [loaded, setLoaded] = useState(false);
  const [onboarding, setOnboarding] = useState(null);
  const [deck, setDeck] = useState([]);
  const [mistakes, setMistakes] = useState([]);
  const [streak, setStreak] = useState({ count: 0, last: "" });
  const [daily, setDaily] = useState({ day: "", count: 0 });
  const [online, setOnline] = useState(typeof navigator === "undefined" ? true : navigator.onLine !== false);
  const [sessionOpen, setSessionOpen] = useState(false);

  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => { window.removeEventListener("online", up); window.removeEventListener("offline", down); };
  }, []);

  useEffect(() => {
    const pref = (onboarding && onboarding.theme) || "system";
    const mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
    const apply = () => {
      const resolved = pref === "system" ? (mq && mq.matches ? "dark" : "light") : pref;
      document.documentElement.dataset.theme = resolved;
    };
    apply();
    if (pref === "system" && mq) {
      const onChange = () => apply();
      try { mq.addEventListener("change", onChange); } catch { if (mq.addListener) mq.addListener(onChange); }
      return () => { try { mq.removeEventListener("change", onChange); } catch { if (mq.removeListener) mq.removeListener(onChange); } };
    }
  }, [onboarding]);
  const [progress, setProgress] = useState(defaultProgress());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [launchLesson, setLaunchLesson] = useState(null);
  const [practiceMode, setPracticeMode] = useState("phrasebook");

  useEffect(() => {
    const savedOnboarding = readJSON(KEYS.onboarding, null);
    const savedDeck = readJSON(KEYS.deck, []);
    const savedMistakes = readJSON(KEYS.mistakes, []);
    const savedProgress = readJSON(KEYS.progress, defaultProgress());
    const savedStreak = readJSON(KEYS.streak, { count: 0, last: "" });
    const savedDaily = readJSON(KEYS.daily, { day: "", count: 0 });

    setOnboarding(savedOnboarding);
    setDeck(Array.isArray(savedDeck) ? savedDeck.map(normaliseCard) : []);
    setMistakes(Array.isArray(savedMistakes) ? savedMistakes.map(normaliseMistake) : []);
    setProgress(normaliseProgress(savedProgress));
    setStreak(updateStreak(savedStreak));
    const today = dayString();
    setDaily(savedDaily && savedDaily.day === today ? savedDaily : { day: today, count: 0 });
    setLoaded(true);

    try { window.speechSynthesis?.getVoices(); } catch {}
  }, []);

  useEffect(() => { if (loaded) writeJSON(KEYS.deck, deck); }, [deck, loaded]);
  useEffect(() => { if (loaded) writeJSON(KEYS.mistakes, mistakes); }, [mistakes, loaded]);
  useEffect(() => { if (loaded) writeJSON(KEYS.progress, progress); }, [progress, loaded]);
  useEffect(() => { if (loaded) writeJSON(KEYS.streak, streak); }, [streak, loaded]);
  useEffect(() => { if (loaded) writeJSON(KEYS.daily, daily); }, [daily, loaded]);
  useEffect(() => { if (loaded) writeJSON(KEYS.onboarding, onboarding); }, [onboarding, loaded]);

  const addCard = (pt, en, difficulty = "learning", tags = []) => {
    if (!pt || !String(pt).trim()) return;
    setDeck((prev) => {
      const exists = prev.some((card) => card.pt.trim().toLowerCase() === String(pt).trim().toLowerCase());
      if (exists) return prev;
      return prev.concat(makeCard(String(pt).trim(), String(en || "").trim(), difficulty, tags));
    });
  };

  const addMistake = (payload) => {
    const item = makeMistake(payload || {});
    if (!item.note && !item.correctedPt && !item.grammarPoint) return;
    setMistakes((prev) => {
      const exists = prev.some((m) => m.original === item.original && m.correctedPt === item.correctedPt && m.note === item.note);
      return exists ? prev : [item, ...prev];
    });
  };

  const importData = (data) => {
    setDeck(Array.isArray(data.deck) ? data.deck.map(normaliseCard) : []);
    setMistakes(Array.isArray(data.mistakes) ? data.mistakes.map(normaliseMistake) : []);
    setProgress(normaliseProgress(data.progress || data.classProgress));
    setStreak(data.streak && typeof data.streak === "object" ? data.streak : { count: 0, last: "" });
    if (data.onboarding) setOnboarding({ ...data.onboarding, variant: "pt-BR" });
  };

  const bumpDaily = () => {
    const today = dayString();
    setDaily((cur) => (cur.day === today ? { day: today, count: cur.count + 1 } : { day: today, count: 1 }));
  };

  const startLesson = (lesson) => {
    setLaunchLesson(lesson);
    setTab("lessons");
  };

  const goPractice = (mode) => {
    setPracticeMode(mode || "phrasebook");
    setTab("practice");
  };

  const dueCount = deck.filter((card) => (card.due || 0) <= Date.now()).length;
  const dailyGoal = onboarding?.dailyTarget || 10;

  if (!loaded) return <div className="tg-root"><div className="tg-screen"><div className="tg-empty"><b>Loading Tagarela...</b></div></div></div>;

  if (!onboarding) {
    return (
      <div className="tg-root">
        <Onboarding onComplete={(config) => { setOnboarding(config); setTab("today"); }} />
      </div>
    );
  }

  return (
    <div className="tg-root">
      <Header streak={streak} progress={progress} daily={daily.count} dailyGoal={dailyGoal} onSettings={() => setSettingsOpen(true)} />
      {online ? null : <div className="tg-offline">Offline — lessons and review work; AI features need a connection.</div>}

      {sessionOpen ? (
        <main className="tg-main">
          <SessionView deck={deck} setDeck={setDeck} addCard={addCard} progress={progress} onActivity={bumpDaily} onClose={() => setSessionOpen(false)} />
        </main>
      ) : (
      <main className="tg-main">
        {tab === "today" ? <TodayView progress={progress} deck={deck} mistakes={mistakes} onboarding={onboarding} daily={daily} dailyGoal={dailyGoal} streak={streak} onSavePhrase={addCard} onStartLesson={startLesson} onGoReview={() => setTab("review")} onGoPractice={goPractice} onStartSession={() => setSessionOpen(true)} /> : null}
        {tab === "lessons" ? <LessonsView progress={progress} setProgress={setProgress} onSave={addCard} onGoReview={() => setTab("review")} launchLesson={launchLesson} onConsumeLaunch={() => setLaunchLesson(null)} onActivity={bumpDaily} startLevel={onboarding?.startLevel || "A1"} /> : null}
        {tab === "practice" ? <PracticeView onSave={addCard} onMistake={addMistake} initialMode={practiceMode} onActivity={bumpDaily} onOpenSettings={() => setSettingsOpen(true)} online={online} /> : null}
        {tab === "review" ? <ReviewView deck={deck} setDeck={setDeck} addCard={addCard} mistakes={mistakes} setMistakes={setMistakes} backupData={{ deck, mistakes, streak, progress, onboarding }} onImportData={importData} skillStats={progress.skillStats} onActivity={bumpDaily} /> : null}
      </main>
      )}

      {sessionOpen ? null : <TabBar active={tab} onChange={setTab} dueCount={dueCount} />}
      {settingsOpen ? <SettingsSheet onboarding={onboarding} setOnboarding={setOnboarding} onClose={() => setSettingsOpen(false)} /> : null}
    </div>
  );
}
