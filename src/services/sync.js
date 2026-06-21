// Cross-device sync via a private GitHub Gist. No backend needed — the user
// supplies a personal-access token (gist scope), stored locally like the other
// keys. The GitHub REST API supports CORS for authenticated browser requests.
const API = "https://api.github.com";
const FILE = "tagarela-backup.json";

function headers(token) {
  return {
    Authorization: `Bearer ${token.trim()}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };
}

// Create or update the private gist; returns its id.
export async function gistBackup(token, gistId, payload) {
  const body = {
    description: "Tagarela backup",
    public: false,
    files: { [FILE]: { content: JSON.stringify(payload) } },
  };
  const url = gistId ? `${API}/gists/${gistId}` : `${API}/gists`;
  const res = await fetch(url, { method: gistId ? "PATCH" : "POST", headers: headers(token), body: JSON.stringify(body) });
  if (res.status === 404 && gistId) {
    // The saved gist was deleted — make a fresh one.
    return gistBackup(token, null, payload);
  }
  if (!res.ok) throw new Error(res.status === 401 ? "Invalid token (needs 'gist' scope)." : `Cloud backup failed (${res.status}).`);
  const json = await res.json();
  return json.id;
}

export async function gistRestore(token, gistId) {
  if (!gistId) throw new Error("No cloud backup found yet — back up first.");
  const res = await fetch(`${API}/gists/${gistId}`, { headers: headers(token) });
  if (!res.ok) throw new Error(res.status === 401 ? "Invalid token (needs 'gist' scope)." : `Cloud restore failed (${res.status}).`);
  const json = await res.json();
  const file = json.files && json.files[FILE];
  if (!file || !file.content) throw new Error("Cloud backup is empty or missing.");
  return JSON.parse(file.content);
}
