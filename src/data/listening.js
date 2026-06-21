// Listening-comprehension dialogues (Brazilian Portuguese). The learner hears
// the conversation and answers questions about meaning; the transcript is
// hidden until they choose to reveal it. Questions are in English with English
// answers so the skill being tested is listening, not reading.
export const LISTENING = [
  {
    id: "l-a1-cafe",
    level: "A1",
    emoji: "☕",
    title: "No café",
    lines: [
      { speaker: "Atendente", pt: "Bom dia! O que você vai querer?", en: "Good morning! What would you like?" },
      { speaker: "Cliente", pt: "Bom dia! Eu quero um café com leite, por favor.", en: "Good morning! I'd like a latte, please." },
      { speaker: "Atendente", pt: "Mais alguma coisa?", en: "Anything else?" },
      { speaker: "Cliente", pt: "Sim, um pão de queijo. Quanto é?", en: "Yes, a cheese bread. How much is it?" },
      { speaker: "Atendente", pt: "Sete reais.", en: "Seven reais." },
    ],
    questions: [
      { q: "What does the customer order?", choices: ["A latte and a cheese bread", "Just a coffee", "An orange juice"], answer: "A latte and a cheese bread" },
      { q: "How much is it?", choices: ["Seven reais", "Ten reais", "Seventeen reais"], answer: "Seven reais" },
    ],
  },
  {
    id: "l-a1-direcoes",
    level: "A1",
    emoji: "📍",
    title: "Onde fica a estação?",
    lines: [
      { speaker: "Turista", pt: "Com licença, onde fica a estação?", en: "Excuse me, where is the station?" },
      { speaker: "Local", pt: "Fica perto. Vire à direita e siga em frente.", en: "It's nearby. Turn right and go straight ahead." },
      { speaker: "Turista", pt: "É longe?", en: "Is it far?" },
      { speaker: "Local", pt: "Não, uns cinco minutos a pé.", en: "No, about five minutes on foot." },
      { speaker: "Turista", pt: "Muito obrigado!", en: "Thank you very much!" },
    ],
    questions: [
      { q: "What is the tourist looking for?", choices: ["The station", "The pharmacy", "The hotel"], answer: "The station" },
      { q: "How long does it take to get there?", choices: ["About five minutes on foot", "Half an hour", "One hour"], answer: "About five minutes on foot" },
    ],
  },
  {
    id: "l-a2-planos",
    level: "A2",
    emoji: "📅",
    title: "Fazendo planos",
    lines: [
      { speaker: "Ana", pt: "Oi! Você vai fazer alguma coisa no fim de semana?", en: "Hi! Are you doing anything this weekend?" },
      { speaker: "Beto", pt: "Ainda não sei. Talvez eu vá à praia. E você?", en: "I don't know yet. Maybe I'll go to the beach. And you?" },
      { speaker: "Ana", pt: "Eu vou visitar meus pais no sábado.", en: "I'm going to visit my parents on Saturday." },
      { speaker: "Beto", pt: "Que legal! E no domingo?", en: "Nice! And on Sunday?" },
      { speaker: "Ana", pt: "No domingo eu quero descansar em casa.", en: "On Sunday I want to rest at home." },
    ],
    questions: [
      { q: "What might Beto do at the weekend?", choices: ["Go to the beach", "Visit his parents", "Work"], answer: "Go to the beach" },
      { q: "What will Ana do on Sunday?", choices: ["Rest at home", "Visit her parents", "Go to the beach"], answer: "Rest at home" },
    ],
  },
  {
    id: "l-a2-restaurante",
    level: "A2",
    emoji: "🍽️",
    title: "No restaurante",
    lines: [
      { speaker: "Garçom", pt: "Boa noite! Mesa para quantas pessoas?", en: "Good evening! A table for how many people?" },
      { speaker: "Cliente", pt: "Para duas, por favor.", en: "For two, please." },
      { speaker: "Garçom", pt: "Aqui está o cardápio. Algo para beber?", en: "Here's the menu. Something to drink?" },
      { speaker: "Cliente", pt: "Uma água sem gás e um suco de laranja.", en: "A still water and an orange juice." },
      { speaker: "Garçom", pt: "Já trago.", en: "I'll bring it right away." },
    ],
    questions: [
      { q: "How many people is the table for?", choices: ["Two", "Three", "Four"], answer: "Two" },
      { q: "What do they order to drink?", choices: ["Still water and orange juice", "Two beers", "Coffee"], answer: "Still water and orange juice" },
    ],
  },
  {
    id: "l-b1-hotel",
    level: "B1",
    emoji: "🏨",
    title: "Um problema no hotel",
    lines: [
      { speaker: "Recepção", pt: "Boa tarde, em que posso ajudar?", en: "Good afternoon, how can I help?" },
      { speaker: "Hóspede", pt: "Boa tarde. O ar-condicionado do meu quarto não está funcionando.", en: "Good afternoon. The air conditioning in my room isn't working." },
      { speaker: "Recepção", pt: "Desculpe pelo transtorno. Qual é o número do quarto?", en: "Sorry for the trouble. What's the room number?" },
      { speaker: "Hóspede", pt: "É o 304. Será que dá para resolver hoje?", en: "It's 304. Is it possible to sort it out today?" },
      { speaker: "Recepção", pt: "Claro, vou mandar alguém agora mesmo.", en: "Of course, I'll send someone right away." },
    ],
    questions: [
      { q: "What is the problem?", choices: ["The air conditioning isn't working", "The room is dirty", "There's no hot water"], answer: "The air conditioning isn't working" },
      { q: "What does the receptionist promise?", choices: ["To send someone right away", "To change the room", "To give a refund"], answer: "To send someone right away" },
    ],
  },
  {
    id: "l-b2-trabalho",
    level: "B2",
    emoji: "💼",
    title: "Conversa sobre trabalho",
    lines: [
      { speaker: "Carla", pt: "E aí, como está o novo emprego?", en: "So, how's the new job?" },
      { speaker: "Diego", pt: "Olha, está puxado, mas eu estou gostando.", en: "Well, it's tough, but I'm enjoying it." },
      { speaker: "Carla", pt: "Você não estava pensando em mudar de área?", en: "Weren't you thinking about changing fields?" },
      { speaker: "Diego", pt: "Estava, mas resolvi dar uma chance. Se não der certo, eu repenso.", en: "I was, but I decided to give it a chance. If it doesn't work out, I'll rethink." },
      { speaker: "Carla", pt: "Faz sentido. O importante é tentar.", en: "Makes sense. The important thing is to try." },
    ],
    questions: [
      { q: "How does Diego feel about the new job?", choices: ["It's tough but he's enjoying it", "He hates it", "He finds it boring"], answer: "It's tough but he's enjoying it" },
      { q: "What will Diego do if it doesn't work out?", choices: ["Reconsider / rethink", "Quit immediately", "Move abroad"], answer: "Reconsider / rethink" },
    ],
  },
];
