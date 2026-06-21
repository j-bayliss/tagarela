export const KEYS = {
  deck: "tagarela:deck",
  mistakes: "tagarela:mistakes",
  streak: "tagarela:streak",
  daily: "tagarela:daily",
  progress: "tagarela:classes",
  onboarding: "tagarela:onboarding",
  apiKey: "tagarela:apikey",
  azureKey: "tagarela:azure:speechKey",
  azureRegion: "tagarela:azure:region",
  azureVoice: "tagarela:azure:voice",
};

export const DEFAULT_VOICE = "pt-BR-FranciscaNeural";
// Brazilian neural voices used for the voice selector and the "Mix" (random) mode.
export const VOICE_IDS = [
  "pt-BR-FranciscaNeural",
  "pt-BR-AntonioNeural",
  "pt-BR-BrendaNeural",
  "pt-BR-FabioNeural",
  "pt-BR-GiovannaNeural",
  "pt-BR-HumbertoNeural",
];

export const BACKUP_VERSION = 4;

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function getApiKey() {
  try { return localStorage.getItem(KEYS.apiKey) || ""; } catch { return ""; }
}

export function saveApiKey(key) {
  try { localStorage.setItem(KEYS.apiKey, (key || "").trim()); } catch {}
}

export function getAzureSettings() {
  try {
    return {
      key: localStorage.getItem(KEYS.azureKey) || "",
      region: localStorage.getItem(KEYS.azureRegion) || "uksouth",
      voice: localStorage.getItem(KEYS.azureVoice) || DEFAULT_VOICE,
      locale: "pt-BR",
    };
  } catch {
    return { key: "", region: "uksouth", voice: DEFAULT_VOICE, locale: "pt-BR" };
  }
}

export function saveAzureSettings(settings) {
  try {
    localStorage.setItem(KEYS.azureKey, (settings.key || "").trim());
    localStorage.setItem(KEYS.azureRegion, (settings.region || "uksouth").trim());
    localStorage.setItem(KEYS.azureVoice, (settings.voice || DEFAULT_VOICE).trim());
  } catch {}
}

export function dayString(ts = Date.now()) {
  const x = new Date(ts);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
}
