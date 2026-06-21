import { useState } from "react";
import { getApiKey, getAzureSettings, saveApiKey, saveAzureSettings } from "../services/storage";
import { testAnthropicKey } from "../services/anthropic";
import { speak } from "../utils/language";
import PlacementQuiz from "./PlacementQuiz";

const BR_VOICES = [
  { id: "pt-BR-FranciscaNeural", label: "Francisca ♀" },
  { id: "pt-BR-AntonioNeural", label: "Antônio ♂" },
  { id: "pt-BR-BrendaNeural", label: "Brenda ♀" },
  { id: "pt-BR-FabioNeural", label: "Fábio ♂" },
  { id: "pt-BR-GiovannaNeural", label: "Giovanna ♀" },
  { id: "pt-BR-HumbertoNeural", label: "Humberto ♂" },
];

const linkBtn = { border: "none", background: "transparent", color: "var(--green-d, #13573F)", fontWeight: 700, fontSize: 12, cursor: "pointer", padding: "4px 2px" };

function SavedBadge({ on }) {
  return <span className={`tg-saved ${on ? "on" : "off"}`}>{on ? "Saved ✓" : "Not set"}</span>;
}

const isAzureSaved = (a) => Boolean(a && a.key && a.key.trim() && a.region && a.region.trim());

