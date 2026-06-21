import { useEffect, useRef, useState } from "react";
import { COURSE_UNITS, LESSONS, skillLabel } from "../data/lessons";
import { HIGHER_ORDER } from "../data/higherorder";
import { TRANSFER } from "../data/transfer";
import { CONVO_GAPS } from "../data/conversations";
import { normaliseAnswer, speak } from "../utils/language";
import { ProgressBar, XpPop } from "../components/Common";
import { Icons } from "../components/Icons";
import { buzz } from "../utils/haptics";

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

// Like normaliseAnswer but keeps accents, so we can tell when an answer was
// only correct after ignoring them (to nudge the learner about accents).
const normKeepAccents = (s) => String(s || "").toLowerCase().replace(/[.,!?;:]/g, "").replace(/\s+/g, " ").trim();

// Accept valid alternative phrasings, not just one exact string. Handles
// common Brazilian-Portuguese equivalences so legitimate answers aren't
// marked wrong: an optional leading subject pronoun (você tem ≡ tem), and
// casual spellings (pra/para, vc/você, tá/está).
const SUBJECT_PRONOUNS = ["a gente", "eu", "voce", "tu", "ele", "ela", "nos", "voces", "eles", "elas"];
const TOKEN_EQUIV = { pra: "para", vc: "voce", ta: "esta" }; // applied to accent-stripped tokens
const canonAnswer = (s) => normaliseAnswer(s).split(" ").map((w) => TOKEN_EQUIV[w] || w).join(" ");
const stripLeadPronoun = (s) => {
  for (const p of SUBJECT_PRONOUNS) {
    if (s === p) return s;
    if (s.startsWith(p + " ")) return s.slice(p.length + 1);
  }
  return s;
};
function answerMatches(user, expected, accept = []) {
  const u = canonAnswer(user);
  return [expected, ...(accept || [])].map(canonAnswer).some((c) => c === u || stripLeadPronoun(c) === stripLeadPronoun(u));
}

const FUNCTION_WORDS = new Set(["de", "da", "do", "das", "dos", "o", "a", "os", "as", "um", "uma", "uns", "umas", "e", "ou", "em", "no", "na", "nos", "nas", "que", "com", "sem", "por", "para", "pra", "eu", "voce", "você", "ele", "ela", "se", "ao", "aos", "à", "às", "meu", "minha", "seu", "sua", "é"]);
const cleanTok = (w) => w.replace(/[.,!?;:]/g, "");

// On-screen accent keys so learners can type Portuguese diacritics on a phone.
const ACCENT_CHARS = ["á", "â", "ã", "à", "ç", "é", "ê", "í", "ó", "ô", "õ", "ú"];
function AccentKeys({ onInsert }) {
  return (
    <div className="tg-accents">
      {ACCENT_CHARS.map((c) => (
        // onMouseDown preventDefault keeps the input focused/caret intact
        <button type="button" key={c} className="tg-accent-key" onMouseDown={(e) => e.preventDefault()} onClick={() => onInsert(c)}>{c}</button>
      ))}
    </div>
  );
}

