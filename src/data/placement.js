// Placement questions, several per CEFR level, used by the adaptive placement
// quiz to RECOMMEND a starting level. It never changes the learner's progress.
export const PLACEMENT_LEVELS = ["A1", "A2", "B1", "B2", "C1"];

export const PLACEMENT = [
  // A1
  { level: "A1", prompt: "What does “Oi, tudo bem?” mean?", choices: ["Hi, how are you?", "Where is it?", "How much is it?"], answer: "Hi, how are you?" },
  { level: "A1", prompt: "Choose: “I want a coffee, please.”", choices: ["Eu quero um café, por favor.", "Eu tenho um café, por favor.", "Eu vou um café, por favor."], answer: "Eu quero um café, por favor." },
  { level: "A1", prompt: "What does “Obrigado” mean?", choices: ["Thank you", "Please", "Sorry"], answer: "Thank you" },
  { level: "A1", prompt: "Choose: “Where is the bathroom?”", choices: ["Onde fica o banheiro?", "Quanto custa o banheiro?", "Quero o banheiro."], answer: "Onde fica o banheiro?" },
  // A2
  { level: "A2", prompt: "Past tense — “Yesterday I ___ to the beach.”", choices: ["Ontem eu fui à praia.", "Ontem eu vou à praia.", "Ontem eu vado à praia."], answer: "Ontem eu fui à praia." },
  { level: "A2", prompt: "Choose: “I'm hungry.”", choices: ["Estou com fome.", "Sou com fome.", "Estou comer."], answer: "Estou com fome." },
  { level: "A2", prompt: "Near future — “Tomorrow I'm going to work.”", choices: ["Amanhã eu vou trabalhar.", "Amanhã eu trabalhei.", "Amanhã eu trabalho ontem."], answer: "Amanhã eu vou trabalhar." },
  { level: "A2", prompt: "Comparative — “This is better than that.”", choices: ["Este é melhor do que aquele.", "Este é mais bom do que aquele.", "Este é o bom que aquele."], answer: "Este é melhor do que aquele." },
  // B1
  { level: "B1", prompt: "Complete: “If I ___ time, I would travel.”", choices: ["Se eu tivesse tempo, eu viajaria.", "Se eu tenho tempo, eu viajaria.", "Se eu tive tempo, eu viajaria."], answer: "Se eu tivesse tempo, eu viajaria." },
  { level: "B1", prompt: "Choose the polite request:", choices: ["Você poderia me ajudar?", "Você ajuda?", "Ajuda eu!"], answer: "Você poderia me ajudar?" },
  { level: "B1", prompt: "Reported speech — “She said she was going to arrive late.”", choices: ["Ela disse que ia chegar tarde.", "Ela disse que vai chegar tarde ontem.", "Ela disse para chegar tarde."], answer: "Ela disse que ia chegar tarde." },
  { level: "B1", prompt: "Future subjunctive — “When I have time, I'll travel.”", choices: ["Quando eu tiver tempo, eu viajo.", "Quando eu tenho tempo, eu viajo.", "Quando eu terei tempo, eu viajo."], answer: "Quando eu tiver tempo, eu viajo." },
  // B2
  { level: "B2", prompt: "Which is correct (crase)?", choices: ["Vou à praia amanhã.", "Vou a praia amanhã.", "Vou na a praia amanhã."], answer: "Vou à praia amanhã." },
  { level: "B2", prompt: "Make it passive — “The book was written by him.”", choices: ["O livro foi escrito por ele.", "O livro escreveu por ele.", "O livro é escrever por ele."], answer: "O livro foi escrito por ele." },
  { level: "B2", prompt: "por or para — “Thanks for everything.”", choices: ["Obrigado por tudo.", "Obrigado para tudo.", "Obrigado de tudo."], answer: "Obrigado por tudo." },
  { level: "B2", prompt: "Subjunctive trigger — “Although it's hard…”", choices: ["Embora seja difícil…", "Embora é difícil…", "Embora será difícil…"], answer: "Embora seja difícil…" },
  // C1
  { level: "C1", prompt: "Which is correct (verb regency)?", choices: ["Ele assistiu ao jogo.", "Ele assistiu o jogo.", "Ele assistiu no jogo."], answer: "Ele assistiu ao jogo." },
  { level: "C1", prompt: "Choose the most formal:", choices: ["Venho por meio desta solicitar uma reunião.", "Quero pedir uma reunião.", "Tô querendo marcar uma reunião."], answer: "Venho por meio desta solicitar uma reunião." },
  { level: "C1", prompt: "Choose correct — “I prefer tea to coffee.”", choices: ["Prefiro chá a café.", "Prefiro chá do que café.", "Prefiro chá que café."], answer: "Prefiro chá a café." },
  { level: "C1", prompt: "Pluperfect — “When I arrived, he had already left.”", choices: ["Quando cheguei, ele já tinha saído.", "Quando cheguei, ele já saiu.", "Quando cheguei, ele já sai."], answer: "Quando cheguei, ele já tinha saído." },
];

// Recommend a starting level from the adaptive quiz history: the highest level
// at which an answer was correct (the staircase self-gates harder questions).
export function recommendFromHistory(history) {
  let recIdx = -1;
  for (const h of history || []) {
    if (h && h.correct) recIdx = Math.max(recIdx, PLACEMENT_LEVELS.indexOf(h.level));
  }
  return PLACEMENT_LEVELS[recIdx] || "A1";
}
