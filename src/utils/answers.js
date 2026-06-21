import { normaliseAnswer } from "./language";

// Accept valid alternative phrasings, not just one exact string. Handles common
// Brazilian-Portuguese equivalences so legitimate answers aren't marked wrong:
// an optional leading subject pronoun (você tem ≡ tem) and casual spellings
// (pra/para, vc/você, tá/está). Kept conservative — wrong words/order still fail.
const SUBJECT_PRONOUNS = ["a gente", "eu", "voce", "tu", "ele", "ela", "nos", "voces", "eles", "elas"];
const TOKEN_EQUIV = { pra: "para", vc: "voce", ta: "esta" }; // applied to accent-stripped tokens

export const canonAnswer = (s) => normaliseAnswer(s).split(" ").map((w) => TOKEN_EQUIV[w] || w).join(" ");

const stripLeadPronoun = (s) => {
  for (const p of SUBJECT_PRONOUNS) {
    if (s === p) return s;
    if (s.startsWith(p + " ")) return s.slice(p.length + 1);
  }
  return s;
};

// Optional "pointing" words the learner may add without changing correctness
// (Quanto custa? ≡ Quanto isso custa?). Only ever removed from the LEARNER's
// answer, never the expected — so omitting a genuinely required word still fails.
const DEICTICS = new Set(["isso", "isto", "aquilo", "aqui", "ali"]);
const dropDeictics = (s) => s.split(" ").filter((w) => !DEICTICS.has(w)).join(" ").replace(/\s+/g, " ").trim();

export function answerMatches(user, expected, accept = []) {
  const u = canonAnswer(user);
  const variants = [u, dropDeictics(u)];
  const targets = [expected, ...(accept || [])].map(canonAnswer);
  return targets.some((c) => variants.some((v) => c === v || stripLeadPronoun(c) === stripLeadPronoun(v)));
}
