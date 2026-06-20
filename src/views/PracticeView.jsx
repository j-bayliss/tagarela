import { useEffect, useMemo, useRef, useState } from "react";
import { ESSENTIAL_GROUPS } from "../data/essentials";
import { SCENARIOS } from "../data/scenarios";
import { PRONUNCIATION_DRILLS } from "../data/pronunciation";
import { askClaude, askClaudeStream, parseJSON } from "../services/anthropic";
import { assessPronunciationWithAzure, recognizeOnceWithAzure } from "../services/azureSpeech";
import { getApiKey, getAzureSettings } from "../services/storage";
import { buzz } from "../utils/haptics";
import { friendlyPronunciationFeedback, getSpeechRecognition, normaliseAnswer, scoreClass, speak } from "../utils/language";
import { Icons } from "../components/Icons";
import { Dots } from "../components/Common";

const CONVERSA_SYS = `You are Tati, a warm Brazilian Portuguese tutor from São Paulo. The learner is CEFR A1-A2.
First write your spoken reply in natural but SIMPLE Brazilian Portuguese: 1-2 short sentences, then one friendly follow-up question. Use only the reply text here, nothing else.
Then on a new line write exactly === and immediately after it a single-line compact JSON object with these keys: en (English translation of your reply), correction (a short kind note if the learner's last message had a Portuguese mistake, otherwise ""), corrected_pt, grammar_point, example_pt, example_en, tip. Output nothing after the JSON.`;

const GRAMMAR_SYS = `You check Brazilian Portuguese for an A1-A2 learner. Respond ONLY as valid JSON with keys: corrected, is_correct, explanation_en, english_meaning, grammar_point, example_pt, example_en. Keep feedback friendly and clear.`;

const GRADE_SYS = `You grade an A1-A2 learner's translation into Brazilian Portuguese. Respond ONLY as valid JSON with keys: score, model_answer, feedback. Be encouraging, concise and accurate for Brazilian Portuguese.`;

function ApiNudge({ text = "Add your Anthropic API key in settings to unlock this AI practice mode." }) {
  return <div className="tg-card api-nudge"><div className="tg-label">Optional AI mode</div><p className="tg-expl">{text}</p></div>;
}

