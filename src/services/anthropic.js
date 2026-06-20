import { getApiKey } from "./storage";

const MODEL = "claude-sonnet-4-6";

export function parseJSON(text) {
  if (!text) return null;
  let t = text.trim().replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
  const s = t.indexOf("{");
  const e = t.lastIndexOf("}");
  if (s !== -1 && e !== -1) t = t.slice(s, e + 1);
  try { return JSON.parse(t); } catch { return null; }
}

export async function testAnthropicKey(key) {
  if (!key || !key.trim()) throw new Error("Enter a key first.");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key.trim(),
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({ model: MODEL, max_tokens: 8, messages: [{ role: "user", content: "Say OK" }] }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Key check failed (${res.status}). ${text.slice(0, 120)}`.trim());
  }
  return true;
}

export async function askClaudeStream(system, messages, onText) {
  const key = getApiKey();
  if (!key) throw new Error("Add your Anthropic API key in settings to use AI tutor features.");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({ model: MODEL, max_tokens: 900, system, messages, stream: true }),
  });
  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Anthropic request failed (${res.status})`);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let nl;
    while ((nl = buffer.indexOf("\n")) !== -1) {
      const line = buffer.slice(0, nl).trim();
      buffer = buffer.slice(nl + 1);
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const evt = JSON.parse(payload);
        if (evt.type === "content_block_delta" && evt.delta && typeof evt.delta.text === "string") {
          full += evt.delta.text;
          if (onText) onText(full, evt.delta.text);
        }
      } catch {}
    }
  }
  return full;
}

export async function askClaude(system, messages) {
  const key = getApiKey();
  if (!key) throw new Error("Add your Anthropic API key in settings to use AI tutor features.");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({ model: MODEL, max_tokens: 900, system, messages }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Anthropic request failed (${res.status})`);
  }
  const data = await res.json();
  return data?.content?.[0]?.text || "";
}
