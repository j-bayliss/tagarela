import { describe, it, expect } from "vitest";
import { reschedule, normaliseCard, normaliseDifficulty, makeCard, dueCards } from "../services/spacedRepetition";
import { parseJSON } from "../services/anthropic";
import { normaliseAnswer, stripAccents } from "../utils/language";
import { normaliseProgress, skillSummary, orderDueByWeakness } from "../utils/progress";
import { dayString } from "../services/storage";
import { answerMatches } from "../utils/answers";
import { recommendFromHistory } from "../data/placement";
import { makeExercises } from "../utils/exercises";
import { LESSONS } from "../data/lessons";

describe("spaced repetition", () => {
  it("normalises unknown difficulty to learning", () => {
    expect(normaliseDifficulty("bogus")).toBe("learning");
    expect(normaliseDifficulty("known")).toBe("known");
  });

  it("makes a fresh card due now with zero interval", () => {
    const c = makeCard("oi", "hi");
    expect(c.interval).toBe(0);
    expect(c.reps).toBe(0);
    expect(c.due).toBeLessThanOrEqual(Date.now());
  });

  it("reschedules 'again' to soon and marks difficult", () => {
    const c = makeCard("oi", "hi");
    const r = reschedule(c, "again");
    expect(r.difficulty).toBe("difficult");
    expect(r.due).toBeGreaterThan(Date.now());
    expect(r.due).toBeLessThan(Date.now() + 60 * 60 * 1000);
    expect(r.lapses).toBe(1);
  });

  it("grows the interval on repeated 'good'", () => {
    const c = makeCard("oi", "hi");
    const g1 = reschedule(c, "good");
    expect(g1.interval).toBe(1);
    const g2 = reschedule(g1, "good");
    expect(g2.interval).toBeGreaterThan(g1.interval);
  });

  it("'easy' jumps further than 'good'", () => {
    const c = makeCard("oi", "hi");
    expect(reschedule(c, "easy").interval).toBeGreaterThanOrEqual(3);
  });

  it("normaliseCard fills sane defaults", () => {
    const nc = normaliseCard({ pt: "x" });
    expect(nc.ease).toBe(2.5);
    expect(nc.difficulty).toBe("learning");
    expect(Array.isArray(nc.tags)).toBe(true);
  });

  it("dueCards returns only past-due, sorted", () => {
    const now = Date.now();
    const deck = [
      { id: "a", due: now + 10000 },
      { id: "b", due: now - 10000 },
      { id: "c", due: now - 5000 },
    ];
    expect(dueCards(deck).map((c) => c.id)).toEqual(["b", "c"]);
  });
});

describe("parseJSON", () => {
  it("strips code fences", () => {
    expect(parseJSON("```json\n{\"a\":1}\n```")).toEqual({ a: 1 });
  });
  it("extracts JSON embedded in noise", () => {
    expect(parseJSON("noise {\"b\":2} tail")).toEqual({ b: 2 });
  });
  it("returns null for non-JSON", () => {
    expect(parseJSON("not json")).toBeNull();
  });
});

describe("language utils", () => {
  it("strips accents", () => {
    expect(stripAccents("ção")).toBe("cao");
  });
  it("normalises answers (case, accents, punctuation, spacing)", () => {
    expect(normaliseAnswer("  Olá, Tudo BEM? ")).toBe("ola tudo bem");
  });
});

describe("progress", () => {
  it("normalises progress and coerces xp to number", () => {
    const p = normaliseProgress({ completed: ["does-not-exist"], xp: "40" });
    expect(Array.isArray(p.completed)).toBe(true);
    expect(p.xp).toBe(40);
  });

  it("skillSummary surfaces weakest skill first", () => {
    const ss = { greetings: { correct: 1, attempts: 4 }, food: { correct: 9, attempts: 10 } };
    expect(skillSummary(ss)[0].tag).toBe("greetings");
  });

  it("orderDueByWeakness puts weak-tag cards first and untagged last", () => {
    const ss = { greetings: { correct: 1, attempts: 4 }, food: { correct: 9, attempts: 10 } };
    const due = [
      { id: "a", tags: ["food"], due: 1 },
      { id: "b", tags: ["greetings"], due: 2 },
      { id: "c", tags: [], due: 3 },
    ];
    expect(orderDueByWeakness(due, ss).map((c) => c.id)).toEqual(["b", "a", "c"]);
  });
});

