import { useMemo, useRef, useState } from "react";
import { BACKUP_VERSION, KEYS } from "../services/storage";
import { gistBackup, gistRestore } from "../services/sync";
import { dueCards, makeCard, reschedule } from "../services/spacedRepetition";
import { speak } from "../utils/language";
import { orderDueByWeakness } from "../utils/progress";
import { EmptyState } from "../components/Common";
import { Icons } from "../components/Icons";
import { buzz } from "../utils/haptics";

function ReviewDeck({ deck, setDeck, addCard, skillStats, onActivity }) {
  const due = useMemo(() => orderDueByWeakness(dueCards(deck), skillStats), [deck, skillStats]);
  const [show, setShow] = useState(false);
  const [pt, setPt] = useState("");
  const [en, setEn] = useState("");
  const card = due[0] || null;

  const rate = (grade) => {
    if (!card) return;
    setDeck((prev) => prev.map((item) => item.id === card.id ? reschedule(item, grade) : item));
    setShow(false);
    buzz(8);
    if (onActivity) onActivity();
  };

  const manualAdd = () => {
    if (!pt.trim() || !en.trim()) return;
    addCard(pt.trim(), en.trim(), "learning");
    setPt(""); setEn("");
  };

  return (
    <>
      <div className="tg-due">
        <div className="tg-stat"><b>{due.length}</b><span>due now</span></div>
        <div className="tg-stat"><b>{deck.filter((c) => c.difficulty === "difficult").length}</b><span>difficult</span></div>
        <div className="tg-stat"><b>{deck.filter((c) => c.difficulty === "known").length}</b><span>known</span></div>
      </div>
      {card ? (
        <>
          <button className={"tg-flash" + (show ? " is-flipped" : "")} onClick={() => setShow((s) => !s)}>
            <span className="tg-flash-front">{card.pt}</span>
            {show ? <span className="tg-flash-back">{card.en}</span> : <span className="tg-flash-hint">tap to reveal</span>}
          </button>
          <button className="tg-mini" onClick={() => speak(card.pt)}>{Icons.speaker} Hear phrase</button>
          {show ? <div className="tg-rate"><button className="again" onClick={() => rate("again")}>Again</button><button className="good" onClick={() => rate("good")}>Good</button><button className="easy" onClick={() => rate("easy")}>Easy</button></div> : null}
        </>
      ) : <EmptyState title="No cards due" text="Nice. Add phrases from lessons or practice, then they will appear here." />}

      <div className="tg-card">
        <div className="tg-label">Add your own phrase</div>
        <div className="tg-addrow"><input value={pt} onChange={(e) => setPt(e.target.value)} placeholder="Portuguese"/><input value={en} onChange={(e) => setEn(e.target.value)} placeholder="English"/><button className="tg-add" onClick={manualAdd}>+</button></div>
      </div>
    </>
  );
}

function Mistakes({ mistakes, setMistakes, onPractise }) {
  if (!mistakes.length) return <EmptyState title="No mistakes logged yet" text="AI corrections and grammar checks will appear here. That turns mistakes into future practice." />;
  return (
    <div>
      {mistakes.map((mistake) => (
        <div key={mistake.id} className="tg-mistake">
          <div className="tg-mistake-orig">{mistake.original || "Correction"}</div>
          {mistake.correctedPt ? <div className="tg-corrected small">{mistake.correctedPt}</div> : null}
          {mistake.note ? <div className="tg-mistake-note">{mistake.note}</div> : null}
          {mistake.grammarPoint ? <span className="tg-skill weak">{mistake.grammarPoint}</span> : null}
          {mistake.examplePt ? <div className="tg-coach">Example: {mistake.examplePt} — {mistake.exampleEn}</div> : null}
          <div className="tg-mistake-foot"><span className="tg-mistake-date">{new Date(mistake.ts || Date.now()).toLocaleDateString()}</span><div><button className="tg-resolve" onClick={() => onPractise(mistake)}>Practise</button><button className="tg-resolve" onClick={() => setMistakes((prev) => prev.filter((m) => m.id !== mistake.id))}>Resolve</button></div></div>
        </div>
      ))}
    </div>
  );
}

function Backup({ data, onImport }) {
  const fileRef = useRef(null);
  const [status, setStatus] = useState("");
  const exportData = () => {
    const payload = { version: BACKUP_VERSION, exportedAt: new Date().toISOString(), ...data };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tagarela-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Backup exported.");
  };
  const importData = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      onImport(JSON.parse(text));
      setStatus("Backup imported.");
    } catch {
      setStatus("Could not import that backup file.");
    } finally {
      event.target.value = "";
    }
  };
  return (
    <>
      <div className="tg-card"><div className="tg-label">Backup (file)</div><p className="tg-expl">Export or restore your lessons, deck, mistakes, streak and settings to a file on this device.</p><button className="tg-btn tg-btn-primary" onClick={exportData}>Export backup</button><button className="tg-btn tg-btn-ghost" onClick={() => fileRef.current?.click()}>Import backup</button><input ref={fileRef} type="file" accept="application/json" style={{ display: "none" }} onChange={importData}/>{status ? <div className="tg-status">{status}</div> : null}</div>
      <CloudSync data={data} onImport={onImport} />
    </>
  );
}

