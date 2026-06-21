// Graded reading passages (Brazilian Portuguese), ordered by level.
// Each line has a translation for tap-to-reveal; questions test comprehension.
export const READINGS = [
  {
    id: "r-a1-cafe",
    level: "A1",
    emoji: "☕",
    title: "Bom dia no café",
    sentences: [
      { pt: "De manhã, eu gosto de tomar um café.", en: "In the morning, I like to have a coffee." },
      { pt: "Eu vou a uma padaria perto de casa.", en: "I go to a bakery near home." },
      { pt: "Eu peço um café com leite e um pão de queijo.", en: "I order a latte and a cheese bread." },
      { pt: "A atendente é muito simpática.", en: "The server is very friendly." },
      { pt: "Depois, eu vou trabalhar a pé.", en: "Then, I walk to work." },
    ],
    questions: [
      { q: "What does the person order?", choices: ["Um café com leite e um pão de queijo", "Um suco de laranja", "Só uma água"], answer: "Um café com leite e um pão de queijo" },
      { q: "How does the person get to work?", choices: ["A pé (on foot)", "De ônibus", "De carro"], answer: "A pé (on foot)" },
    ],
  },
  {
    id: "r-a1-familia",
    level: "A1",
    emoji: "🏠",
    title: "Minha família",
    sentences: [
      { pt: "Minha família é pequena.", en: "My family is small." },
      { pt: "Eu moro com a minha esposa e o meu filho.", en: "I live with my wife and my son." },
      { pt: "Meu filho tem cinco anos.", en: "My son is five years old." },
      { pt: "Nos fins de semana, a gente vai ao parque.", en: "On weekends, we go to the park." },
      { pt: "Eu gosto muito de passar tempo com eles.", en: "I really like spending time with them." },
    ],
    questions: [
      { q: "How old is the son?", choices: ["Cinco anos", "Três anos", "Dez anos"], answer: "Cinco anos" },
      { q: "What do they do on weekends?", choices: ["Vão ao parque", "Vão à praia", "Ficam em casa"], answer: "Vão ao parque" },
    ],
  },
  {
    id: "r-a2-rio",
    level: "A2",
    emoji: "✈️",
    title: "A viagem ao Rio",
    sentences: [
      { pt: "No ano passado, eu viajei para o Rio de Janeiro.", en: "Last year, I travelled to Rio de Janeiro." },
      { pt: "Eu fiquei em um hotel perto da praia de Copacabana.", en: "I stayed in a hotel near Copacabana beach." },
      { pt: "Todos os dias, eu acordava cedo para ver o nascer do sol.", en: "Every day, I woke up early to watch the sunrise." },
      { pt: "Eu comi muita comida boa e conheci pessoas legais.", en: "I ate a lot of good food and met nice people." },
      { pt: "Foi uma das melhores viagens da minha vida.", en: "It was one of the best trips of my life." },
    ],
    questions: [
      { q: "Where did the person stay?", choices: ["Em um hotel perto da praia", "Na casa de um amigo", "Em um apartamento"], answer: "Em um hotel perto da praia" },
      { q: "Why did they wake up early?", choices: ["Para ver o nascer do sol", "Para trabalhar", "Para correr na praia"], answer: "Para ver o nascer do sol" },
    ],
  },
  {
    id: "r-b1-planos",
    level: "B1",
    emoji: "🔄",
    title: "Mudança de planos",
    sentences: [
      { pt: "Eu tinha planejado viajar no feriado, mas tudo mudou.", en: "I had planned to travel over the holiday, but everything changed." },
      { pt: "No dia anterior, eu comecei a me sentir mal.", en: "The day before, I started to feel unwell." },
      { pt: "Se eu tivesse ido, provavelmente teria piorado.", en: "If I had gone, I probably would have gotten worse." },
      { pt: "Então, eu decidi ficar em casa e descansar.", en: "So, I decided to stay home and rest." },
      { pt: "No fim das contas, foi a melhor decisão.", en: "In the end, it was the best decision." },
    ],
    questions: [
      { q: "Why did the plans change?", choices: ["A pessoa começou a se sentir mal", "Choveu muito", "O voo foi cancelado"], answer: "A pessoa começou a se sentir mal" },
      { q: "What did the person decide to do?", choices: ["Ficar em casa e descansar", "Viajar mesmo assim", "Ir ao hospital"], answer: "Ficar em casa e descansar" },
    ],
  },
  {
    id: "r-b1-aprender",
    level: "B1",
    emoji: "📚",
    title: "Aprendendo português",
    sentences: [
      { pt: "Faz um ano que eu estudo português todo dia.", en: "I've been studying Portuguese every day for a year." },
      { pt: "No começo, eu tinha medo de falar e errar.", en: "At first, I was afraid to speak and make mistakes." },
      { pt: "Com o tempo, percebi que os erros fazem parte do processo.", en: "Over time, I realised that mistakes are part of the process." },
      { pt: "Hoje, eu consigo ter conversas sobre vários assuntos.", en: "Today, I can have conversations about various topics." },
      { pt: "Espero que um dia eu seja fluente.", en: "I hope that one day I'll be fluent." },
    ],
    questions: [
      { q: "How long has the person been studying?", choices: ["Faz um ano", "Faz um mês", "Faz cinco anos"], answer: "Faz um ano" },
      { q: "What did they realise over time?", choices: ["Que os erros fazem parte do processo", "Que é impossível aprender", "Que não precisa praticar"], answer: "Que os erros fazem parte do processo" },
    ],
  },
  {
    id: "r-b2-equilibrio",
    level: "B2",
    emoji: "⚖️",
    title: "Trabalho e equilíbrio",
    sentences: [
      { pt: "Durante anos, eu vivi para trabalhar, sem tempo para mais nada.", en: "For years, I lived to work, with no time for anything else." },
      { pt: "Embora eu ganhasse bem, eu não me sentia realizado.", en: "Although I earned well, I didn't feel fulfilled." },
      { pt: "Foi então que decidi mudar a minha rotina.", en: "That's when I decided to change my routine." },
      { pt: "Passei a reservar um tempo para a família e para os meus hobbies.", en: "I started setting aside time for family and my hobbies." },
      { pt: "Hoje, por mais ocupado que eu esteja, eu priorizo o que importa.", en: "Today, however busy I am, I prioritise what matters." },
    ],
    questions: [
      { q: "How did the person feel despite earning well?", choices: ["Não se sentia realizado", "Estava muito feliz", "Queria trabalhar mais"], answer: "Não se sentia realizado" },
      { q: "What does the person prioritise now?", choices: ["O que importa (família e hobbies)", "Apenas o trabalho", "Ganhar mais dinheiro"], answer: "O que importa (família e hobbies)" },
    ],
  },
];