function makeExercises(lesson, reviewPool = [], skillStats = {}) {
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
      tags, say: p.pt, review: { pt: p.pt, en: p.en },
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
    tags: [...tags, "listening"], say: p.pt, review: { pt: p.pt, en: p.en },
  });
  // Free productive recall: type the whole phrase in Portuguese from English.
  const produce = (p) => ({
    type: "produce", title: "Say it in Portuguese",
    prompt: p.en, answer: p.pt, full: p.pt,
    tags, say: p.pt, review: { pt: p.pt, en: p.en },
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

  // Two complementary exercises per phrase — a recognition step then a
  // production / listening step — so each phrase is practised more deeply and
  // longer lessons naturally yield more questions. Single-word phrases skip
  // word-order / fill-in-the-blank.
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
    // 1) recognition: easiest (read) when new, hardest (listen) when strong
    if (tier === "strong") ex.push(choice(p, "Listen & choose", true));
    else if (tier === "new") ex.push(choice(p));
    else ex.push(i % 2 === 0 ? choice(p) : choice(p, "Listen & choose", true));
    // 2) production: scaffolded tiles when new, free recall when strong
    if (multiWord(p)) {
      if (tier === "strong") ex.push(i % 2 === 0 ? produce(p) : blank(p));
      else if (tier === "new") ex.push(order(p));
      else ex.push(i % 2 === 0 ? order(p) : blank(p));
    } else {
      ex.push(tier === "new" ? dictation(p) : produce(p));
    }
  });

  // Delayed free-recall production: phrases met earlier now produced from
  // scratch (strongest retrieval). More of them once a skill is solid.
  const produceCount = tier === "new" ? 1 : tier === "strong" ? 2 : (phrases.length >= 4 ? 2 : 1);
  shuffle(phrases).slice(0, produceCount).forEach((p) => ex.push(produce(p)));

  // Shorter lessons get a mixed recall extra for closure.
  if (phrases.length <= 4 && phrases[0]) ex.push(choice(phrases[0], "Listen & choose", true));

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

