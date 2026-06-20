import { getAzureSettings } from "../services/storage";
import { synthesizeWithAzure } from "../services/azureSpeech";

let cachedVoices = [];
function refreshVoices() {
  try {
    if (window.speechSynthesis) {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length) cachedVoices = v;
    }
  } catch {}
}
if (typeof window !== "undefined" && window.speechSynthesis) {
  refreshVoices();
  try { window.speechSynthesis.onvoiceschanged = refreshVoices; } catch {}
}

function speakBrowser(text) {
  try {
    if (!window.speechSynthesis) return;
    refreshVoices();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    const voice = cachedVoices.find((v) => v.lang && v.lang.toLowerCase().startsWith("pt-br"))
      || cachedVoices.find((v) => v.lang && v.lang.toLowerCase().startsWith("pt"));
    if (voice) utterance.voice = voice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  } catch {}
}

export function speak(text) {
  if (!text) return;
  let azure = null;
  try { azure = getAzureSettings(); } catch { azure = null; }
  if (azure && azure.key && azure.region) {
    // Natural neural voice; fall back to the device voice if Azure fails.
    synthesizeWithAzure(text, azure).catch(() => speakBrowser(text));
    return;
  }
  speakBrowser(text);
}

export function stripAccents(text) {
  return text.normalize ? text.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : text;
}

export function normaliseAnswer(text) {
  return stripAccents(String(text || ""))
    .toLowerCase()
    .replace(/[.,!?;:]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function getSpeechRecognition() {
  try { return window.SpeechRecognition || window.webkitSpeechRecognition || null; } catch { return null; }
}

export function friendlyPronunciationFeedback(score) {
  const n = Number(score || 0);
  if (n >= 85) return "Excellent — clear and natural. Keep this phrase in your active toolkit.";
  if (n >= 70) return "Good — understandable. Repeat once more and focus on rhythm.";
  if (n >= 55) return "Nearly there. Slow down and make each vowel clean.";
  return "Keep it simple. Listen once, then repeat slowly in small chunks.";
}

export function scoreClass(score) {
  const n = Number(score || 0);
  if (n >= 80) return "good";
  if (n >= 60) return "ok";
  return "low";
}