function ChatMode({ scenario, onSave, onMistake, onActivity }) {
  const hasKey = Boolean(getApiKey());
  const intro = scenario ? { pt: scenario.introPt, en: scenario.introEn } : { pt: "Oi! Vamos praticar português brasileiro. Sobre o que você quer falar hoje?", en: "Hi! Let's practise Brazilian Portuguese. What do you want to talk about today?" };
  const system = scenario ? `${CONVERSA_SYS}\nRole-play context: ${scenario.title}. Stay in character and keep the conversation practical.` : CONVERSA_SYS;
  const [messages, setMessages] = useState([{ who: "tutor", pt: intro.pt, en: intro.en, revealed: false, intro: true }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);
  const [helperOpen, setHelperOpen] = useState(false);
  const [lookupTerm, setLookupTerm] = useState("");
  const [lookupResult, setLookupResult] = useState(null);
  const [lookingUp, setLookingUp] = useState(false);
  const [translatingBrackets, setTranslatingBrackets] = useState(false);
  const endRef = useRef(null);
  const hasBrackets = /\[[^\]]+\]/.test(input);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, busy]);

  const useMic = async () => {
    buzz(10);
    const azure = getAzureSettings();
    if (azure.key && azure.region) {
      setListening(true);
      setError("");
      try {
        const text = await recognizeOnceWithAzure(azure);
        setInput((prev) => `${prev ? `${prev} ` : ""}${text}`);
      } catch (err) {
        setError(err.message || "Could not capture audio.");
      } finally {
        setListening(false);
      }
      return;
    }
    const SR = getSpeechRecognition();
    if (!SR) { setError("Add an Azure Speech key in settings for reliable voice input (this browser lacks built-in recognition)."); return; }
    try {
      const rec = new SR();
      rec.lang = "pt-BR";
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onresult = (event) => setInput((prev) => `${prev ? `${prev} ` : ""}${event.results[0][0].transcript}`);
      rec.onerror = () => { setListening(false); setError("Microphone blocked or unavailable."); };
      rec.onend = () => setListening(false);
      setListening(true);
      setError("");
      rec.start();
    } catch {
      setListening(false);
      setError("Microphone blocked or unavailable.");
    }
  };

  const translateMessage = async (idx) => {
    const msg = messages[idx];
    if (!msg || msg.who !== "tutor") return;
    if (msg.en) { setMessages((cur) => cur.map((m, i) => i === idx ? { ...m, revealed: !m.revealed } : m)); return; }
    setMessages((cur) => cur.map((m, i) => i === idx ? { ...m, translating: true } : m));
    try {
      const raw = await askClaude("Translate this Brazilian Portuguese sentence into natural English. Reply with only the translation — no quotes, no notes.", [{ role: "user", content: msg.pt }]);
      const en = (raw || "").trim();
      setMessages((cur) => cur.map((m, i) => i === idx ? { ...m, en, translating: false, revealed: true } : m));
    } catch {
      setMessages((cur) => cur.map((m, i) => i === idx ? { ...m, translating: false } : m));
    }
  };

  // Swap any [english] brackets in the message for Brazilian Portuguese, in place.
  const translateBrackets = async () => {
    const matches = input.match(/\[[^\]]+\]/g) || [];
    const terms = [...new Set(matches.map((m) => m.slice(1, -1).trim()).filter(Boolean))];
    if (!terms.length) return;
    buzz(10);
    setTranslatingBrackets(true);
    setError("");
    try {
      const raw = await askClaude(
        "You translate English words or short phrases into natural Brazilian Portuguese for an A1-A2 learner. Use the sentence as context to pick the right sense. Reply ONLY with a compact JSON object mapping each given English term (exactly as written) to its Brazilian Portuguese translation. No notes.",
        [{ role: "user", content: `Sentence: ${input}\nTerms: ${JSON.stringify(terms)}` }],
      );
      const map = parseJSON(raw) || {};
      let next = input;
      matches.forEach((m) => {
        const term = m.slice(1, -1).trim();
        const pt = (map[term] || "").trim();
        if (pt) next = next.replace(m, pt);
      });
      setInput(next);
      if (onActivity) onActivity();
    } catch (err) {
      setError(err.message || "Could not translate those words.");
    } finally {
      setTranslatingBrackets(false);
    }
  };

  // Quick single-word lookup in the helper bar.
  const lookupWord = async () => {
    const term = lookupTerm.trim();
    if (!term || lookingUp) return;
    buzz(8);
    setLookingUp(true);
    setError("");
    setLookupResult(null);
    try {
      const raw = await askClaude(
        "Translate this English word or short phrase into natural Brazilian Portuguese for an A1-A2 learner. Reply with ONLY the Portuguese translation — no quotes, no notes.",
        [{ role: "user", content: term }],
      );
      setLookupResult((raw || "").trim());
    } catch (err) {
      setError(err.message || "Lookup failed.");
    } finally {
      setLookingUp(false);
    }
  };

  const insertWord = (word) => {
    buzz(6);
    setInput((prev) => `${prev ? `${prev.trimEnd()} ` : ""}${word} `);
    setLookupResult(null);
    setLookupTerm("");
  };

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    buzz(12);
    setInput("");
    setError("");
    const base = messages.concat([{ who: "me", pt: text }]);
    setMessages(base.concat([{ who: "tutor", pt: "", en: "", revealed: false, streaming: true }]));
    setBusy(true);
    if (onActivity) onActivity();
    const apiMessages = base.filter((m) => !m.intro).map((m) => ({ role: m.who === "me" ? "user" : "assistant", content: m.pt }));

    const replaceStreaming = (patch) => setMessages((cur) => {
      const copy = cur.slice();
      for (let i = copy.length - 1; i >= 0; i--) {
        if (copy[i].who === "tutor" && copy[i].streaming) { copy[i] = { ...copy[i], ...patch }; break; }
      }
      return copy;
    });

    try {
      const raw = await askClaudeStream(system, apiMessages, (full) => {
        replaceStreaming({ pt: full.split("===")[0].trim() });
      });
      const parts = raw.split("===");
      const replyPt = (parts[0] || "").trim() || "Desculpa, pode repetir?";
      const meta = parts.length > 1 ? (parseJSON(parts.slice(1).join("===")) || {}) : {};
      if ((meta.correction || meta.corrected_pt || meta.grammar_point) && onMistake) {
        onMistake({ original: text, correctedPt: meta.corrected_pt || "", note: meta.correction || "", grammarPoint: meta.grammar_point || "", examplePt: meta.example_pt || "", exampleEn: meta.example_en || "" });
      }
      replaceStreaming({ pt: replyPt, en: meta.en || "", correction: meta.correction || "", tip: meta.tip || "", streaming: false });
    } catch (err) {
      setError(err.message || "AI request failed.");
      replaceStreaming({ pt: "Ops, não consegui responder agora.", en: "Oops, I could not reply right now.", revealed: true, streaming: false });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="tg-chat-panel">
      {!hasKey ? <ApiNudge /> : null}
      <div className="tg-chat">
        {messages.map((msg, idx) => (
          <div key={idx} className={`tg-bubblewrap ${msg.who}`}>
            <div className={`tg-bubble ${msg.who}`} onClick={() => !msg.streaming && msg.who === "tutor" && translateMessage(idx)}>{msg.pt ? msg.pt : (msg.streaming ? <Dots /> : msg.pt)}</div>
            {msg.who === "tutor" && !msg.streaming ? <>{msg.translating ? <div className="tg-taphint">traduzindo…</div> : (msg.revealed ? <div className="tg-en">{msg.en}</div> : <div className="tg-taphint">tap to translate</div>)}<div className="tg-actions"><button className="tg-mini round" onClick={() => speak(msg.pt)}>{Icons.speaker}</button>{msg.pt && <button className="tg-mini" onClick={() => onSave(msg.pt, msg.en || "", "learning")}>Save</button>}</div>{msg.correction ? <div className="tg-correction"><b>Fix:</b> {msg.correction}</div> : null}{msg.tip ? <div className="tg-tip">{msg.tip}</div> : null}</> : null}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      {error ? <div className="tg-error">{error}</div> : null}
      {hasKey ? (
        <div className="tg-chat-tools">
          <button type="button" className={`tg-tool-btn ${helperOpen ? "on" : ""}`} onClick={() => { buzz(6); setHelperOpen((o) => !o); }}>🔤 Need a word?</button>
          {hasBrackets ? (
            <button type="button" className="tg-tool-btn accent" disabled={translatingBrackets} onClick={translateBrackets}>{translatingBrackets ? "Translating…" : "🔍 Translate [words]"}</button>
          ) : null}
        </div>
      ) : null}
      {helperOpen && hasKey ? (
        <div className="tg-word-helper">
          <div className="tg-word-helper-row">
            <input className="tg-input" value={lookupTerm} placeholder="English word…" autoCapitalize="none" autoCorrect="off" onChange={(e) => setLookupTerm(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); lookupWord(); } }} />
            <button className="tg-btn tg-btn-primary compact" disabled={!lookupTerm.trim() || lookingUp} onClick={lookupWord}>{lookingUp ? "…" : "Look up"}</button>
          </div>
          {lookupResult ? (
            <div className="tg-word-helper-result">
              <button type="button" className="tg-word-chip" onClick={() => insertWord(lookupResult)}>{lookupResult}<span>tap to insert</span></button>
              <button className="tg-mini round" aria-label="Hear word" onClick={() => speak(lookupResult)}>{Icons.speaker}</button>
            </div>
          ) : null}
          <div className="tg-small-note">Tip: inside your message, wrap an English word in [brackets] then tap “Translate [words]”.</div>
        </div>
      ) : null}
      <div className="tg-composer inline">
        <textarea className="tg-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder={hasKey ? "Type in Portuguese… use [brackets] for words you don't know" : "Add an Anthropic key in settings to chat"} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} />
        <button className={`tg-mic ${listening ? "on" : ""}`} onClick={useMic}>{Icons.mic}</button>
        <button className="tg-send" onClick={send} disabled={!hasKey || !input.trim() || busy}>➤</button>
      </div>
    </div>
  );
}

