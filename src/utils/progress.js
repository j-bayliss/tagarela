import { LESSONS } from "../data/lessons";

export function defaultProgress() {
  return {
    completed: [],
    activeLessonId: LESSONS[0].id,
    lessonScores: {},
    skillStats: {},
    xp: 0,
    lastLessonAt: 0,
  };
}

export function normaliseProgress(progress) {
  const base = defaultProgress();
  const validIds = new Set(LESSONS.map((lesson) => lesson.id));
  const completed = Array.isArray(progress?.completed) ? progress.completed.filter((id) => validIds.has(id)) : [];
  const activeLessonId = validIds.has(progress?.activeLessonId)
    ? progress.activeLessonId
    : (LESSONS[completed.length] || LESSONS[LESSONS.length - 1]).id;
  return {
    ...base,
    ...progress,
    completed,
    activeLessonId,
    lessonScores: typeof progress?.lessonScores === "object" && progress.lessonScores ? progress.lessonScores : {},
    skillStats: typeof progress?.skillStats === "object" && progress.skillStats ? progress.skillStats : {},
    xp: Number(progress?.xp || 0),
    lastLessonAt: Number(progress?.lastLessonAt || 0),
  };
}

export function nextLesson(progress) {
  const done = new Set(progress?.completed || []);
  return LESSONS.find((lesson) => !done.has(lesson.id)) || LESSONS[LESSONS.length - 1];
}

export function updateSkillStats(prev, tags, correct) {
  const next = { ...(prev || {}) };
  (tags || []).forEach((tag) => {
    const cur = next[tag] || { correct: 0, attempts: 0 };
    next[tag] = {
      correct: cur.correct + (correct ? 1 : 0),
      attempts: cur.attempts + 1,
    };
  });
  return next;
}

export function orderDueByWeakness(due, skillStats) {
  const pct = (tag) => {
    const s = skillStats?.[tag];
    if (!s || !s.attempts) return null;
    return Math.round((Number(s.correct || 0) / Number(s.attempts || 1)) * 100);
  };
  const score = (card) => {
    const vals = (card.tags || []).map(pct).filter((v) => v !== null);
    return vals.length ? Math.min(...vals) : 101; // no data -> lowest priority
  };
  return [...due].sort((a, b) => score(a) - score(b) || (a.due || 0) - (b.due || 0));
}

export function skillSummary(skillStats) {
  return Object.entries(skillStats || {})
    .map(([tag, stat]) => ({
      tag,
      correct: Number(stat.correct || 0),
      attempts: Number(stat.attempts || 0),
      pct: stat.attempts ? Math.round((Number(stat.correct || 0) / Number(stat.attempts || 1)) * 100) : 0,
    }))
    .filter((item) => item.attempts > 0)
    .sort((a, b) => a.pct - b.pct || b.attempts - a.attempts);
}
