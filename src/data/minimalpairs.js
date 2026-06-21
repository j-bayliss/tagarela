// Minimal-pair drills for the Brazilian Portuguese sounds English speakers
// find hardest. Each group contrasts one sound; the ear-trainer plays one
// word of a pair and asks the learner which they heard.
export const MINIMAL_PAIRS = [
  {
    id: "nasal",
    title: "Nasais (ã, ão)",
    note: "Nasal vowels send air through the nose. Keep the vowel clean — don't add a hard 'm' or 'n' at the end. 'pão' isn't 'pown'.",
    pairs: [
      { a: { pt: "lã", en: "wool" }, b: { pt: "lá", en: "there" } },
      { a: { pt: "pão", en: "bread" }, b: { pt: "pau", en: "stick / wood" } },
      { a: { pt: "mão", en: "hand" }, b: { pt: "mau", en: "bad" } },
    ],
  },
  {
    id: "o-open-closed",
    title: "ô vs ó (O fechado/aberto)",
    note: "Closed ô sounds like the 'o' in 'go'; open ó like the 'aw' in 'saw'. The difference changes the word — avô (grandfather) vs avó (grandmother).",
    pairs: [
      { a: { pt: "avô", en: "grandfather (ô)" }, b: { pt: "avó", en: "grandmother (ó)" } },
      { a: { pt: "pôde", en: "could / was able (past)" }, b: { pt: "pode", en: "can (present)" } },
      { a: { pt: "no", en: "in the (closed)" }, b: { pt: "nó", en: "knot (open)" } },
    ],
  },
  {
    id: "r-rr",
    title: "r vs rr",
    note: "A single r between vowels is a soft tap (like the tt in 'butter'). Double rr — and r at the start of a word — is a strong, throaty sound.",
    pairs: [
      { a: { pt: "caro", en: "expensive (tap)" }, b: { pt: "carro", en: "car (strong)" } },
      { a: { pt: "moro", en: "I live (tap)" }, b: { pt: "morro", en: "hill (strong)" } },
      { a: { pt: "era", en: "was / era (tap)" }, b: { pt: "erra", en: "(he) errs (strong)" } },
    ],
  },
  {
    id: "lh",
    title: "lh (o som 'lli')",
    note: "lh is a single sound, like the 'lli' in 'million' — not a hard L. 'filha' = 'fee-lya'.",
    pairs: [
      { a: { pt: "filha", en: "daughter (lh)" }, b: { pt: "fila", en: "queue / line (l)" } },
      { a: { pt: "malha", en: "mesh / knit (lh)" }, b: { pt: "mala", en: "suitcase (l)" } },
      { a: { pt: "alho", en: "garlic (lh)" }, b: { pt: "alô", en: "hello (on phone) (l)" } },
    ],
  },
  {
    id: "nh",
    title: "nh (o som 'ny')",
    note: "nh is a single sound, like the 'ny' in 'canyon'. 'minha' = 'mee-nya'.",
    pairs: [
      { a: { pt: "minha", en: "my (nh)" }, b: { pt: "mina", en: "mine (n)" } },
      { a: { pt: "manha", en: "cunning / tantrum (nh)" }, b: { pt: "mana", en: "sis (n)" } },
      { a: { pt: "ganha", en: "(he) wins (nh)" }, b: { pt: "gana", en: "strong urge (n)" } },
    ],
  },
  {
    id: "ti-di",
    title: "ti & di ('tchi / dji')",
    note: "In most of Brazil, t and d before an 'i' (or a final unstressed 'e') turn into 'tch' and 'dj': tia = 'tchia', dia = 'djia', noite = 'noitchi'.",
    pairs: [
      { a: { pt: "tia", en: "aunt" }, b: { pt: "dia", en: "day" } },
      { a: { pt: "tom", en: "tone" }, b: { pt: "dom", en: "gift / talent" } },
      { a: { pt: "toca", en: "(he) touches / burrow" }, b: { pt: "doca", en: "dock" } },
    ],
  },
];