function ScenarioMode({ onSave, onMistake, onActivity }) {
  const [scenario, setScenario] = useState(null);
  if (scenario) {
    return <><button className="tg-back" onClick={() => setScenario(null)}>← Back to missions</button><ChatMode scenario={scenario} onSave={onSave} onMistake={onMistake} onActivity={onActivity} /></>;
  }
  return (
    <div className="tg-grid">
      {SCENARIOS.map((item) => <button key={item.id} className="tg-scn" onClick={() => setScenario(item)}><span className="tg-scn-emoji">{item.emoji}</span><b>{item.title}</b><small>{item.description}</small></button>)}
    </div>
  );
}

function Phrasebook({ onSave }) {
  return <>{ESSENTIAL_GROUPS.map((group) => <section key={group.title}><div className="tg-ess-h">{group.title}</div>{group.items.map((item) => <div key={item.pt} className="tg-ess"><div className="tg-ess-top"><div><div className="tg-ess-word">{item.pt}</div><div className="tg-ess-mean">{item.en}</div></div><button className="tg-mini round" onClick={() => speak(item.pt)}>{Icons.speaker}</button></div><div className="tg-ess-ex">{item.example}</div><div className="tg-ess-row"><button className="tg-mini" onClick={() => onSave(item.pt, item.en, "learning")}>Save</button></div></div>)}</section>)}</>;
}

