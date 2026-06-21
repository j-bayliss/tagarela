// "Apply the rule" transfer items, keyed by lesson id. Each tests the lesson's
// grammar point on a FRESH example (not in the phrase pack), so the learner
// has to generalise the pattern rather than memorise the taught sentences.
// Only lessons with a clear, transferable rule have an item.
export const TRANSFER = {
  // ---- A1 ----
  "a1-03": { instruction: "A woman is speaking — pick the right thank-you.", prompt: "(Ana:) ____", choices: ["Obrigada", "Obrigado"], answer: "Obrigada", note: "Women say obrigada; men say obrigado — it agrees with the speaker.", say: "Obrigada", en: "Thank you." },
  "a1-10": { instruction: "Pick the right article.", prompt: "____ água, por favor.", choices: ["Uma", "Um"], answer: "Uma", note: "Água is feminine, so it takes uma.", say: "Uma água, por favor.", en: "A water, please." },
  "a1-13": { instruction: "Say it without milk.", prompt: "um café ____ leite", choices: ["sem", "com"], answer: "sem", note: "sem = without, com = with.", say: "um café sem leite", en: "a coffee without milk" },
  "a1-14": { instruction: "Complete: I like tea.", prompt: "Eu gosto ____ chá.", choices: ["de", "a"], answer: "de", note: "gostar always takes de: gosto de chá.", say: "Eu gosto de chá.", en: "I like tea." },
  "a1-25": { instruction: "Pick 'my' for a feminine noun.", prompt: "____ casa é grande.", choices: ["Minha", "Meu"], answer: "Minha", note: "minha + feminine noun; meu + masculine.", say: "Minha casa é grande.", en: "My house is big." },
  "a1-28": { instruction: "Say 'I'm going to travel'.", prompt: "Eu ____ viajar.", choices: ["vou", "vai"], answer: "vou", note: "Near future: eu vou, você/ele vai + infinitive.", say: "Eu vou viajar.", en: "I'm going to travel." },
  "a1-29": { instruction: "Say 'I am happy' (right now).", prompt: "Eu ____ feliz.", choices: ["estou", "sou"], answer: "estou", note: "Use estar for temporary states: estou feliz.", say: "Eu estou feliz.", en: "I'm happy." },

  // ---- Beginner gaps (numbers, dates, time) ----
  "a1-num2": { instruction: "Join the number correctly (45).", prompt: "Custa quarenta ____ cinco reais.", choices: ["e", "de"], answer: "e", note: "Join tens and units with 'e': quarenta e cinco.", say: "Custa quarenta e cinco reais.", en: "It costs forty-five reais." },
  "a1-dates": { instruction: "Say 'on Saturday'.", prompt: "Vejo você ____ sábado.", choices: ["no", "em"], answer: "no", note: "On a specific day uses no/na: no sábado, na segunda.", say: "Vejo você no sábado.", en: "See you on Saturday." },
  "a1-time2": { instruction: "One o'clock — pick the verb.", prompt: "____ uma hora.", choices: ["É", "São"], answer: "É", note: "One o'clock is singular: É uma hora; other hours use São.", say: "É uma hora.", en: "It's one o'clock." },

  // ---- Bridge (present tense, ser/estar) ----
  "bridge-01": { instruction: "Conjugate falar for 'nós'.", prompt: "Nós ____ português.", choices: ["falamos", "falam"], answer: "falamos", note: "Regular -ar, nós form: -amos (falamos).", say: "Nós falamos português.", en: "We speak Portuguese." },
  "bridge-02": { instruction: "Conjugate comer for 'eu'.", prompt: "Eu ____ às oito.", choices: ["como", "come"], answer: "como", note: "Regular -er, eu form: -o (como).", say: "Eu como às oito.", en: "I eat at eight." },
  "bridge-03": { instruction: "ser or estar? (origin)", prompt: "Eu ____ de Londres.", choices: ["sou", "estou"], answer: "sou", note: "Origin/identity uses ser: sou de Londres.", say: "Eu sou de Londres.", en: "I'm from London." },
  "bridge-04": { instruction: "Conjugate ter for 'eu'.", prompt: "Eu ____ tempo.", choices: ["tenho", "tem"], answer: "tenho", note: "ter is irregular: eu tenho, você/ele tem.", say: "Eu tenho tempo.", en: "I have time." },

  // ---- A2 ----
  "a2-01": { instruction: "Put falar in the past (eu).", prompt: "Ontem eu ____ com ele.", choices: ["falei", "falo"], answer: "falei", note: "Regular -ar past, eu form: -ei (falei).", say: "Ontem eu falei com ele.", en: "Yesterday I spoke with him." },
  "a2-03": { instruction: "A past habit: 'I used to play'.", prompt: "Eu ____ futebol todo dia.", choices: ["jogava", "joguei"], answer: "jogava", note: "Imperfect for repeated past habits: jogava.", say: "Eu jogava futebol todo dia.", en: "I used to play football every day." },
  "a2-05": { instruction: "Say 'I'm hungry'.", prompt: "Eu estou ____ fome.", choices: ["com", "de"], answer: "com", note: "estar com + noun for states: estou com fome.", say: "Eu estou com fome.", en: "I'm hungry." },
  "a2-07": { instruction: "Say 'we are going to eat'.", prompt: "Nós ____ comer.", choices: ["vamos", "fomos"], answer: "vamos", note: "Near future: vamos + infinitive (fomos is the past).", say: "Nós vamos comer.", en: "We're going to eat." },
  "a2-08": { instruction: "Say 'I think it's good'.", prompt: "Eu ____ que é bom.", choices: ["acho", "quero"], answer: "acho", note: "achar que = to think that.", say: "Eu acho que é bom.", en: "I think it's good." },
  "a2-09": { instruction: "Say 'better than'.", prompt: "Este é ____ do que aquele.", choices: ["melhor", "mais bom"], answer: "melhor", note: "bom becomes melhor — never 'mais bom'.", say: "Este é melhor do que aquele.", en: "This is better than that one." },
  "a2-10": { instruction: "Make it polite: 'I'd like a coffee'.", prompt: "Eu ____ um café.", choices: ["gostaria de", "quero"], answer: "gostaria de", note: "gostaria de = polite 'I would like'.", say: "Eu gostaria de um café.", en: "I'd like a coffee." },
};
