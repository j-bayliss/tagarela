import { LESSONS } from "../data/lessons";
import { HIGHER_ORDER } from "../data/higherorder";
import { TRANSFER } from "../data/transfer";
import { CONVO_GAPS } from "../data/conversations";

export function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

const FUNCTION_WORDS = new Set(["de", "da", "do", "das", "dos", "o", "a", "os", "as", "um", "uma", "uns", "umas", "e", "ou", "em", "no", "na", "nos", "nas", "que", "com", "sem", "por", "para", "pra", "eu", "voce", "você", "ele", "ela", "se", "ao", "aos", "à", "às", "meu", "minha", "seu", "sua", "é"]);
const cleanTok = (w) => w.replace(/[.,!?;:]/g, "");

// Builds a lesson's question set. Pure (aside from shuffle's randomness), so it
// lives outside the React component and can be unit-tested directly.
export function makeExercises(lesson, reviewPool = [], skillStats = {}, audioOff = false) {
  const phrases = (lesson.phrases || []).filter((p) => p && p.pt && p.en);
  const tags = lesson.skillTags;
  const tagSet = new Set(tags || []);
  const uniq = (arr) => [...new Set(arr)];
  const allEnglish = LESSONS.flatMap((l) => l.phrases.map((p) => p.en));
  const sameLessonEn = phrases.map((p) => p.en);
  const sameTagLessons = LESSONS.filter((l) => l.id !== lesson.id && (l.skillTags || []).some((t) => tagSet.has(t)));
  const sameTagEn = sameTagLessons.flatMap((l) => l.phrases.map((p) => p.en));

  // Plausible distractors: prefer same-lesson meanings (same topic), then
  // same-skill lessons closest in length, then anything — so wrong options
  // aren't obviously off-topic and guessable.
  const distractors = (correct) => {
    const out = [];
    const add = (cands) => { for (const c of cands) { if (out.length >= 3) break; if (c && c !== correct && !out.includes(c)) out.push(c); } };
    add(shuffle(uniq(sameLessonEn)));
    add(uniq(sameTagEn).sort((a, b) => Math.abs(a.length - correct.length) - Math.abs(b.length - correct.length)));
    add(shuffle(uniq(allEnglish)));
    return out.slice(0, 3);
  };

  // Plausible wrong word tiles for "build the phrase", drawn from other phrases.
  const distractorWords = (p, count) => {
    const have = new Set(p.pt.split(/\s+/).map((w) => cleanTok(w).toLowerCase()));
    const tokens = phrases.filter((q) => q !== p).flatMap((q) => q.pt.split(/\s+/))
      .concat(sameTagLessons.flatMap((l) => l.phrases.flatMap((q) => q.pt.split(/\s+/))));
    const cands = uniq(tokens.map(cleanTok).filter((w) => w.length >= 2 && !have.has(w.toLowerCase())));
    return shuffle(cands).slice(0, count);
  };

  const multiWord = (p) => p.pt.trim().split(/\s+/).length >= 2;

  const choice = (p, title = "Meaning check", listen = false) => ({
    type: "choice", listen, title,
    prompt: p.pt, answer: p.en,
    choices: shuffle([p.en, ...distractors(p.en)]),
    tags, say: p.pt, review: { pt: p.pt, en: p.en },
  });
  const order = (p) => {
    const correctWords = p.pt.split(/\s+/);
    const extras = distractorWords(p, correctWords.length >= 5 ? 2 : 1);
    return {
      type: "order", title: "Build the phrase",
      prompt: p.en, answer: p.pt, words: shuffle([...correctWords, ...extras]),
      tags, say: p.pt, review: { pt: p.pt, en: p.en }, accept: p.accept,
    };
  };
  // Blank a meaningful content word (longest non-function word), not a filler.
  const pickContentIndex = (words) => {
    let bi = -1, best = -1;
    words.forEach((w, i) => {
      const c = cleanTok(w).toLowerCase();
      if (c.length >= 3 && !FUNCTION_WORDS.has(c) && cleanTok(w).length > best) { best = cleanTok(w).length; bi = i; }
    });
    return bi === -1 ? Math.max(0, Math.min(words.length - 1, Math.floor(words.length / 2))) : bi;
  };
  const blank = (p) => {
    const words = p.pt.split(/\s+/);
    const bi = pickContentIndex(words);
    const answerWord = cleanTok(words[bi]);
    const prompt = words.map((w, i) => (i === bi ? "____" : w)).join(" ");
    return { type: "blank", title: "Missing word", prompt, answer: answerWord, full: p.pt, translation: p.en, tags, say: p.pt, review: { pt: p.pt, en: p.en } };
  };
  const dictation = (p) => ({
    type: "dictation", title: "Listen and type",
    prompt: p.pt, answer: p.pt, translation: p.en,
    tags: [...tags, "listening"], say: p.pt, review: { pt: p.pt, en: p.en }, accept: p.accept,
  });
  // Free productive recall: type the whole phrase in Portuguese from English.
  const produce = (p) => ({
    type: "produce", title: "Say it in Portuguese",
    prompt: p.en, answer: p.pt, full: p.pt,
    tags, say: p.pt, review: { pt: p.pt, en: p.en }, accept: p.accept,
  });
  // Two-gap cloze, generated from a phrase with enough words.
  const cloze2 = (p) => {
    const words = p.pt.split(/\s+/);
    const content = words.map((w, i) => ({ i, w: cleanTok(w) })).filter((x) => x.w.length >= 3 && !FUNCTION_WORDS.has(x.w.toLowerCase()));
    let i1, i2;
    if (content.length >= 2) {
      [i1, i2] = content.sort((a, b) => b.w.length - a.w.length).slice(0, 2).map((x) => x.i).sort((a, b) => a - b);
    } else {
      const n = words.length;
      i1 = Math.max(0, Math.floor(n / 3));
      i2 = Math.min(n - 1, Math.floor((2 * n) / 3));
      if (i2 <= i1) i2 = Math.min(n - 1, i1 + 1);
    }
    const a1 = cleanTok(words[i1]);
    const a2 = cleanTok(words[i2]);
    const prompt = words.map((w, i) => (i === i1 || i === i2 ? "____" : w)).join(" ");
    return { type: "cloze2", title: "Fill the gaps", prompt, answers: [a1, a2], full: p.pt, translation: p.en, tags, say: p.pt, review: { pt: p.pt, en: p.en } };
  };

  // Adapt difficulty to how well these skills are known: new learners get
  // gentler, more scaffolded questions; mastered skills get harder, more
  // productive ones. Tiers from the lesson's skill accuracy so far.
  let attempts = 0, correct = 0;
  (lesson.skillTags || []).forEach((t) => { const s = skillStats[t]; if (s) { attempts += s.attempts || 0; correct += s.correct || 0; } });
  const tier = attempts < 4 ? "new" : (correct / attempts >= 0.8 ? "strong" : "learning");

  // Shuffle the phrase order so a repeated lesson feels fresh, but keep each
  // phrase's recognise-then-produce pair together.
  const ex = [];
  shuffle(phrases).forEach((p, i) => {
    // 1) recognition: easiest (read) when new, hardest (listen) when strong.
    //    In no-audio mode, always use the read-and-choose variant.
    if (audioOff) ex.push(choice(p));
    else if (tier === "strong") ex.push(choice(p, "Listen & choose", true));
    else if (tier === "new") ex.push(choice(p));
    else ex.push(i % 2 === 0 ? choice(p) : choice(p, "Listen & choose", true));
    // 2) production: scaffolded tiles when new, free recall when strong
    if (multiWord(p)) {
      if (tier === "strong") ex.push(i % 2 === 0 ? produce(p) : blank(p));
      else if (tier === "new") ex.push(order(p));
      else ex.push(i % 2 === 0 ? order(p) : blank(p));
    } else {
      // single-word: dictation needs audio, so use free recall when muted
      ex.push(audioOff ? produce(p) : tier === "new" ? dictation(p) : produce(p));
    }
  });

  // Delayed free-recall production: phrases met earlier now produced from
  // scratch (strongest retrieval). More of them once a skill is solid.
  const produceCount = tier === "new" ? 1 : tier === "strong" ? 2 : (phrases.length >= 4 ? 2 : 1);
  shuffle(phrases).slice(0, produceCount).forEach((p) => ex.push(produce(p)));

  // Shorter lessons get a mixed recall extra for closure.
  if (phrases.length <= 4 && phrases[0]) ex.push(audioOff ? choice(phrases[0]) : choice(phrases[0], "Listen & choose", true));

  // Spiralling: bring back a couple of phrases from earlier lessons so old
  // vocabulary keeps recurring (spaced, interleaved retrieval).
  if (reviewPool.length) {
    shuffle(reviewPool).slice(0, 2).forEach((p, k) => {
      const rTags = p.skillTags || tags;
      if (k === 0) {
        ex.push({ type: "choice", title: "Review · meaning", prompt: p.pt, answer: p.en, choices: shuffle([p.en, ...distractors(p.en)]), tags: rTags, say: p.pt, review: { pt: p.pt, en: p.en }, callback: true });
      } else {
        ex.push({ type: "produce", title: "Review · say it", prompt: p.en, answer: p.pt, full: p.pt, tags: rTags, say: p.pt, review: { pt: p.pt, en: p.en }, callback: true });
      }
    });
  }

  // Transfer item (A1/A2): apply the lesson's rule to a brand-new example.
  const transferItem = TRANSFER[lesson.id];
  if (transferItem) {
    ex.push({
      type: "pick", title: "Apply the rule", transfer: true,
      instruction: transferItem.instruction, prompt: transferItem.prompt,
      choices: shuffle(transferItem.choices), answer: transferItem.answer,
      say: transferItem.say, note: transferItem.note,
      review: { pt: transferItem.say, en: transferItem.en || "" }, tags,
    });
  }

  // Contextual gap-fill: complete a short conversation (pragmatics in context).
  const convoItem = CONVO_GAPS[lesson.id];
  if (convoItem) {
    ex.push({
      type: "convo", title: "Complete the conversation",
      lines: convoItem.lines, instruction: convoItem.instruction,
      choices: shuffle(convoItem.choices), answer: convoItem.answer,
      say: convoItem.say || convoItem.answer, note: convoItem.note,
      review: { pt: convoItem.answer, en: convoItem.en || "" }, tags,
    });
  }

  // B1/B2/C1 lessons get harder, higher-order questions on top.
  const unitId = lesson.unit || "";
  const level = unitId.startsWith("c1") ? "c1" : unitId.startsWith("b2") ? "b2" : unitId.startsWith("b1") ? "b1" : null;
  if (level) {
    const clozeSource = phrases.find((p) => p.pt.trim().split(/\s+/).length >= 4);
    if (clozeSource) ex.push(cloze2(clozeSource));
    const pool = HIGHER_ORDER[level] || [];
    shuffle(pool).slice(0, 2).forEach((item) => {
      ex.push({ ...item, title: item.type === "mistake" ? "Find the mistake" : "Transform it", answer: item.answer, say: item.answer, review: { pt: item.answer, en: item.en || "" }, tags });
    });
  }

  return ex.length ? ex : [choice(phrases[0] || { pt: "Oi", en: "Hi" })];
}