function GrammarMode({ onSave, onMistake, onActivity }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const hasKey = Boolean(getApiKey());
  const check = async () => {
    if (!text.trim()) return;
    setBusy(true); setError(""); setResult(null);
    if (onActivity) onActivity();
    try {
      const raw = await askClaude(GRAMMAR_SYS, [{ role: "user", content: text.trim() }]);
      const json = parseJSON(raw) || {};
      setResult(json);
      if (!json.is_correct) onMistake({ original: text.trim(), correctedPt: json.corrected || "", note: json.explanation_en || "", grammarPoint: json.grammar_point || "", examplePt: json.example_pt || "", exampleEn: json.example_en || "" });
    } catch (err) { setError(err.message || "Grammar check failed."); }
    finally { setBusy(false); }
  };
  return <div>{!hasKey ? <ApiNudge text="Grammar feedback uses your optional Anthropic key. Lessons and review still work without it."/> : null}<div className="tg-card"><div className="tg-label">Grammar check</div><textarea className="tg-ta" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a simple Portuguese sentence..."/><button className="tg-btn tg-btn-primary" disabled={!hasKey || !text.trim() || busy} onClick={check}>{busy ? "Checking..." : "Check sentence"}</button></div>{error ? <div className="tg-error">{error}</div> : null}{result ? <div className="tg-card"><span className={`tg-badge ${result.is_correct ? "ok" : "fix"}`}>{result.is_correct ? "Correct" : "Needs tweak"}</span><div className="tg-corrected">{result.corrected}</div><div className="tg-meaning">{result.english_meaning}</div><p className="tg-expl">{result.explanation_en}</p>{result.example_pt ? <div className="tg-coach">Example: {result.example_pt} — {result.example_en}</div> : null}<button className="tg-btn tg-btn-ghost" onClick={() => onSave(result.corrected, result.english_meaning || "", result.is_correct ? "learning" : "difficult")}>Save correction</button></div> : null}</div>;
}

