// Placement quiz — multiple-choice questions ordered easy → hard, two per
// CEFR level. Used only to RECOMMEND a starting level; it never changes the
// learner's progress.
export const PLACEMENT = [
  // A1
  { level: "A1", prompt: "What does “Oi, tudo bem?” mean?", choices: ["Hi, how are you?", "Where is it?", "How much is it?"], answer: "Hi, how are you?" },
  { level: "A1", prompt: "Choose: “I want a coffee, please.”", choices: ["Eu quero um café, por favor.", "Eu tenho um café, por favor.", "Eu vou um café, por favor."], answer: "Eu quero um café, por favor." },
  // A2
  { level: "A2", prompt: "Past tense — “Yesterday I ___ to the beach.”", choices: ["Ontem eu fui à praia.", "Ontem eu vou à praia.", "Ontem eu vado à praia."], answer: "Ontem eu fui à praia." },
  { level: "A2", prompt: "Choose: “I'm hungry.”", choices: ["Estou com fome.", "Sou com fome.", "Estou comer."], answer: "Estou com fome." },
  // B1
  { level: "B1", prompt: "Complete: “If I ___ time, I would travel.”", choices: ["Se eu tivesse tempo, eu viajaria.", "Se eu tenho tempo, eu viajaria.", "Se eu tive tempo, eu viajaria."], answer: "Se eu tivesse tempo, eu viajaria." },
  { level: "B1", prompt: "Choose the polite request:", choices: ["Você poderia me ajudar?", "Você ajuda?", "Ajuda eu!"], answer: "Você poderia me ajudar?" },
  // B2
  { level: "B2", prompt: "Which is correct (crase)?", choices: ["Vou à praia amanhã.", "Vou a praia amanhã.", "Vou na a praia amanhã."], answer: "Vou à praia amanhã." },
  { level: "B2", prompt: "Make it passive: “The book was written by him.”", choices: ["O livro foi escrito por ele.", "O livro escreveu por ele.", "O livro é escrever por ele."], answer: "O livro foi escrito por ele." },
  // C1
  { level: "C1", prompt: "Which is correct (verb regency)?", choices: ["Ele assistiu ao jogo.", "Ele assistiu o jogo.", "Ele assistiu no jogo."], answer: "Ele assistiu ao jogo." },
  { level: "C1", prompt: "Choose the most formal:", choices: ["Venho por meio desta solicitar uma reunião.", "Quero pedir uma reunião.", "Tô querendo marcar uma reunião."], answer: "Venho por meio desta solicitar uma reunião." },
];

// Map a score to a recommended starting level.
export function recommendLevel(correct, total) {
  if (correct <= 2) return "A1";
  if (correct <= 4) return "A2";
  if (correct <= 6) return "B1";
  if (correct <= 8) return "B2";
  return "C1";
}
