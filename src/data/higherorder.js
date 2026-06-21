// Higher-order exercises surfaced inside B1/B2 lessons. Two authored types:
// - mistake:    a sentence with one deliberate error; learner taps the wrong
//               word. `wrongWord` is the token to find, `answer` the fix.
// - transform:  rewrite a sentence per an instruction; `answer` is the target.
// Multi-blank cloze is generated automatically from lesson phrases.
export const HIGHER_ORDER = {
  b1: [
    { type: "mistake", wrong: "Se eu tiver tempo, eu viajaria.", wrongWord: "tiver", answer: "Se eu tivesse tempo, eu viajaria.", en: "If I had time, I would travel.", note: "Hypotheticals pair 'se' + imperfect subjunctive (tivesse) with the conditional (viajaria)." },
    { type: "transform", instruction: "Make it polite (use the conditional).", prompt: "Eu quero falar com o gerente.", answer: "Eu gostaria de falar com o gerente.", en: "I'd like to speak with the manager.", note: "'Gostaria' is the polite conditional of 'quero'." },
    { type: "mistake", wrong: "Ela perguntou se eu estou bem.", wrongWord: "estou", answer: "Ela perguntou se eu estava bem.", en: "She asked if I was okay.", note: "Reported speech shifts the tense back: estou → estava." },
    { type: "transform", instruction: "Put into the past (pretérito perfeito).", prompt: "Nós vamos à praia.", answer: "Nós fomos à praia.", en: "We went to the beach.", note: "ir is irregular in the past: vamos → fomos." },
    { type: "mistake", wrong: "As casas é bonita.", wrongWord: "é", answer: "As casas são bonitas.", en: "The houses are beautiful.", note: "Agreement: a plural subject takes 'são' and a plural adjective (bonitas)." },
    { type: "transform", instruction: "Turn into a future plan (ir + infinitive).", prompt: "Eu estudo português.", answer: "Eu vou estudar português.", en: "I'm going to study Portuguese.", note: "Near future = present of ir + infinitive." },
    { type: "mistake", wrong: "Embora é difícil, eu vou tentar.", wrongWord: "é", answer: "Embora seja difícil, eu vou tentar.", en: "Although it's hard, I'll try.", note: "'Embora' always takes the subjunctive: seja." },
    { type: "transform", instruction: "Make it 'not yet'.", prompt: "Eu já terminei.", answer: "Eu ainda não terminei.", en: "I haven't finished yet.", note: "já (already) ↔ ainda não (not yet)." },
  ],
  b2: [
    { type: "mistake", wrong: "Eu vou a praia amanhã.", wrongWord: "a", answer: "Eu vou à praia amanhã.", en: "I'm going to the beach tomorrow.", note: "a + a (feminine) = à (crase): vou à praia." },
    { type: "transform", instruction: "Make it passive.", prompt: "Ele escreveu o livro.", answer: "O livro foi escrito por ele.", en: "The book was written by him.", note: "Passive = ser + particípio + por: foi escrito por ele." },
    { type: "mistake", wrong: "Obrigado para tudo.", wrongWord: "para", answer: "Obrigado por tudo.", en: "Thanks for everything.", note: "'Thanks for' uses por, not para: obrigado por tudo." },
    { type: "transform", instruction: "Make it more formal.", prompt: "Quero pedir uma informação.", answer: "Gostaria de solicitar uma informação.", en: "I would like to request some information.", note: "Formal register: gostaria de + solicitar (vs quero/pedir)." },
    { type: "mistake", wrong: "Se eu soubesse, eu teria avisar você.", wrongWord: "avisar", answer: "Se eu soubesse, eu teria avisado você.", en: "If I had known, I'd have warned you.", note: "Conditional perfect = teria + particípio (avisado), not the infinitive." },
    { type: "transform", instruction: "Rewrite as a hypothetical (se + imperfect subjunctive).", prompt: "Se eu tiver tempo, eu vou.", answer: "Se eu tivesse tempo, eu iria.", en: "If I had time, I would go.", note: "Unreal condition: tivesse + iria (conditional)." },
    { type: "mistake", wrong: "Eu lhe vi ontem.", wrongWord: "lhe", answer: "Eu o vi ontem.", en: "I saw him yesterday.", note: "Direct object uses o/a; 'lhe' is the indirect object (to him/her)." },
    { type: "transform", instruction: "Join with 'embora' (although).", prompt: "É difícil. Eu vou tentar.", answer: "Embora seja difícil, eu vou tentar.", en: "Although it's hard, I'll try.", note: "'Embora' + subjunctive (seja) links the two ideas." },
  ],
  c1: [
    { type: "mistake", wrong: "Ele assistiu o jogo ontem.", wrongWord: "o", answer: "Ele assistiu ao jogo ontem.", en: "He watched the game yesterday.", note: "assistir (to watch) requires 'a': assistir ao jogo." },
    { type: "transform", instruction: "Make it passive with 'se'.", prompt: "Vendem casas aqui.", answer: "Vendem-se casas aqui.", en: "Houses are sold here.", note: "Passive 'se' with enclisis: vendem-se casas." },
    { type: "mistake", wrong: "Prefiro chá do que café.", wrongWord: "do", answer: "Prefiro chá a café.", en: "I prefer tea to coffee.", note: "preferir takes 'a': prefiro A a B, never 'do que'." },
    { type: "transform", instruction: "Rewrite formally (use 'em virtude de').", prompt: "Por causa da chuva, cancelamos.", answer: "Em virtude da chuva, cancelamos.", en: "Due to the rain, we cancelled.", note: "'em virtude de' is the formal 'because of'." },
    { type: "mistake", wrong: "Refiro-me a aquilo.", wrongWord: "a", answer: "Refiro-me àquilo.", en: "I'm referring to that.", note: "a + aquilo = àquilo (crase)." },
    { type: "transform", instruction: "Soften it (hedge the claim).", prompt: "Isso é arriscado.", answer: "Eu diria que isso é arriscado.", en: "I'd say that's risky.", note: "'Eu diria que' hedges a strong statement." },
  ],
};