const TRANSLATE_PROMPTS = ["I want a coffee, please.", "Where is the station?", "Can you repeat more slowly?", "I have a reservation.", "I am learning Portuguese.", "How much does it cost?", "I like the beach."];
function TranslateMode({ onSave, onActivity }) {
  const [prompt, setPrompt] = useState(() => TRANSLATE_PROMPTS[0]);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const hasKey = Boolean(getApiKey());
  const nextPrompt = () => { setPrompt(TRANSLATE_PROMPTS[Math.floor(Math.random() * TRANSLATE_PROMPTS.length)]); setAnswer(""); setResult(null); };
  const grade = async () => {
    setBusy(true); setError("");
    if (onActivity) onActivity();
    try {
      const raw = await askClaude(GRADE_SYS, [{ role: "user", content: `English: ${prompt}\nLearner Portuguese: ${answer}` }]);
      setResult(parseJSON(raw) || {});
    } catch (err) { setError(err.message || "Translation grading failed."); }
    finally { setBusy(false); }
  };
  return <div>{!hasKey ? <ApiNudge/> : null}<div className="tg-card"><div className="tg-label">Translate into Brazilian Portuguese</div><div className="tg-prompt-en">{prompt}</div><textarea className="tg-ta" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Portuguese answer..."/><button className="tg-btn tg-btn-primary" disabled={!hasKey || !answer.trim() || busy} onClick={grade}>{busy ? "Grading..." : "Grade"}</button><button className="tg-btn tg-btn-ghost" onClick={nextPrompt}>New prompt</button></div>{error ? <div className="tg-error">{error}</div> : null}{result ? <div className="tg-card"><div className="tg-score small">{result.score || 0}<small>%</small></div><div className="tg-corrected">{result.model_answer}</div><p className="tg-expl">{result.feedback}</p><button className="tg-btn tg-btn-ghost" onClick={() => onSave(result.model_answer, prompt, Number(result.score || 0) < 70 ? "difficult" : "learning")}>Save model answer</button></div> : null}</div>;
}

function DictationMode({ onSave, onActivity }) {
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [result, setResult] = useState(null);
  const cur = PRONUNCIATION_DRILLS[idx % PRONUNCIATION_DRILLS.length];
  const check = () => {
    const correct = normaliseAnswer(typed) === normaliseAnswer(cur.pt);
    setResult({ correct });
    if (onActivity) onActivity();
    if (!correct) onSave(cur.pt, cur.en, "difficult", [cur.skill, "listening"]);
  };
  const next = () => { setIdx((n) => n + 1); setTyped(""); setResult(null); };
  return <div><div className="tg-card"><div className="tg-label">Listen and type</div><button className="tg-listen" onClick={() => speak(cur.pt)}>{Icons.speaker} Play phrase</button><div className="tg-meaning">{cur.en}</div><textarea className="tg-ta" value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Type what you hear..."/><button className="tg-btn tg-btn-primary" disabled={!typed.trim()} onClick={check}>Check</button></div>{result ? <div className={`tg-feedback ${result.correct ? "correct" : "incorrect"}`}><b>{result.correct ? "Boa!" : "Not quite."}</b><span>{result.correct ? "You heard it clearly." : `Correct phrase: ${cur.pt}`}</span><button className="tg-btn tg-btn-primary" onClick={next}>Next phrase</button></div> : null}</div>;
}

function PronunciationMode({ onSave, onActivity }) {
  const [settings] = useState(() => getAzureSettings());
  const [idx, setIdx] = useState(0);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const cur = PRONUNCIATION_DRILLS[idx % PRONUNCIATION_DRILLS.length];
  const hasAzure = Boolean(settings.key && settings.region);
  const record = async () => {
    buzz(10);
    setBusy(true); setError(""); setResult(null);
    if (onActivity) onActivity();
    try {
      const out = await assessPronunciationWithAzure(cur.pt, settings);
      setResult(out);
      if (out.pronunciationScore < 70) onSave(cur.pt, cur.en, "difficult", [cur.skill, "pronunciation"]);
    } catch (err) { setError(err.message || "Pronunciation assessment failed."); }
    finally { setBusy(false); }
  };
  return <div>{!hasAzure ? <div className="tg-card api-nudge"><div className="tg-label">Azure pronunciation</div><p className="tg-expl">Add your Azure Speech key and region in settings to unlock pronunciation scoring. This app is locked to Brazilian Portuguese: pt-BR.</p></div> : null}<div className="tg-card"><div className="tg-label">Repeat after me</div><div className="tg-big-pt">{cur.pt}</div><div className="tg-meaning">{cur.en}</div><button className="tg-btn tg-btn-ghost" onClick={() => speak(cur.pt)}>Hear phrase</button><button className="tg-btn tg-btn-primary" disabled={!hasAzure || busy} onClick={record}>{busy ? "Listening..." : "Record and score"}</button></div>{error ? <div className="tg-error">{error}</div> : null}{result ? <div className="tg-card"><div className={`tg-score small ${scoreClass(result.pronunciationScore)}`}>{result.pronunciationScore}<small>%</small></div><p className="tg-expl">{friendlyPronunciationFeedback(result.pronunciationScore)}</p><div className="tg-score-grid"><span>Accuracy <b>{result.accuracyScore}%</b></span><span>Fluency <b>{result.fluencyScore}%</b></span><span>Completeness <b>{result.completenessScore}%</b></span><span>Prosody <b>{result.prosodyScore || "—"}%</b></span></div><div className="tg-meaning">Heard: {result.text || "—"}</div>{result.words?.length ? <><div className="tg-word-scores">{result.words.map((w, i) => <button type="button" key={w.word + i} className={`tg-word ${w.errorType === "Omission" ? "miss" : w.accuracy >= 80 ? "good" : w.accuracy >= 60 ? "ok" : "bad"}`} onClick={() => { buzz(6); speak(w.word); }}>{w.word}<small>{w.errorType === "Omission" ? "missed" : `${w.accuracy}%`}</small></button>)}</div><div className="tg-small-note">Tap a word to hear it on its own.</div></> : null}<button className="tg-btn tg-btn-primary" onClick={() => { setIdx((n) => n + 1); setResult(null); }}>Next phrase</button></div> : null}</div>;
}

