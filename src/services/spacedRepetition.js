export function normaliseDifficulty(difficulty) {
  return ["known", "learning", "difficult"].includes(difficulty) ? difficulty : "learning";
}

export function makeCard(pt, en, difficulty = "learning", tags = []) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    pt,
    en,
    tags,
    difficulty: normaliseDifficulty(difficulty),
    added: Date.now(),
    due: Date.now(),
    interval: 0,
    ease: difficulty === "difficult" ? 2.1 : difficulty === "known" ? 2.8 : 2.5,
    reps: 0,
    lapses: 0,
  };
}

export function normaliseCard(card) {
  return {
    id: card.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    pt: card.pt || "",
    en: card.en || "",
    tags: Array.isArray(card.tags) ? card.tags : [],
    difficulty: normaliseDifficulty(card.difficulty),
    added: Number(card.added || Date.now()),
    due: Number(card.due || Date.now()),
    interval: Number(card.interval || 0),
    ease: Number(card.ease || 2.5),
    reps: Number(card.reps || 0),
    lapses: Number(card.lapses || 0),
  };
}

export function reschedule(card, grade) {
  const next = { ...normaliseCard(card), reps: (card.reps || 0) + 1 };
  const day = 86400000;
  if (grade === "again") {
    next.interval = 0;
    next.due = Date.now() + 10 * 60 * 1000;
    next.ease = Math.max(1.3, (next.ease || 2.5) - 0.25);
    next.lapses = (next.lapses || 0) + 1;
    next.difficulty = "difficult";
  } else if (grade === "good") {
    next.interval = next.interval <= 0 ? 1 : Math.max(1, Math.round(next.interval * (next.ease || 2.5)));
    next.due = Date.now() + next.interval * day;
    next.ease = Math.min(3.0, (next.ease || 2.5) + 0.03);
    next.difficulty = next.reps >= 3 ? "known" : "learning";
  } else {
    next.interval = next.interval <= 0 ? 3 : Math.max(3, Math.round(next.interval * ((next.ease || 2.5) + 0.5)));
    next.due = Date.now() + next.interval * day;
    next.ease = Math.min(3.2, (next.ease || 2.5) + 0.12);
    next.difficulty = "known";
  }
  return next;
}

export function dueCards(deck) {
  return deck.filter((card) => (card.due || 0) <= Date.now()).sort((a, b) => (a.due || 0) - (b.due || 0));
}