function CloudSync({ data, onImport }) {
  const [token, setToken] = useState(() => { try { return localStorage.getItem(KEYS.gistToken) || ""; } catch { return ""; } });
  const [showToken, setShowToken] = useState(false);
  const [busy, setBusy] = useState("");
  const [status, setStatus] = useState("");
  const syncedAt = (() => { try { return localStorage.getItem(KEYS.gistSyncedAt) || ""; } catch { return ""; } })();

  const saveToken = (t) => { setToken(t); try { localStorage.setItem(KEYS.gistToken, t.trim()); } catch {} };

  const backup = async () => {
    if (!token.trim()) { setStatus("Paste a GitHub token first."); return; }
    setBusy("up"); setStatus("");
    try {
      const gistId = localStorage.getItem(KEYS.gistId) || "";
      const payload = { version: BACKUP_VERSION, exportedAt: new Date().toISOString(), ...data };
      const id = await gistBackup(token, gistId, payload);
      localStorage.setItem(KEYS.gistId, id);
      localStorage.setItem(KEYS.gistSyncedAt, new Date().toISOString());
      setStatus("✓ Backed up to your private gist.");
    } catch (err) { setStatus(err.message || "Cloud backup failed."); }
    finally { setBusy(""); }
  };

  const restore = async () => {
    if (!token.trim()) { setStatus("Paste a GitHub token first."); return; }
    setBusy("down"); setStatus("");
    try {
      const gistId = localStorage.getItem(KEYS.gistId) || "";
      const restored = await gistRestore(token, gistId);
      onImport(restored);
      setStatus("✓ Restored from cloud.");
    } catch (err) { setStatus(err.message || "Cloud restore failed."); }
    finally { setBusy(""); }
  };

  return (
    <div className="tg-card">
      <div className="tg-label">Cloud sync (GitHub)</div>
      <p className="tg-expl">Sync across devices via a private GitHub gist — no account here, just a token. Create one at github.com/settings/tokens with only the <b>gist</b> scope, then paste it below.</p>
      <input className="tg-input full" type={showToken ? "text" : "password"} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" value={token} onChange={(e) => saveToken(e.target.value)} placeholder="github_pat_…" />
      <div style={{ display: "flex", gap: 14, marginTop: 6 }}>
        <button style={{ border: "none", background: "transparent", color: "var(--green-d)", fontWeight: 700, fontSize: 12, cursor: "pointer", padding: "4px 2px" }} type="button" onClick={() => setShowToken((s) => !s)}>{showToken ? "Hide" : "Show"}</button>
      </div>
      <button className="tg-btn tg-btn-primary" disabled={!!busy} onClick={backup}>{busy === "up" ? "Backing up…" : "Back up to cloud"}</button>
      <button className="tg-btn tg-btn-ghost" disabled={!!busy} onClick={restore}>{busy === "down" ? "Restoring…" : "Restore from cloud"}</button>
      {syncedAt ? <div className="tg-small-note">Last cloud backup: {new Date(syncedAt).toLocaleString()}</div> : null}
      {status ? <div className="tg-status">{status}</div> : null}
    </div>
  );
}

export default function ReviewView({ deck, setDeck, addCard, mistakes, setMistakes, backupData, onImportData, skillStats, onActivity }) {
  const [mode, setMode] = useState("deck");
  return (
    <div className="tg-screen">
      <h2 className="tg-intro-h">Revisão</h2>
      <p className="tg-intro-p">Review phrases, turn mistakes into cards, and keep a backup of your progress.</p>
      <div className="tg-seg"><button className={mode === "deck" ? "active" : ""} onClick={() => setMode("deck")}>Deck</button><button className={mode === "mistakes" ? "active" : ""} onClick={() => setMode("mistakes")}>Mistakes</button><button className={mode === "backup" ? "active" : ""} onClick={() => setMode("backup")}>Backup</button></div>
      {mode === "deck" ? <ReviewDeck deck={deck} setDeck={setDeck} addCard={addCard} skillStats={skillStats} onActivity={onActivity} /> : null}
      {mode === "mistakes" ? <Mistakes mistakes={mistakes} setMistakes={setMistakes} onPractise={(m) => { addCard(m.correctedPt || m.examplePt || m.original, m.exampleEn || m.note || "", "difficult"); setMode("deck"); if (onActivity) onActivity(); }} /> : null}
      {mode === "backup" ? <Backup data={backupData} onImport={onImportData} /> : null}
    </div>
  );
}