export default function PracticeView({ onSave, onMistake, initialMode, onActivity, onOpenSettings, online = true }) {
  const [mode, setMode] = useState(initialMode || "phrasebook");
  const modes = [
    { id: "phrasebook", label: "Frases" },
    { id: "chat", label: "Conversa" },
    { id: "missions", label: "Missões" },
    { id: "grammar", label: "Gramática" },
    { id: "translate", label: "Traduzir" },
    { id: "dictation", label: "Ouvir" },
    { id: "speak", label: "Fala" },
  ];
  useEffect(() => { if (initialMode) setMode(initialMode); }, [initialMode]);

  const needsAnthropic = ["chat", "missions", "grammar", "translate"].includes(mode);
  const needsAzure = mode === "speak";
  const hasAnthropic = Boolean(getApiKey());
  const hasAzure = (() => { const a = getAzureSettings(); return Boolean(a.key && a.region); })();
  let nudge = "";
  if (needsAnthropic && !hasAnthropic) nudge = "Add your Anthropic API key to use this mode.";
  else if (needsAzure && !hasAzure) nudge = "Add your Azure Speech key and region to score pronunciation.";
  else if ((needsAnthropic || needsAzure) && !online) nudge = "You're offline — this mode needs a connection.";

  return (
    <div className="tg-screen">
      <h2 className="tg-intro-h">Praticar</h2>
      <p className="tg-intro-p">Phrasebook, conversation, missions, grammar, listening and Brazilian Portuguese pronunciation.</p>
      <div className="tg-pill-scroll">{modes.map((item) => <button key={item.id} className={mode === item.id ? "active" : ""} onClick={() => setMode(item.id)}>{item.label}</button>)}</div>
      {nudge ? <div className="tg-card api-nudge"><p className="tg-expl">{nudge}</p>{onOpenSettings && online ? <button className="tg-btn tg-btn-ghost" onClick={onOpenSettings}>Open settings</button> : null}</div> : null}
      {mode === "phrasebook" ? <Phrasebook onSave={onSave} /> : null}
      {mode === "chat" ? <ChatMode onSave={onSave} onMistake={onMistake} onActivity={onActivity} /> : null}
      {mode === "missions" ? <ScenarioMode onSave={onSave} onMistake={onMistake} onActivity={onActivity} /> : null}
      {mode === "grammar" ? <GrammarMode onSave={onSave} onMistake={onMistake} onActivity={onActivity} /> : null}
      {mode === "translate" ? <TranslateMode onSave={onSave} onActivity={onActivity} /> : null}
      {mode === "dictation" ? <DictationMode onSave={onSave} onActivity={onActivity} /> : null}
      {mode === "speak" ? <PronunciationMode onSave={onSave} onActivity={onActivity} /> : null}
    </div>
  );
}