function Exercise({ exercise, onAnswer }) {
  const [selected, setSelected] = useState("");
  const [typed, setTyped] = useState("");
  const [typed2, setTyped2] = useState("");
  const [built, setBuilt] = useState([]);
  const [pool, setPool] = useState(exercise.words || []);
  const [eliminated, setEliminated] = useState([]);
  const [hadMistake, setHadMistake] = useState(false);
  const inputRef = useRef(null);
  const input2Ref = useRef(null);
  const [clozeFocus, setClozeFocus] = useState("a");

  // Insert an accent character at the caret of a given field.
  const insertInto = (ref, value, setValue) => (ch) => {
    const el = ref.current;
    if (!el || el.selectionStart == null) { setValue(value + ch); return; }
    const s = el.selectionStart, e = el.selectionEnd;
    setValue(value.slice(0, s) + ch + value.slice(e));
    requestAnimationFrame(() => { try { el.focus(); el.setSelectionRange(s + 1, s + 1); } catch {} });
    buzz(4);
  };

  const meta = { tags: exercise.tags, title: exercise.title, say: exercise.say, review: exercise.review, note: exercise.note };

  const submit = (value) => {
    const answer = value ?? selected ?? typed;
    const correct = answerMatches(answer, exercise.answer, exercise.accept);
    // Only nudge about accents when the accents are the *only* difference.
    const accentNote = correct && normaliseAnswer(answer) === normaliseAnswer(exercise.answer) && normKeepAccents(answer) !== normKeepAccents(exercise.answer) ? exercise.answer : null;
    onAnswer({ correct, userAnswer: answer, expected: exercise.answer, accentNote, ...meta });
  };

  if (exercise.type === "choice") {
    const checkChoice = () => {
      if (selected === exercise.answer) {
        onAnswer({ correct: !hadMistake, recovered: hadMistake, userAnswer: selected, expected: exercise.answer, ...meta });
      } else {
        buzz([0, 18, 80, 18]);
        setEliminated((e) => e.concat(selected));
        setHadMistake(true);
        setSelected("");
      }
    };
    return (
      <div className="tg-card lesson-exercise">
        <div className="tg-label">{exercise.title}</div>
        {exercise.listen ? (
          <button className="tg-listen" onClick={() => speak(exercise.say)}>{Icons.speaker} Play phrase</button>
        ) : (
          <>
            <div className="tg-big-pt">{exercise.prompt}</div>
            <button className="tg-mini" onClick={() => speak(exercise.prompt)}>{Icons.speaker} Hear it</button>
          </>
        )}
        <div className="tg-options">
          {exercise.choices.map((choice) => {
            const out = eliminated.includes(choice);
            return (
              <button
                key={choice}
                className={`${selected === choice ? "selected" : ""} ${out ? "eliminated" : ""}`}
                disabled={out}
                onClick={() => { if (!out) { buzz(6); setSelected(choice); } }}
              >{choice}</button>
            );
          })}
        </div>
        {hadMistake ? <div className="tg-retry-hint">Not quite — pick another answer.</div> : null}
        <button className="tg-btn tg-btn-primary" disabled={!selected} onClick={checkChoice}>Check</button>
      </div>
    );
  }

  if (exercise.type === "order") {
    const add = (word, idx) => {
      buzz(6);
      setBuilt((b) => b.concat(word));
      setPool((p) => p.filter((_, i) => i !== idx));
    };
    const undo = () => {
      const last = built[built.length - 1];
      if (!last) return;
      setBuilt((b) => b.slice(0, -1));
      setPool((p) => p.concat(last));
    };
    return (
      <div className="tg-card lesson-exercise">
        <div className="tg-label">{exercise.title}</div>
        <div className="tg-prompt-en">{exercise.prompt}</div>
        <div className="tg-build-line">{built.length ? built.join(" ") : "Tap the words in order"}</div>
        <div className="tg-word-pool">{pool.map((word, idx) => <button key={`${word}-${idx}`} onClick={() => add(word, idx)}>{word}</button>)}</div>
        <button className="tg-mini" onClick={undo}>Undo</button>
        <button className="tg-btn tg-btn-primary" disabled={!built.length} onClick={() => submit(built.join(" "))}>Check</button>
      </div>
    );
  }

  if (exercise.type === "dictation") {
    return (
      <div className="tg-card lesson-exercise">
        <div className="tg-label">{exercise.title}</div>
        <button className="tg-listen" onClick={() => speak(exercise.prompt)}>{Icons.speaker} Play Portuguese</button>
        <div className="tg-meaning">{exercise.translation}</div>
        <textarea ref={inputRef} className="tg-ta" value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Type what you hear in Portuguese" autoCapitalize="none" autoCorrect="off" spellCheck="false" />
        <AccentKeys onInsert={insertInto(inputRef, typed, setTyped)} />
        <button className="tg-btn tg-btn-primary" disabled={!typed.trim()} onClick={() => submit(typed)}>Check</button>
      </div>
    );
  }

  if (exercise.type === "cloze2") {
    const seg = exercise.prompt.split("____");
    const check = () => {
      const ok = answerMatches(typed, exercise.answers[0]) && answerMatches(typed2, exercise.answers[1]);
      const accentNote = ok && (normKeepAccents(typed) !== normKeepAccents(exercise.answers[0]) || normKeepAccents(typed2) !== normKeepAccents(exercise.answers[1])) ? exercise.answers.join(", ") : null;
      onAnswer({ correct: ok, userAnswer: `${typed}, ${typed2}`, expected: exercise.answers.join(", "), accentNote, ...meta });
    };
    return (
      <div className="tg-card lesson-exercise">
        <div className="tg-label">{exercise.title}</div>
        {exercise.translation ? <div className="tg-meaning">"{exercise.translation}"</div> : null}
        <div className="tg-blank-line">
          <span className="tg-blank-ctx">{seg[0]}</span>
          <input ref={inputRef} className="tg-blank-input" value={typed} onChange={(e) => setTyped(e.target.value)} onFocus={() => setClozeFocus("a")} placeholder="?" autoCapitalize="none" autoCorrect="off" spellCheck="false" size={Math.max(4, exercise.answers[0].length + 1)} />
          <span className="tg-blank-ctx">{seg[1]}</span>
          <input ref={input2Ref} className="tg-blank-input" value={typed2} onChange={(e) => setTyped2(e.target.value)} onFocus={() => setClozeFocus("b")} placeholder="?" autoCapitalize="none" autoCorrect="off" spellCheck="false" size={Math.max(4, exercise.answers[1].length + 1)} />
          <span className="tg-blank-ctx">{seg[2]}</span>
        </div>
        <AccentKeys onInsert={clozeFocus === "b" ? insertInto(input2Ref, typed2, setTyped2) : insertInto(inputRef, typed, setTyped)} />
        <button className="tg-mini" onClick={() => speak(exercise.full)}>{Icons.speaker} Hear full phrase</button>
        <button className="tg-btn tg-btn-primary" disabled={!typed.trim() || !typed2.trim()} onClick={check}>Check</button>
      </div>
    );
  }

  if (exercise.type === "mistake") {
    const tokens = exercise.wrong.split(/\s+/);
    const check = () => {
      const tk = tokens[selected] || "";
      const clean = tk.replace(/[.,!?;:]/g, "").toLowerCase();
      const correct = clean === exercise.wrongWord.toLowerCase();
      onAnswer({ correct, userAnswer: tk, expected: exercise.answer, ...meta });
    };
    return (
      <div className="tg-card lesson-exercise">
        <div className="tg-label">{exercise.title}</div>
        <div className="tg-meaning">Tap the word that's wrong, then check.</div>
        <div className="tg-word-pool">
          {tokens.map((tk, i) => (
            <button key={i} className={selected === i ? "selected" : ""} onClick={() => { buzz(6); setSelected(i); }}>{tk}</button>
          ))}
        </div>
        <button className="tg-btn tg-btn-primary" disabled={selected === ""} onClick={check}>Check</button>
      </div>
    );
  }

  if (exercise.type === "transform") {
    return (
      <div className="tg-card lesson-exercise">
        <div className="tg-label">{exercise.title}</div>
        <div className="tg-coach">🔁 {exercise.instruction}</div>
        <div className="tg-prompt-en">{exercise.prompt}</div>
        <button className="tg-mini" onClick={() => speak(exercise.prompt)}>{Icons.speaker} Hear original</button>
        <textarea ref={inputRef} className="tg-ta" value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Rewrite it in Portuguese" autoCapitalize="none" autoCorrect="off" spellCheck="false" />
        <AccentKeys onInsert={insertInto(inputRef, typed, setTyped)} />
        <button className="tg-btn tg-btn-primary" disabled={!typed.trim()} onClick={() => submit(typed)}>Check</button>
      </div>
    );
  }

  if (exercise.type === "produce") {
    return (
      <div className="tg-card lesson-exercise">
        <div className="tg-label">{exercise.title}</div>
        <div className="tg-meaning">Say this in Portuguese — no word tiles this time.</div>
        <div className="tg-prompt-en">{exercise.prompt}</div>
        <textarea ref={inputRef} className="tg-ta" value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Type it in Portuguese…" autoCapitalize="none" autoCorrect="off" spellCheck="false" />
        <AccentKeys onInsert={insertInto(inputRef, typed, setTyped)} />
        <button className="tg-btn tg-btn-primary" disabled={!typed.trim()} onClick={() => submit(typed)}>Check</button>
      </div>
    );
  }

  if (exercise.type === "pick") {
    return (
      <div className="tg-card lesson-exercise">
        <div className="tg-label">{exercise.title}</div>
        {exercise.instruction ? <div className="tg-coach">🧩 {exercise.instruction}</div> : null}
        <div className="tg-prompt-en">{exercise.prompt}</div>
        <div className="tg-options">
          {exercise.choices.map((c) => (
            <button key={c} className={selected === c ? "selected" : ""} onClick={() => { buzz(6); setSelected(c); }}>{c}</button>
          ))}
        </div>
        <button className="tg-btn tg-btn-primary" disabled={!selected} onClick={() => {
          const correct = selected === exercise.answer;
          onAnswer({ correct, userAnswer: selected, expected: exercise.answer, ...meta });
        }}>Check</button>
      </div>
    );
  }

  if (exercise.type === "convo") {
    return (
      <div className="tg-card lesson-exercise">
        <div className="tg-label">{exercise.title}</div>
        {exercise.instruction ? <div className="tg-meaning">{exercise.instruction}</div> : null}
        <div className="tg-convo">
          {exercise.lines.map((l, i) => (
            <div key={i} className="tg-convo-line">
              <span className="tg-convo-who">{l.who}</span>
              <span className={`tg-convo-pt ${l.pt === "____" ? "gap" : ""}`}>{l.pt === "____" ? "…" : l.pt}</span>
            </div>
          ))}
        </div>
        <div className="tg-options">
          {exercise.choices.map((c) => (
            <button key={c} className={selected === c ? "selected" : ""} onClick={() => { buzz(6); setSelected(c); }}>{c}</button>
          ))}
        </div>
        <button className="tg-btn tg-btn-primary" disabled={!selected} onClick={() => {
          const correct = selected === exercise.answer;
          onAnswer({ correct, userAnswer: selected, expected: exercise.answer, ...meta });
        }}>Check</button>
      </div>
    );
  }

  // blank / missing-word exercise
  const parts = exercise.prompt.split("____");
  return (
    <div className="tg-card lesson-exercise">
      <div className="tg-label">{exercise.title}</div>
      {exercise.translation ? <div className="tg-meaning">"{exercise.translation}"</div> : null}
      <div className="tg-blank-line">
        <span className="tg-blank-ctx">{parts[0]}</span>
        <input
          ref={inputRef}
          className="tg-blank-input"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder="?"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck="false"
          size={Math.max(4, exercise.answer.length + 1)}
        />
        <span className="tg-blank-ctx">{parts[1]}</span>
      </div>
      <AccentKeys onInsert={insertInto(inputRef, typed, setTyped)} />
      <button className="tg-mini" onClick={() => speak(exercise.full)}>{Icons.speaker} Hear full phrase</button>
      <button className="tg-btn tg-btn-primary" disabled={!typed.trim()} onClick={() => submit(typed)}>Check</button>
    </div>
  );
}