describe("storage", () => {
  it("dayString is YYYY-MM-DD", () => {
    expect(dayString()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("answerMatches (lenient checker)", () => {
  it("accepts an exact match", () => {
    expect(answerMatches("Tem pão francês?", "Tem pão francês?")).toBe(true);
  });
  it("accepts an optional leading subject pronoun, both directions", () => {
    expect(answerMatches("Você tem pão francês?", "Tem pão francês?")).toBe(true);
    expect(answerMatches("Tem pão francês", "Você tem pão francês")).toBe(true);
  });
  it("ignores accents and case", () => {
    expect(answerMatches("voce esta com fome", "Você está com fome")).toBe(true);
  });
  it("treats pra/para and tá/está as equal", () => {
    expect(answerMatches("pra", "para")).toBe(true);
    expect(answerMatches("tá bom", "está bom")).toBe(true);
  });
  it("still rejects a genuinely wrong answer", () => {
    expect(answerMatches("eu quero chá", "eu quero café")).toBe(false);
    expect(answerMatches("eu tenho fome", "estou com fome")).toBe(false);
  });
  it("honours an explicit accept list", () => {
    expect(answerMatches("a gente quer", "nós queremos", ["a gente quer"])).toBe(true);
  });
  it("accepts an added pointing word (isso/isto/aquilo)", () => {
    expect(answerMatches("Quanto isso custa?", "Quanto custa?")).toBe(true);
    expect(answerMatches("Quanto custa isso?", "Quanto custa?")).toBe(true);
    expect(answerMatches("Quanto é isso?", "Quanto é?")).toBe(true);
  });
  it("still rejects a genuinely missing required word", () => {
    expect(answerMatches("eu quero", "eu quero isso")).toBe(false);
  });
});

describe("placement recommendation", () => {
  it("defaults to A1 with no/zero correct answers", () => {
    expect(recommendFromHistory([])).toBe("A1");
    expect(recommendFromHistory([{ level: "A2", correct: false }])).toBe("A1");
  });
  it("recommends the highest level answered correctly", () => {
    expect(recommendFromHistory([{ level: "A1", correct: true }, { level: "A2", correct: true }, { level: "B1", correct: true }, { level: "B2", correct: false }])).toBe("B1");
    expect(recommendFromHistory([{ level: "C1", correct: true }])).toBe("C1");
  });
});

describe("makeExercises", () => {
  const lesson = LESSONS.find((l) => (l.phrases || []).length >= 4) || LESSONS[0];

  it("generates a non-empty set of well-formed exercises", () => {
    const ex = makeExercises(lesson, [], {}, false);
    expect(ex.length).toBeGreaterThan(0);
    ex.forEach((e) => {
      expect(typeof e.type).toBe("string");
      expect(Array.isArray(e.tags)).toBe(true);
    });
  });

  it("produces no listening questions in no-audio mode", () => {
    const ex = makeExercises(lesson, [], {}, true);
    expect(ex.length).toBeGreaterThan(0);
    expect(ex.some((e) => e.type === "dictation")).toBe(false);
    expect(ex.some((e) => e.type === "choice" && e.listen)).toBe(false);
  });

  it("two-gap cloze always carries exactly two answers", () => {
    const ex = makeExercises(lesson, [], {}, false);
    ex.filter((e) => e.type === "cloze2").forEach((e) => expect(e.answers).toHaveLength(2));
  });

  it("never asks free-typing in word-tiles mode", () => {
    const ex = makeExercises(lesson, [], {}, false, "tiles");
    expect(ex.some((e) => e.type === "produce")).toBe(false);
  });

  it("auto mode scaffolds A1 (no free-typing) but allows it at B1+", () => {
    const a1 = LESSONS.find((l) => l.unit === "start");
    const b1 = LESSONS.find((l) => (l.unit || "").startsWith("b1"));
    if (a1) expect(makeExercises(a1, [], {}, false, "auto").some((e) => e.type === "produce")).toBe(false);
    if (b1) expect(makeExercises(b1, [], {}, false, "typing").some((e) => e.type === "produce")).toBe(true);
  });
});
