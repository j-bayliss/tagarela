import { describe, it, expect } from "vitest";
import { reschedule, normaliseCard, normaliseDifficulty, makeCard, dueCards } from "../services/spacedRepetition";
import { parseJSON } from "../services/anthropic";
import { normaliseAnswer, stripAccents } from "../utils/language";
import { normaliseProgress, skillSummary, orderDueByWeakness } from "../utils/progress";
import { dayString } from "../services/storage";

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