const XP_PER_CORRECT = 10;

function LessonRunner({ lesson, onBack, onComplete, onSave, onActivity, reviewPool, skillStats }) {
  const exercises = useRef(makeExercises(lesson, reviewPool, skillStats)).current;
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [streak, setStreak] = useState(0);
  const [retryQueue, setRetryQueue] = useState([]); // missed exercises, re-asked once at the end
  const [missed, setMissed] = useState([]); // base indices answered wrong on the first pass

  const queue = exercises.concat(retryQueue);
  const retrying = idx >= exercises.length;
  const current = queue[idx];

  const handleAnswer = (result) => {
    // distinct patterns: single soft pulse = correct, double knock = wrong
    buzz(result.correct ? 10 : [0, 18, 80, 18]);
    // Speak the correct phrase aloud when the user gets it wrong (skip choice recoveries)
    if (!result.correct && !result.recovered && result.say) speak(result.say);
    setStreak((s) => (result.correct ? s + 1 : 0));
    setFeedback(result);
    if (onActivity) onActivity();
  };

  const next = () => {
    const firstPass = idx < exercises.length;
    const wrong = feedback && !feedback.correct && !feedback.recovered;
    const nextResults = firstPass && feedback ? results.concat(feedback) : results;
    const nextMissed = firstPass && wrong ? missed.concat(idx) : missed;
    setResults(nextResults);
    setMissed(nextMissed);
    setFeedback(null);

    if (idx >= queue.length - 1) {
      // End of the first pass: if anything was missed, re-ask it once more.
      if (retryQueue.length === 0 && nextMissed.length > 0) {
        setRetryQueue(nextMissed.map((i) => exercises[i]));
        setIdx(idx + 1);
        return;
      }
      const correct = nextResults.filter((r) => r.correct).length;
      const score = Math.round((correct / exercises.length) * 100);
      onComplete(lesson, { score, results: nextResults });
      return;
    }
    setIdx((n) => n + 1);
  };

  if (!started) {
    return (
      <div className="tg-screen">
        <button className="tg-back" onClick={onBack}>← Back to lessons</button>
        <div className="tg-lesson-hero">
          <span>{lesson.emoji}</span>
          <h2>{lesson.title}</h2>
          <p>{lesson.mission}</p>
        </div>
        <div className="tg-card">
          <div className="tg-label">Learn this</div>
          <p className="tg-expl">{lesson.teach}</p>
          <div className="tg-coach">💡 {lesson.coachTip}</div>
        </div>
        <div className="tg-card">
          <div className="tg-label">Phrase pack</div>
          {lesson.phrases.map((phrase) => (
            <div key={phrase.pt} className="tg-phrase-row">
              <div><b>{phrase.pt}</b><span>{phrase.en}</span></div>
              <button className="tg-mini round" onClick={() => speak(phrase.pt)} aria-label="Hear phrase">{Icons.speaker}</button>
            </div>
          ))}
          <button className="tg-btn tg-btn-ghost" onClick={() => lesson.phrases.forEach((p) => onSave(p.pt, p.en, "learning", lesson.skillTags))}>Save phrase pack</button>
        </div>
        <button className="tg-btn tg-btn-primary" onClick={() => { buzz(12); setStarted(true); }}>Start playful challenge</button>
      </div>
    );
  }

  return (
    <div className="tg-screen">
      <button className="tg-back" onClick={onBack}>← Exit lesson</button>
      <div className="tg-progress-card compact">
        <div className="tg-progress-top">
          <b>{lesson.emoji} {lesson.title}</b>
          <span>{streak >= 3 ? <span className="tg-streak-badge">🔥 {streak} in a row!</span> : null}{idx + 1}/{queue.length}</span>
        </div>
        <ProgressBar value={((idx + 1) / queue.length) * 100} />
      </div>
      {retrying ? <div className="tg-retry-banner">🔁 Quick recap — let's nail the ones you missed.</div> : null}
      {!retrying && current.callback ? <div className="tg-review-banner">↩️ Review from an earlier lesson</div> : null}
      {!retrying && current.transfer ? <div className="tg-review-banner">🧩 New example — apply what you learned</div> : null}
      <details className="tg-learn-tip">
        <summary>💡 Quick reminder</summary>
        <p>{lesson.teach}</p>
      </details>
      <Exercise key={idx} exercise={current} onAnswer={handleAnswer} />
      {feedback ? (
        <div className={`tg-feedback ${feedback.correct ? "correct" : feedback.recovered ? "recovered" : "incorrect"}`}>
          {feedback.correct && <XpPop key={`xp-${idx}`} amount={XP_PER_CORRECT} />}
          {feedback.correct ? (
            <>
              <b>Boa! 🎉</b>
              {feedback.accentNote
                ? <span>Right! Just mind the accent: <b>{feedback.accentNote}</b></span>
                : <span>{streak >= 3 ? `🔥 ${streak} in a row — you're on fire!` : "That one goes into your confidence bank."}</span>}
            </>
          ) : feedback.recovered ? (
            <>
              <b>Got there! 🎯</b>
              <span>Right answer on the retry. I'll bring this one back for a quick review.</span>
            </>
          ) : (
            <>
              <b>Almost — here's the answer:</b>
              <div className="tg-feedback-compare">
                <div className="tg-feedback-row wrong">
                  <span className="tg-feedback-lbl">You:</span>
                  <span>{feedback.userAnswer}</span>
                </div>
                <div className="tg-feedback-row correct-ans">
                  <span className="tg-feedback-lbl">Answer:</span>
                  <span>{feedback.expected}</span>
                </div>
                <button className="tg-mini" onClick={() => speak(feedback.say || feedback.expected)}>{Icons.speaker} Hear it again</button>
              </div>
            </>
          )}
          {feedback.note ? <div className="tg-feedback-note">💡 {feedback.note}</div> : null}
          {(() => {
            const wrongNow = !feedback.correct && !feedback.recovered && idx < exercises.length;
            const willRetry = retryQueue.length === 0 && (missed.length + (wrongNow ? 1 : 0)) > 0;
            const finishing = idx >= queue.length - 1 && !willRetry;
            return <button className="tg-btn tg-btn-primary" onClick={() => { buzz(10); next(); }}>{finishing ? "See result" : "Next"}</button>;
          })()}
        </div>
      ) : null}
    </div>
  );
}

function LessonResult({ result, onContinue, onReview }) {
  const score = result.score;
  const results = result.results || [];
  return (
    <div className="tg-screen">
      <div className="tg-result-card">
        <div className="tg-hero-emoji">{score >= 80 ? "🎉" : score >= 60 ? "🙂" : "💪"}</div>
        <h2>{score >= 80 ? "Boa! Aula concluída." : "Aula concluída — vamos reforçar."}</h2>
        <div className="tg-score">{score}<small>%</small></div>
        <p>{score >= 80 ? "You’re ready for the next small step." : "I saved the key phrases for review so they come back at the right time."}</p>
        {result.timesDone ? <div className="tg-times-pill">{result.timesDone === 1 ? "First time completed 🎉" : `Completed ${result.timesDone}× 🔁`}</div> : null}
      </div>

      {results.length ? (
        <div className="tg-card">
          <div className="tg-label">Your answers</div>
          <div className="tg-breakdown">
            {results.map((r, i) => (
              <div key={i} className={`tg-breakdown-row ${r.correct ? "ok" : "miss"}`}>
                <span className="tg-breakdown-mark">{r.correct ? "✓" : "✗"}</span>
                <div className="tg-breakdown-body">
                  <div className="tg-breakdown-title">{r.title}</div>
                  <div className="tg-breakdown-pt">{r.review?.pt || r.say}</div>
                  <div className="tg-breakdown-en">{r.review?.en}</div>
                </div>
                <button className="tg-mini round" aria-label="Hear phrase" onClick={() => speak(r.say || r.review?.pt)}>{Icons.speaker}</button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {result.lesson?.teach ? (
        <div className="tg-card">
          <div className="tg-label">Remember this</div>
          <p className="tg-expl">{result.lesson.teach}</p>
        </div>
      ) : null}

      <div className="tg-card">
        <div className="tg-label">What was saved</div>
        <p className="tg-expl">Lesson phrases were added to your review deck. Lower scores mark them as difficult so they appear sooner.</p>
      </div>
      <button className="tg-btn tg-btn-primary" onClick={onContinue}>Continue course</button>
      <button className="tg-btn tg-btn-ghost" onClick={onReview}>Go to review</button>
    </div>
  );
}

export default function LessonsView({ progress, setProgress, onSave, onGoReview, launchLesson, onConsumeLaunch, onActivity }) {
  const [activeLesson, setActiveLesson] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const completed = new Set(progress.completed || []);
  useEffect(() => {
    if (launchLesson) {
      setLastResult(null);
      setActiveLesson(launchLesson);
      onConsumeLaunch?.();
    }
  }, [launchLesson, onConsumeLaunch]);
  const pct = Math.round((completed.size / LESSONS.length) * 100);
  const nextIdx = Math.min(completed.size, LESSONS.length - 1);

  const startLesson = (lesson) => {
    setLastResult(null);
    setActiveLesson(lesson);
  };

  const completeLesson = (lesson, outcome) => {
    const score = outcome.score;
    const timesDone = Number((progress.lessonCounts || {})[lesson.id] || 0) + 1;
    setProgress((current) => {
      const done = current.completed?.includes(lesson.id) ? current.completed : [...(current.completed || []), lesson.id];
      let skillStats = current.skillStats || {};
      outcome.results.forEach((item) => {
        (item.tags || lesson.skillTags || []).forEach((tag) => {
          const cur = skillStats[tag] || { correct: 0, attempts: 0 };
          skillStats = { ...skillStats, [tag]: { correct: cur.correct + (item.correct ? 1 : 0), attempts: cur.attempts + 1 } };
        });
      });
      const counts = current.lessonCounts || {};
      return {
        ...current,
        completed: done,
        activeLessonId: (LESSONS.find((l) => !done.includes(l.id)) || lesson).id,
        lessonScores: { ...(current.lessonScores || {}), [lesson.id]: { score, when: Date.now() } },
        lessonCounts: { ...counts, [lesson.id]: Number(counts[lesson.id] || 0) + 1 },
        skillStats,
        xp: Number(current.xp || 0) + Math.max(40, score),
        lastLessonAt: Date.now(),
      };
    });
    lesson.phrases.forEach((phrase) => onSave(phrase.pt, phrase.en, score < 70 ? "difficult" : "learning", lesson.skillTags));
    setActiveLesson(null);
    setLastResult({ lesson, score, results: outcome.results, timesDone });
  };

  if (activeLesson) {
    // Phrases from other completed lessons, for spaced "callback" review questions.
    const reviewPool = LESSONS
      .filter((l) => completed.has(l.id) && l.id !== activeLesson.id)
      .flatMap((l) => l.phrases.map((p) => ({ pt: p.pt, en: p.en, skillTags: l.skillTags })));
    return <LessonRunner lesson={activeLesson} onBack={() => setActiveLesson(null)} onComplete={completeLesson} onSave={onSave} onActivity={onActivity} reviewPool={reviewPool} skillStats={progress.skillStats || {}} />;
  }

  if (lastResult) {
    return <LessonResult result={lastResult} onContinue={() => setLastResult(null)} onReview={onGoReview} />;
  }

  return (
    <div className="tg-screen">
      <div className="tg-progress-card">
        <div className="tg-progress-top">
          <div><div className="tg-progress-title">A1 Brazilian Portuguese path</div><div className="tg-progress-meta">{completed.size} of {LESSONS.length} lessons complete</div></div>
          <span className="tg-pill open">{pct}%</span>
        </div>
        <ProgressBar value={pct} />
      </div>

      {COURSE_UNITS.map((unit) => (
        <section key={unit.id} className="tg-unit">
          <div className="tg-unit-title"><span>{unit.emoji}</span><div><b>{unit.title}</b><small>{unit.subtitle}</small></div></div>
          {LESSONS.filter((lesson) => lesson.unit === unit.id).map((lesson) => {
            const idx = LESSONS.findIndex((l) => l.id === lesson.id);
            const done = completed.has(lesson.id);
            const unlocked = idx === 0 || completed.has(LESSONS[idx - 1].id) || done;
            const active = idx === nextIdx && !done;
            const score = progress.lessonScores?.[lesson.id]?.score;
            const timesDone = Number(progress.lessonCounts?.[lesson.id] || 0);
            return (
              <div key={lesson.id} className={`tg-lesson-card ${!unlocked ? "locked" : ""} ${active ? "active" : ""}`}>
                <div className="tg-lesson-main">
                  <div className="tg-lesson-emoji">{lesson.emoji}</div>
                  <div className="tg-lesson-info">
                    <div className="tg-lesson-head">
                      <div><div className="tg-lesson-title">{lesson.title}</div><div className="tg-lesson-sub">{lesson.mission} • {lesson.minutes}</div></div>
                      <span className={`tg-pill ${done ? "done" : unlocked ? "open" : "lock"}`}>{done ? "Done" : unlocked ? "Open" : "Locked"}</span>
                    </div>
                    <div className="tg-lesson-tags">{lesson.skillTags.map((tag) => <span key={tag} className="tg-skill">{skillLabel(tag)}</span>)}</div>
                    {score || timesDone ? (
                      <div className="tg-lesson-score">
                        {score ? `Last score: ${score}%` : null}
                        {score && timesDone ? " · " : null}
                        {timesDone ? <span className="tg-times">✓ completed {timesDone}×</span> : null}
                      </div>
                    ) : null}
                    {unlocked ? <div className="tg-lesson-actions"><button className="tg-inline-btn primary" onClick={() => startLesson(lesson)}>{done ? "Practise again" : "Start"}</button><button className="tg-inline-btn" onClick={() => lesson.phrases.forEach((p) => onSave(p.pt, p.en, "learning", lesson.skillTags))}>Save phrases</button></div> : <div className="tg-small-note">Complete the previous lesson to unlock this one.</div>}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
