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
  {
    id: "l-a1-frutas",
    level: "A1",
    emoji: "🍎",
    title: "Comprando frutas",
    lines: [
      { speaker: "Feirante", pt: "Bom dia! O que vai querer hoje?", en: "Good morning! What would you like today?" },
      { speaker: "Cliente", pt: "Bom dia! Quanto custa o quilo de maçã?", en: "Good morning! How much is a kilo of apples?" },
      { speaker: "Feirante", pt: "Seis reais o quilo.", en: "Six reais a kilo." },
      { speaker: "Cliente", pt: "Então me vê meio quilo, por favor.", en: "Then give me half a kilo, please." },
      { speaker: "Feirante", pt: "Saindo! Mais alguma coisa?", en: "Coming up! Anything else?" },
    ],
    questions: [
      { q: "What fruit is the customer buying?", choices: ["Apples", "Bananas", "Oranges"], answer: "Apples" },
      { q: "How much do they buy?", choices: ["Half a kilo", "One kilo", "Two kilos"], answer: "Half a kilo" },
    ],
  },
  {
    id: "l-a2-consulta",
    level: "A2",
    emoji: "📞",
    title: "Marcando uma consulta",
    lines: [
      { speaker: "Recepção", pt: "Clínica Bom Viver, bom dia.", en: "Bom Viver Clinic, good morning." },
      { speaker: "Paciente", pt: "Bom dia! Eu gostaria de marcar uma consulta.", en: "Good morning! I'd like to book an appointment." },
      { speaker: "Recepção", pt: "Claro. Pode ser na quinta de manhã?", en: "Of course. Can it be Thursday morning?" },
      { speaker: "Paciente", pt: "Quinta de manhã é perfeito.", en: "Thursday morning is perfect." },
      { speaker: "Recepção", pt: "Anotado. Às dez horas, então.", en: "Noted. Ten o'clock, then." },
    ],
    questions: [
      { q: "What is the patient doing?", choices: ["Booking an appointment", "Cancelling a visit", "Asking for a price"], answer: "Booking an appointment" },
      { q: "When is the appointment?", choices: ["Thursday at ten", "Friday morning", "Thursday at two"], answer: "Thursday at ten" },
    ],
  },
  {
    id: "l-a2-roupas",
    level: "A2",
    emoji: "👕",
    title: "Na loja de roupas",
    lines: [
      { speaker: "Vendedor", pt: "Posso ajudar? Procura alguma coisa?", en: "Can I help? Are you looking for something?" },
      { speaker: "Cliente", pt: "Sim, uma camiseta azul, tamanho médio.", en: "Yes, a blue t-shirt, medium size." },
      { speaker: "Vendedor", pt: "Temos esta aqui. Quer experimentar?", en: "We have this one. Would you like to try it on?" },
      { speaker: "Cliente", pt: "Quero, sim. Onde fica o provador?", en: "Yes, I do. Where's the fitting room?" },
      { speaker: "Vendedor", pt: "Ali no fundo, à direita.", en: "Over there at the back, on the right." },
    ],
    questions: [
      { q: "What is the customer looking for?", choices: ["A blue t-shirt, medium", "A red jacket, large", "Blue jeans, small"], answer: "A blue t-shirt, medium" },
      { q: "Where is the fitting room?", choices: ["At the back, on the right", "By the entrance", "Upstairs"], answer: "At the back, on the right" },
    ],
  },
  {
    id: "l-b1-reclamacao",
    level: "B1",
    emoji: "🛠️",
    title: "Uma reclamação educada",
    lines: [
      { speaker: "Cliente", pt: "Boa tarde. Comprei este fone ontem e já parou de funcionar.", en: "Good afternoon. I bought these headphones yesterday and they've already stopped working." },
      { speaker: "Loja", pt: "Sinto muito pelo transtorno. Você tem a nota fiscal?", en: "I'm sorry for the inconvenience. Do you have the receipt?" },
      { speaker: "Cliente", pt: "Tenho, aqui está. Eu gostaria de trocar, se possível.", en: "Yes, here it is. I'd like to exchange it, if possible." },
      { speaker: "Loja", pt: "Sem problema. Pode escolher outro do mesmo valor.", en: "No problem. You can choose another of the same value." },
      { speaker: "Cliente", pt: "Ótimo, muito obrigado pela compreensão.", en: "Great, thank you for understanding." },
    ],
    questions: [
      { q: "What's wrong?", choices: ["The headphones stopped working", "They were too expensive", "The wrong colour came"], answer: "The headphones stopped working" },
      { q: "What does the shop offer?", choices: ["An exchange for the same value", "A full cash refund", "A repair in a week"], answer: "An exchange for the same value" },
    ],
  },
  {
    id: "l-b2-entrevista",
    level: "B2",
    emoji: "🧑‍💼",
    title: "Entrevista de emprego",
    lines: [
      { speaker: "Entrevistador", pt: "Por que você quer trabalhar conosco?", en: "Why do you want to work with us?" },
      { speaker: "Candidato", pt: "Admiro o trabalho da empresa e quero crescer na área.", en: "I admire the company's work and want to grow in the field." },
      { speaker: "Entrevistador", pt: "E qual seria o seu maior ponto fraco?", en: "And what would be your biggest weakness?" },
      { speaker: "Candidato", pt: "Às vezes sou perfeccionista, mas estou trabalhando nisso.", en: "Sometimes I'm a perfectionist, but I'm working on it." },
      { speaker: "Entrevistador", pt: "Ótimo. Entraremos em contato em breve.", en: "Great. We'll be in touch soon." },
    ],
    questions: [
      { q: "Why does the candidate want the job?", choices: ["To grow in the field", "For a shorter commute", "For the free coffee"], answer: "To grow in the field" },
      { q: "What weakness do they mention?", choices: ["Being a perfectionist", "Being late", "Being shy"], answer: "Being a perfectionist" },
    ],
  },
  {
    id: "l-b2-discordar",
    level: "B2",
    emoji: "💭",
    title: "Discordando com respeito",
    lines: [
      { speaker: "Rafa", pt: "Eu acho que a cidade é sempre melhor que o interior.", en: "I think the city is always better than the countryside." },
      { speaker: "Bia", pt: "Entendo seu ponto, mas não concordo totalmente.", en: "I understand your point, but I don't fully agree." },
      { speaker: "Rafa", pt: "Por quê? Na cidade tem tudo por perto.", en: "Why? In the city everything's nearby." },
      { speaker: "Bia", pt: "Sim, mas o interior é mais tranquilo e barato.", en: "Yes, but the countryside is calmer and cheaper." },
      { speaker: "Rafa", pt: "Nisso você tem razão, confesso.", en: "On that you're right, I admit." },
    ],
    questions: [
      { q: "What does Bia value about the countryside?", choices: ["Calmer and cheaper", "More jobs", "Better nightlife"], answer: "Calmer and cheaper" },
      { q: "How does Rafa respond at the end?", choices: ["He admits she has a point", "He gets angry", "He changes the subject"], answer: "He admits she has a point" },
    ],
  },
  {
    id: "l-c1-acordo",
    level: "C1",
    emoji: "🤝",
    title: "Negociando um acordo",
    lines: [
      { speaker: "Fornecedor", pt: "Tendo em vista o volume, posso oferecer cinco por cento de desconto.", en: "Given the volume, I can offer five percent off." },
      { speaker: "Comprador", pt: "Agradeço a proposta, mas esperava algo mais competitivo.", en: "I appreciate the offer, but I was expecting something more competitive." },
      { speaker: "Fornecedor", pt: "Caso fechemos hoje, eu chegaria a oito por cento.", en: "Should we close today, I'd go to eight percent." },
      { speaker: "Comprador", pt: "Nesse caso, creio que podemos chegar a um acordo.", en: "In that case, I believe we can reach an agreement." },
      { speaker: "Fornecedor", pt: "Excelente. Formalizo a proposta ainda hoje.", en: "Excellent. I'll formalise the offer today." },
    ],
    questions: [
      { q: "What discount do they finally settle near?", choices: ["Eight percent", "Five percent", "Twenty percent"], answer: "Eight percent" },
      { q: "What condition did the supplier set?", choices: ["Closing the deal today", "Paying in cash", "A bigger order next year"], answer: "Closing the deal today" },
    ],
  },
];