export default function SettingsSheet({ onboarding, setOnboarding, onClose }) {
  const [apiKey, setApiKey] = useState(() => getApiKey());
  const [azure, setAzure] = useState(() => getAzureSettings());
  const [dailyTarget, setDailyTarget] = useState(onboarding?.dailyTarget || 10);
  const [theme, setTheme] = useState(onboarding?.theme || "system");
  const [startLevel, setStartLevel] = useState(onboarding?.startLevel || "A1");
  const [quizOpen, setQuizOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [showAnthropic, setShowAnthropic] = useState(false);
  const [showAzure, setShowAzure] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testMsg, setTestMsg] = useState("");
  // Reflects what's actually persisted in storage, not just the input fields.
  const [saved, setSaved] = useState(() => ({ anthropic: Boolean(getApiKey()), azure: isAzureSaved(getAzureSettings()) }));

  const save = () => {
    saveApiKey(apiKey);
    saveAzureSettings({ ...azure, locale: "pt-BR" });
    setOnboarding((cur) => ({ ...(cur || {}), dailyTarget, theme, startLevel, variant: "pt-BR" }));
    setSaved({ anthropic: Boolean(apiKey.trim()), azure: isAzureSaved(azure) });
    setStatus("Settings saved.");
  };

  const testKey = async () => {
    setTesting(true);
    setTestMsg("");
    try { await testAnthropicKey(apiKey); setTestMsg("✓ Anthropic key works."); }
    catch (err) { setTestMsg(err.message || "Key check failed."); }
    finally { setTesting(false); }
  };

  const clearKeys = () => {
    setApiKey("");
    setAzure((s) => ({ ...s, key: "" }));
    saveApiKey("");
    saveAzureSettings({ ...azure, key: "" });
    setSaved({ anthropic: false, azure: false });
    setTestMsg("");
    setStatus("Keys cleared from this device.");
  };

  const applyQuiz = (lv) => {
    setStartLevel(lv);
    setOnboarding((cur) => ({ ...(cur || {}), startLevel: lv }));
    setQuizOpen(false);
    setStatus(`Recommended level ${lv} set as your starting point.`);
  };

  if (quizOpen) return <PlacementQuiz onClose={() => setQuizOpen(false)} onApply={applyQuiz} />;

  return (
    <div className="tg-sheet-backdrop" role="dialog" aria-modal="true">
      <div className="tg-sheet">
        <div className="tg-sheet-head"><div><b>Settings</b><small>Brazilian Portuguese only for now</small></div><button onClick={onClose}>×</button></div>

        <div className="tg-card">
          <div className="tg-label">Daily target</div>
          <div className="tg-choice-grid">
            {[5, 10, 15].map((n) => <button key={n} className={`tg-choice compact ${dailyTarget === n ? "selected" : ""}`} onClick={() => setDailyTarget(n)}><b>{n} min</b><small>{n === 5 ? "tiny habit" : n === 10 ? "balanced" : "faster"}</small></button>)}
          </div>
        </div>

        <div className="tg-card">
          <div className="tg-label">Theme</div>
          <div className="tg-choice-grid">
            {["system", "light", "dark"].map((t) => (
              <button key={t} className={`tg-choice compact ${theme === t ? "selected" : ""}`} onClick={() => setTheme(t)}>
                <b>{t === "system" ? "System" : t === "light" ? "Light" : "Dark"}</b>
                <small>{t === "system" ? "match device" : t === "light" ? "always light" : "always dark"}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="tg-card">
          <div className="tg-label">Starting level</div>
          <div className="tg-choice-grid">
            {["A1", "A2", "B1", "B2", "C1"].map((lv) => (
              <button key={lv} className={`tg-choice compact ${startLevel === lv ? "selected" : ""}`} onClick={() => setStartLevel(lv)}>
                <b>{lv}</b>
                <small>{lv === "A1" ? "beginner" : lv === "A2" ? "elementary" : lv === "B1" ? "intermediate" : lv === "B2" ? "upper-int." : "advanced"}</small>
              </button>
            ))}
          </div>
          <button className="tg-btn tg-btn-ghost" type="button" onClick={() => setQuizOpen(true)}>📝 Take a quick placement quiz</button>
          <p className="tg-small-note">Not a beginner? Pick your level to unlock everything up to it and jump in anywhere — or take the quiz for a recommendation. Higher levels still unlock as you progress.</p>
        </div>

        <div className="tg-card">
          <div className="tg-label tg-label-row">Anthropic API key <SavedBadge on={saved.anthropic} /></div>
          <input className="tg-input full" type={showAnthropic ? "text" : "password"} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-ant-..." />
          <div style={{ display: "flex", gap: 14, marginTop: 6 }}>
            <button style={linkBtn} type="button" onClick={() => setShowAnthropic((s) => !s)}>{showAnthropic ? "Hide" : "Show"}</button>
            <button style={linkBtn} type="button" onClick={testKey} disabled={testing || !apiKey.trim()}>{testing ? "Testing…" : "Test key"}</button>
          </div>
          {testMsg ? <div className="tg-status">{testMsg}</div> : null}
          <p className="tg-small-note">Optional. Powers AI conversation, role-play, grammar and translation. Stored only on this device. Set a monthly spend cap on the key at console.anthropic.com.</p>
        </div>

        <div className="tg-card">
          <div className="tg-label tg-label-row">Azure Speech (pronunciation + voice input) <SavedBadge on={saved.azure} /></div>
          <input className="tg-input full" type={showAzure ? "text" : "password"} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" value={azure.key} onChange={(e) => setAzure((s) => ({ ...s, key: e.target.value }))} placeholder="Azure Speech key" />
          <input className="tg-input full" value={azure.region} onChange={(e) => setAzure((s) => ({ ...s, region: e.target.value }))} placeholder="Region, e.g. uksouth" />
          <div style={{ display: "flex", gap: 14, marginTop: 6 }}>
            <button style={linkBtn} type="button" onClick={() => setShowAzure((s) => !s)}>{showAzure ? "Hide key" : "Show key"}</button>
          </div>
          <div className="tg-label" style={{ marginTop: 12 }}>Voice</div>
          <div className="tg-choice-grid">
            <button className={`tg-choice compact ${azure.voice === "random" ? "selected" : ""}`} onClick={() => setAzure((s) => ({ ...s, voice: "random" }))}>
              <b>🎲 Mix</b>
              <small>random voices</small>
            </button>
            {BR_VOICES.map((v) => (
              <button key={v.id} className={`tg-choice compact ${azure.voice === v.id ? "selected" : ""}`} onClick={() => setAzure((s) => ({ ...s, voice: v.id }))}>
                <b>{v.label.split(" ")[0]}</b>
                <small>{v.label.split(" ")[1] === "♀" ? "female" : "male"}</small>
              </button>
            ))}
          </div>
          <button className="tg-btn tg-btn-ghost" type="button" onClick={() => { saveAzureSettings({ ...azure, locale: "pt-BR" }); speak("Oi! Tudo bem? Vamos praticar português."); }}>▶ Preview voice</button>
          <p className="tg-small-note">Optional. Powers pronunciation scoring and reliable speech-to-text in chat. Several Brazilian neural voices (different speakers) — all standard Brazilian Portuguese. Without an Azure key, the app uses your device's free built-in voice. Free F0 tier ≈ 5 audio hours/month.</p>
        </div>

        <button className="tg-btn tg-btn-primary" onClick={save}>Save settings</button>
        <button className="tg-btn tg-btn-ghost" onClick={clearKeys}>Clear keys from device</button>
        {status ? <div className="tg-status">{status}</div> : null}
        <p className="tg-footnote">Keys live in this browser only. For a shared or public app, move them behind a backend — local storage suits a private prototype.</p>
      </div>
    </div>
  );
}
