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

export function answerMatches(user, expected, accept = []) {
  const u = canonAnswer(user);
  return [expected, ...(accept || [])].map(canonAnswer).some((c) => c === u || stripLeadPronoun(c) === stripLeadPronoun(u));
}
