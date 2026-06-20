export const COURSE_UNITS = [
  { id: "start", title: "Começo esperto", subtitle: "Sound friendly from day one.", emoji: "👋" },
  { id: "cafe", title: "Café e comida", subtitle: "Order, ask and survive menus.", emoji: "☕" },
  { id: "city", title: "Pela cidade", subtitle: "Directions, transport and useful questions.", emoji: "🚌" },
  { id: "people", title: "Pessoas e planos", subtitle: "Talk about yourself, family and daily life.", emoji: "💬" },
  { id: "a2-past", title: "Histórias e passado", subtitle: "A2 · Talk about what happened.", emoji: "📖" },
  { id: "a2-future", title: "Opiniões e futuro", subtitle: "A2 · Plans, opinions and richer chat.", emoji: "🔮" },
];

// `teach` is a longer grammar/learning note shown on the lesson intro and result.
// It defaults to `rule` so every lesson always has something to teach.
const mk = (id, unit, emoji, title, mission, focus, rule, coachTip, skillTags, phrases, teach) => ({
  id,
  unit,
  emoji,
  title,
  mission,
  goal: focus,
  minutes: "4–6 min",
  rule,
  coachTip,
  skillTags,
  phrases,
  teach: teach || rule,
});

export const LESSONS = [
  mk("a1-01", "start", "👋", "Oi, tudo bem?", "Greet someone without freezing.", "Greetings + polite rhythm", "Use “oi” for casual hello and “tudo bem?” to ask how someone is.", "Brazilian Portuguese is warm. A smile in your voice matters more than perfect grammar.", ["greetings", "conversation"], [
    { pt: "Oi, tudo bem?", en: "Hi, how are you?" },
    { pt: "Tudo bem, obrigado.", en: "I'm fine, thank you." },
    { pt: "E você?", en: "And you?" },
    { pt: "Prazer em conhecer você.", en: "Nice to meet you." },
  ]),
  mk("a1-02", "start", "🙂", "Meu nome é...", "Introduce yourself in one breath.", "Names + simple identity", "“Meu nome é...” is safe and clear. “Eu sou...” also works for your name or role.", "Say your name slowly. Portuguese vowels are clean and open.", ["greetings", "identity"], [
    { pt: "Meu nome é Jack.", en: "My name is Jack." },
    { pt: "Eu sou da Inglaterra.", en: "I am from England." },
    { pt: "Eu moro em Oslo.", en: "I live in Oslo." },
    { pt: "Eu estou aprendendo português.", en: "I am learning Portuguese." },
  ]),
  mk("a1-03", "start", "🙏", "Por favor e obrigado", "Sound polite in shops, cafés and messages.", "Polite phrases", "Use “por favor” for please. Men usually say “obrigado”; women usually say “obrigada”.", "Politeness gets you far. Add “por favor” at the end of requests.", ["politeness", "gender"], [
    { pt: "Por favor.", en: "Please." },
    { pt: "Obrigado.", en: "Thank you." },
    { pt: "Muito obrigado.", en: "Thank you very much." },
    { pt: "De nada.", en: "You're welcome." },
  ]),
  mk("a1-04", "start", "✅", "Sim, não, talvez", "Answer quickly and keep the conversation going.", "Short answers", "Portuguese often uses short answers plus a friendly extra word.", "When unsure, say “não entendi” rather than switching straight to English.", ["conversation", "survival"], [
    { pt: "Sim.", en: "Yes." },
    { pt: "Não.", en: "No." },
    { pt: "Talvez.", en: "Maybe." },
    { pt: "Não entendi.", en: "I didn't understand." },
  ]),
  mk("a1-05", "start", "🔢", "Números úteis", "Handle prices, rooms and times.", "Numbers 1–10", "Numbers are essential for cafés, taxis, markets and hotel rooms.", "Practise numbers out loud. They become useful only when fast.", ["numbers", "listening"], [
    { pt: "um", en: "one" },
    { pt: "dois", en: "two" },
    { pt: "três", en: "three" },
    { pt: "dez", en: "ten" },
  ]),
  mk("a1-06", "start", "❓", "Perguntas rápidas", "Ask simple questions when you need help.", "Question words", "“Onde” means where, “quanto” means how much, and “quando” means when.", "One good question can replace twenty memorised phrases.", ["questions", "survival"], [
    { pt: "Onde fica o banheiro?", en: "Where is the bathroom?" },
    { pt: "Quanto custa?", en: "How much does it cost?" },
    { pt: "Quando abre?", en: "When does it open?" },
    { pt: "Você fala inglês?", en: "Do you speak English?" },
  ]),
  mk("a1-07", "start", "🐢", "Mais devagar", "Control the speed of the conversation.", "Repair phrases", "Use “mais devagar” and “pode repetir?” to buy time.", "These are confidence phrases. Learn them early.", ["survival", "conversation"], [
    { pt: "Pode repetir?", en: "Can you repeat?" },
    { pt: "Mais devagar, por favor.", en: "More slowly, please." },
    { pt: "Como se diz isso em português?", en: "How do you say this in Portuguese?" },
    { pt: "Só um momento.", en: "Just a moment." },
  ]),
  mk("a1-08", "start", "🏁", "Checkpoint: primeira conversa", "Survive a tiny first conversation.", "Mini conversation", "Put greetings, names, politeness and repair phrases together.", "Your goal is not perfection. Your goal is to stay in the conversation.", ["conversation", "review"], [
    { pt: "Oi, meu nome é Jack.", en: "Hi, my name is Jack." },
    { pt: "Estou aprendendo português.", en: "I am learning Portuguese." },
    { pt: "Pode falar mais devagar?", en: "Can you speak more slowly?" },
    { pt: "Muito prazer.", en: "Nice to meet you." },
  ]),

  mk("a1-09", "cafe", "☕", "Quero um café", "Order your first drink.", "I want + item", "“Eu quero...” is direct and common. Add “por favor” to soften it.", "In cafés, short and polite is perfect.", ["food", "ordering"], [
    { pt: "Eu quero um café, por favor.", en: "I want a coffee, please." },
    { pt: "Eu quero uma água.", en: "I want a water." },
    { pt: "Um suco de laranja, por favor.", en: "An orange juice, please." },
    { pt: "Sem açúcar, por favor.", en: "Without sugar, please." },
  ]),
  mk("a1-10", "cafe", "🥖", "Na padaria", "Buy bread and a snack.", "Bakery phrases", "Use “um” with masculine nouns and “uma” with feminine nouns.", "Don't panic over gender. Notice patterns and keep going.", ["food", "gender"], [
    { pt: "Eu quero um pão de queijo.", en: "I want a cheese bread." },
    { pt: "Eu quero uma coxinha.", en: "I want a coxinha." },
    { pt: "Tem pão francês?", en: "Do you have French bread?" },
    { pt: "Para viagem, por favor.", en: "To go, please." },
  ]),
  mk("a1-11", "cafe", "💸", "Quanto custa?", "Ask and understand prices.", "Prices", "“Quanto custa?” works for one thing. “Quanto é?” is also common in spoken Brazilian Portuguese.", "Pointing is allowed. Language plus gesture is real communication.", ["shopping", "numbers"], [
    { pt: "Quanto custa este café?", en: "How much does this coffee cost?" },
    { pt: "Quanto é?", en: "How much is it?" },
    { pt: "Está caro.", en: "It's expensive." },
    { pt: "Está barato.", en: "It's cheap." },
  ]),
  mk("a1-12", "cafe", "🍽️", "No restaurante", "Ask for a table and order politely.", "Restaurant basics", "“A gente” is very common in Brazil for “we”. It uses third-person singular verbs.", "Listen for “a gente” in real speech — Brazilians use it constantly.", ["food", "conversation"], [
    { pt: "Mesa para duas pessoas, por favor.", en: "Table for two people, please." },
    { pt: "A gente quer pedir.", en: "We want to order." },
    { pt: "O cardápio, por favor.", en: "The menu, please." },
    { pt: "A conta, por favor.", en: "The bill, please." },
  ]),
  mk("a1-13", "cafe", "🌶️", "Com ou sem?", "Customise food and drink.", "With / without", "“Com” means with. “Sem” means without.", "This lesson saves you when you dislike sugar, meat, spice or milk.", ["food", "prepositions"], [
    { pt: "Com leite, por favor.", en: "With milk, please." },
    { pt: "Sem cebola, por favor.", en: "Without onion, please." },
    { pt: "Sem carne.", en: "Without meat." },
    { pt: "Com gelo.", en: "With ice." },
  ]),
  mk("a1-14", "cafe", "😋", "Gostei!", "React naturally to food.", "Likes", "“Eu gosto de...” means I like. “Eu gostei” means I liked it.", "A small reaction makes conversation feel human.", ["food", "verbs"], [
    { pt: "Eu gosto de café.", en: "I like coffee." },
    { pt: "Eu não gosto de cebola.", en: "I don't like onion." },
    { pt: "Gostei muito.", en: "I liked it a lot." },
    { pt: "Está muito bom.", en: "It's very good." },
  ]),
  mk("a1-15", "cafe", "🛒", "No mercado", "Buy simple items at a market.", "This / that", "“Este/esta” means this; “esse/essa” often means that/this in spoken Brazil.", "In real life, pointing plus “esse aqui” is useful and natural.", ["shopping", "food"], [
    { pt: "Eu quero esse aqui.", en: "I want this one here." },
    { pt: "Tem banana?", en: "Do you have bananas?" },
    { pt: "Meio quilo, por favor.", en: "Half a kilo, please." },
    { pt: "Só isso, obrigado.", en: "That's all, thank you." },
  ]),
  mk("a1-16", "cafe", "🏁", "Checkpoint: pedir comida", "Complete a café mission from start to finish.", "Café role-play", "Combine ordering, price, customisation and polite closing.", "Your win condition: get what you want without switching language.", ["ordering", "review"], [
    { pt: "Oi, eu quero um café, por favor.", en: "Hi, I want a coffee, please." },
    { pt: "Quanto é?", en: "How much is it?" },
    { pt: "Sem açúcar, por favor.", en: "Without sugar, please." },
    { pt: "Obrigado, bom dia.", en: "Thank you, good morning." },
  ]),

  mk("a1-17", "city", "📍", "Onde fica...?", "Find the bathroom, exit or station.", "Where is", "“Onde fica...?” is the safest structure for locations.", "Memorise this as one chunk: onde fica + place.", ["directions", "questions"], [
    { pt: "Onde fica a estação?", en: "Where is the station?" },
    { pt: "Onde fica a saída?", en: "Where is the exit?" },
    { pt: "Fica perto?", en: "Is it nearby?" },
    { pt: "Fica longe?", en: "Is it far?" },
  ]),
  mk("a1-18", "city", "↩️", "Direita e esquerda", "Understand basic directions.", "Direction words", "“Vire” means turn. “Siga” means go/follow.", "Don't aim for perfect route descriptions yet — just recognise key words.", ["directions", "listening"], [
    { pt: "Vire à direita.", en: "Turn right." },
    { pt: "Vire à esquerda.", en: "Turn left." },
    { pt: "Siga em frente.", en: "Go straight ahead." },
    { pt: "É aqui?", en: "Is it here?" },
  ]),
  mk("a1-19", "city", "🚕", "Táxi e Uber", "Get from A to B.", "Transport request", "Use “para” for destination: para o hotel, para a praia.", "This is high-value travel Portuguese. Learn it as a script.", ["transport", "travel"], [
    { pt: "Eu vou para o hotel.", en: "I am going to the hotel." },
    { pt: "Pode me levar para a estação?", en: "Can you take me to the station?" },
    { pt: "Quanto tempo demora?", en: "How long does it take?" },
    { pt: "Pode parar aqui?", en: "Can you stop here?" },
  ]),
  mk("a1-20", "city", "🏨", "No hotel", "Check in without stress.", "Hotel basics", "“Eu tenho...” means I have. Use it for reservations, questions and problems.", "Hotel language is predictable — perfect for scripts.", ["travel", "hotel"], [
    { pt: "Eu tenho uma reserva.", en: "I have a reservation." },
    { pt: "Meu nome é Jack Bayliss.", en: "My name is Jack Bayliss." },
    { pt: "Qual é o número do quarto?", en: "What is the room number?" },
    { pt: "O café da manhã está incluído?", en: "Is breakfast included?" },
  ]),
  mk("a1-21", "city", "⏰", "Que horas são?", "Ask about time and opening hours.", "Time phrases", "“Que horas...” asks about time. “Abre” means opens; “fecha” means closes.", "Time phrases are great for listening practice because numbers appear quickly.", ["time", "questions"], [
    { pt: "Que horas são?", en: "What time is it?" },
    { pt: "Que horas abre?", en: "What time does it open?" },
    { pt: "Que horas fecha?", en: "What time does it close?" },
    { pt: "Às oito horas.", en: "At eight o'clock." },
  ]),
  mk("a1-22", "city", "🆘", "Preciso de ajuda", "Ask for help calmly.", "Need + help", "“Preciso de...” means I need. It is very useful and easy to extend.", "Emergency language should be simple, direct and practised out loud.", ["survival", "travel"], [
    { pt: "Preciso de ajuda.", en: "I need help." },
    { pt: "Estou perdido.", en: "I am lost." },
    { pt: "Onde fica a farmácia?", en: "Where is the pharmacy?" },
    { pt: "Pode me ajudar?", en: "Can you help me?" },
  ]),
  mk("a1-23", "city", "🌊", "Na praia", "Enjoy a beach day with useful phrases.", "Beach + comfort", "Use “está” for temporary states: está quente, está frio.", "Weather and comfort phrases start lots of easy conversations.", ["travel", "weather"], [
    { pt: "Está muito quente hoje.", en: "It's very hot today." },
    { pt: "A água está fria.", en: "The water is cold." },
    { pt: "Onde posso comprar água?", en: "Where can I buy water?" },
    { pt: "Eu gosto da praia.", en: "I like the beach." },
  ]),
  mk("a1-24", "city", "🏁", "Checkpoint: cidade", "Navigate a simple travel day.", "Travel mission", "Combine location, transport, hotel and help phrases.", "Imagine a real day: station → hotel → food → help.", ["directions", "review"], [
    { pt: "Onde fica a estação?", en: "Where is the station?" },
    { pt: "Eu vou para o hotel.", en: "I am going to the hotel." },
    { pt: "Preciso de ajuda.", en: "I need help." },
    { pt: "Pode repetir, por favor?", en: "Can you repeat, please?" },
  ]),

  mk("a1-25", "people", "🏠", "Minha família", "Say who is in your family.", "Family words", "“Meu” is masculine; “minha” is feminine.", "Gender matters, but clear meaning matters more at this stage.", ["family", "gender"], [
    { pt: "Minha família é pequena.", en: "My family is small." },
    { pt: "Meu filho tem três anos.", en: "My son is three years old." },
    { pt: "Minha esposa fala português.", en: "My wife speaks Portuguese." },
    { pt: "Eu tenho um irmão.", en: "I have a brother." },
  ]),
  mk("a1-26", "people", "💼", "Trabalho e rotina", "Talk simply about work and daily life.", "Work + routine", "Use “eu trabalho” for I work and “eu estudo” for I study.", "Real-life Portuguese should connect to your actual life.", ["work", "verbs"], [
    { pt: "Eu trabalho como geólogo.", en: "I work as a geologist." },
    { pt: "Eu trabalho de manhã.", en: "I work in the morning." },
    { pt: "Eu estudo português à noite.", en: "I study Portuguese at night." },
    { pt: "Hoje eu estou ocupado.", en: "Today I am busy." },
  ]),
  mk("a1-27", "people", "❤️", "Eu gosto de...", "Talk about likes and hobbies.", "Likes + de", "After “gostar”, use “de”: gosto de café, gosto de praia.", "This is one of the highest-return verb patterns in Portuguese.", ["verbs", "conversation"], [
    { pt: "Eu gosto de cozinhar.", en: "I like cooking." },
    { pt: "Eu gosto de rugby.", en: "I like rugby." },
    { pt: "Eu gosto de aprender português.", en: "I like learning Portuguese." },
    { pt: "Eu não gosto de esperar.", en: "I don't like waiting." },
  ]),
  mk("a1-28", "people", "📅", "Planos simples", "Say what you are doing today/tomorrow.", "Plans", "“Hoje” is today. “Amanhã” is tomorrow. “Vou...” means I am going to.", "Future plans are easy with “vou + verb”.", ["time", "verbs"], [
    { pt: "Hoje eu vou estudar.", en: "Today I am going to study." },
    { pt: "Amanhã eu vou trabalhar.", en: "Tomorrow I am going to work." },
    { pt: "Depois eu vou comer.", en: "Later I am going to eat." },
    { pt: "No fim de semana, eu vou descansar.", en: "At the weekend, I am going to rest." },
  ]),
  mk("a1-29", "people", "😄", "Como você está?", "Talk about feelings without overthinking.", "Feelings", "Use “estou” for how you feel now: estou feliz, cansado, com fome.", "Feelings are great conversation fuel.", ["feelings", "conversation"], [
    { pt: "Estou feliz.", en: "I am happy." },
    { pt: "Estou cansado.", en: "I am tired." },
    { pt: "Estou com fome.", en: "I am hungry." },
    { pt: "Estou bem, obrigado.", en: "I am well, thank you." },
  ]),
  mk("a1-30", "people", "📱", "Mensagens curtas", "Send simple friendly messages.", "Texting phrases", "Short messages often drop extra words. Keep it natural and clear.", "This is useful for WhatsApp-style Portuguese.", ["conversation", "writing"], [
    { pt: "Oi, tudo bem?", en: "Hi, how are you?" },
    { pt: "Chego em dez minutos.", en: "I arrive in ten minutes." },
    { pt: "Desculpa o atraso.", en: "Sorry for the delay." },
    { pt: "Até já!", en: "See you soon!" },
  ]),
  mk("a1-31", "people", "🎲", "Conversa livre guiada", "Use what you know in a playful chat.", "Guided conversation", "Reuse chunks. Don't invent complex sentences when a simple one works.", "Fluency starts as smart recycling.", ["conversation", "review"], [
    { pt: "Eu sou da Inglaterra, mas moro em Oslo.", en: "I am from England, but I live in Oslo." },
    { pt: "Eu trabalho como geólogo.", en: "I work as a geologist." },
    { pt: "Eu gosto de café e comida brasileira.", en: "I like coffee and Brazilian food." },
    { pt: "Eu quero falar melhor português.", en: "I want to speak Portuguese better." },
  ]),
  mk("a1-32", "people", "🏆", "Checkpoint A1: missão Tagarela", "Complete a friendly beginner conversation.", "Final A1 mini mission", "Combine identity, likes, plans, food and repair phrases.", "You now have enough Portuguese for real beginner interactions.", ["conversation", "review"], [
    { pt: "Oi, eu sou Jack. Tudo bem?", en: "Hi, I am Jack. How are you?" },
    { pt: "Estou aprendendo português brasileiro.", en: "I am learning Brazilian Portuguese." },
    { pt: "Hoje eu quero praticar um pouco.", en: "Today I want to practise a little." },
    { pt: "Pode falar mais devagar, por favor?", en: "Can you speak more slowly, please?" },
  ]),

  // ===================== A2 · Histórias e passado =====================
  mk("a2-01", "a2-past", "📖", "O que aconteceu?", "Talk about what you did, using the past.", "Simple past (regular)", "Past tense of -ar verbs: eu trabalhei, você trabalhou, nós trabalhamos.", "Past tense unlocks real storytelling. Start with the things you do every day.", ["past", "verbs"], [
    { pt: "Ontem eu trabalhei muito.", en: "Yesterday I worked a lot." },
    { pt: "Eu comi em um restaurante.", en: "I ate at a restaurant." },
    { pt: "Nós fomos à praia.", en: "We went to the beach." },
    { pt: "Você gostou do filme?", en: "Did you like the film?" },
    { pt: "Eu cheguei tarde em casa.", en: "I arrived home late." },
    { pt: "Foi muito divertido.", en: "It was a lot of fun." },
  ], "The pretérito perfeito is the everyday past. Regular -ar verbs: eu -ei, você -ou, nós -amos, eles -aram (trabalhei, trabalhou…). Watch the big irregulars: ir and ser share fui / foi / fomos, and comer (an -er verb) gives comi / comeu / comemos."),

  mk("a2-02", "a2-past", "✈️", "Minha viagem", "Tell the story of a trip.", "Past + describing", "Use the simple past for actions and 'estava/era' to describe how things were.", "Mixing past actions with description is how stories come alive.", ["past", "travel"], [
    { pt: "Eu viajei para o Rio no mês passado.", en: "I travelled to Rio last month." },
    { pt: "Nós ficamos em um hotel pequeno.", en: "We stayed in a small hotel." },
    { pt: "Eu comprei algumas lembranças.", en: "I bought some souvenirs." },
    { pt: "O voo atrasou duas horas.", en: "The flight was delayed two hours." },
    { pt: "A comida estava deliciosa.", en: "The food was delicious." },
    { pt: "Eu adorei a viagem.", en: "I loved the trip." },
  ], "Two past tenses work together: the pretérito perfeito for finished actions (viajei, comprei) and the pretérito imperfeito for description and background (estava, era, tinha). 'A comida estava deliciosa' describes; 'eu comprei' reports an action."),

  mk("a2-03", "a2-past", "🧒", "Quando eu era criança", "Describe how life used to be.", "Imperfect (habits)", "The imperfect (-ava / -ia) describes repeated past habits and how things were.", "Think 'used to' — childhood, routines and background scenes.", ["past", "family"], [
    { pt: "Quando eu era criança, eu morava no campo.", en: "When I was a child, I lived in the countryside." },
    { pt: "Eu jogava futebol todo dia.", en: "I used to play football every day." },
    { pt: "Minha avó cozinhava muito bem.", en: "My grandmother cooked very well." },
    { pt: "Nós tínhamos um cachorro.", en: "We had a dog." },
    { pt: "Eu não gostava de acordar cedo.", en: "I didn't like waking up early." },
  ], "The pretérito imperfeito = 'used to / was doing'. Endings: -ar verbs take -ava (morava, jogava); -er/-ir verbs take -ia (comia, dormia). Key irregulars: era (ser), tinha (ter), ia (ir). Use it for habits and descriptions, not single finished events."),

  mk("a2-04", "a2-past", "✅", "Já fiz isso", "Say what you've already done.", "Irregular past + já/ainda", "'Já' = already; 'ainda não' = not yet. Many common verbs are irregular in the past.", "These irregular verbs are everywhere — worth memorising as chunks.", ["past", "verbs"], [
    { pt: "Eu já fiz o almoço.", en: "I already made lunch." },
    { pt: "Você já foi ao Brasil?", en: "Have you been to Brazil?" },
    { pt: "Eu ainda não terminei.", en: "I haven't finished yet." },
    { pt: "Ele fez um bom trabalho.", en: "He did a good job." },
    { pt: "Eu disse a verdade.", en: "I told the truth." },
  ], "High-frequency irregular pasts to learn as a set: fazer → fiz / fez, dizer → disse, ter → tive / teve, estar → estive / esteve, ir/ser → fui / foi. Pair them with 'já' (already) and 'ainda não' (not yet) to talk about experience."),

  mk("a2-05", "a2-past", "🩺", "No médico", "Explain how you feel and ask for help.", "Health + 'estar com'", "'Estar com' + noun describes symptoms: estou com dor, com febre, com tosse.", "Health language is predictable and high-value when travelling.", ["health", "survival"], [
    { pt: "Eu estou com dor de cabeça.", en: "I have a headache." },
    { pt: "Eu não me sinto bem.", en: "I don't feel well." },
    { pt: "Começou ontem à noite.", en: "It started last night." },
    { pt: "Eu preciso de um remédio.", en: "I need some medicine." },
    { pt: "Cuide-se!", en: "Take care!" },
  ], "Brazilians say 'estar com' + a noun for states: estou com fome (hungry), com sede (thirsty), com dor (in pain), com febre (a fever). Note the reflexive verb sentir-se: eu me sinto, você se sente."),

  mk("a2-06", "a2-past", "🏁", "Conte uma história", "Tell a short story from start to finish.", "Sequencing the past", "Order events with: primeiro, depois, então, no fim.", "Connectors turn separate facts into a real story.", ["past", "review"], [
    { pt: "No fim de semana, eu fui ao mercado.", en: "At the weekend, I went to the market." },
    { pt: "Primeiro, eu comprei frutas e pão.", en: "First, I bought fruit and bread." },
    { pt: "Depois, eu encontrei um amigo.", en: "Then, I met a friend." },
    { pt: "Nós tomamos um café juntos.", en: "We had a coffee together." },
    { pt: "No fim, foi um dia ótimo.", en: "In the end, it was a great day." },
  ], "Sequencing words give a story shape: primeiro (first), depois / então (then), mais tarde (later), no fim / por fim (in the end). Combine them with the past tenses you've learned to narrate a whole day."),

  // ===================== A2 · Opiniões e futuro =====================
  mk("a2-07", "a2-future", "🔮", "Meus planos", "Say what you're going to do.", "Near future (ir + verb)", "Near future = ir (present) + infinitive: vou viajar, vamos comer.", "This is the easy, natural way Brazilians talk about the future.", ["future", "verbs"], [
    { pt: "Amanhã eu vou viajar.", en: "Tomorrow I'm going to travel." },
    { pt: "Nós vamos visitar a família.", en: "We're going to visit the family." },
    { pt: "Eu vou tentar falar só português.", en: "I'm going to try to speak only Portuguese." },
    { pt: "No próximo ano, eu quero morar no Brasil.", en: "Next year, I want to live in Brazil." },
    { pt: "Vai ser incrível.", en: "It's going to be amazing." },
    { pt: "Eu pretendo estudar mais.", en: "I intend to study more." },
  ], "For everyday plans, use the near future: the present of ir + an infinitive — vou viajar, vai ser, vamos comer. It's far more common in speech than the formal future (viajarei). 'Pretendo' (I intend to) and 'quero' (I want to) also point forward."),

  mk("a2-08", "a2-future", "💭", "Na minha opinião", "Give and react to opinions.", "Opinions + agreeing", "'Eu acho que…' = I think that…; 'concordar com' = to agree with.", "Opinions keep a conversation alive — learn to agree and disagree gently.", ["opinions", "conversation"], [
    { pt: "Na minha opinião, é importante.", en: "In my opinion, it's important." },
    { pt: "Eu acho que sim.", en: "I think so." },
    { pt: "Eu concordo com você.", en: "I agree with you." },
    { pt: "Eu não concordo.", en: "I don't agree." },
    { pt: "Para mim, faz sentido.", en: "For me, it makes sense." },
    { pt: "Depende da situação.", en: "It depends on the situation." },
  ], "Soften opinions with 'eu acho que…' (I think that…) rather than stating bare facts. To agree, use concordar com (eu concordo com você). 'Para mim' = for me/in my view; 'faz sentido' = it makes sense; 'depende' = it depends."),

  mk("a2-09", "a2-future", "⚖️", "Melhor ou pior?", "Compare things naturally.", "Comparatives", "Compare with mais/menos … (do) que; tão … quanto; melhor / pior.", "Comparisons make your descriptions much more precise.", ["comparison", "verbs"], [
    { pt: "Este é melhor do que aquele.", en: "This one is better than that one." },
    { pt: "O café aqui é mais barato.", en: "The coffee here is cheaper." },
    { pt: "Ela fala português melhor do que eu.", en: "She speaks Portuguese better than me." },
    { pt: "É tão bom quanto o outro.", en: "It's as good as the other one." },
    { pt: "Esse é o melhor da cidade.", en: "This is the best in the city." },
  ], "Comparatives: mais … (do) que (more … than), menos … (do) que (less … than), tão … quanto (as … as). Irregulars: bom → melhor (better), ruim → pior (worse). The superlative adds the article: o melhor, a mais barata."),

  mk("a2-10", "a2-future", "🛠️", "Resolvendo problemas", "Handle complaints politely.", "Polite conditional", "queria / gostaria / poderia are softer, polite forms — use them for requests.", "Politeness defuses problems. Soft verbs do a lot of work.", ["requests", "survival"], [
    { pt: "Eu queria trocar isso, por favor.", en: "I'd like to exchange this, please." },
    { pt: "Tem um problema com a conta.", en: "There's a problem with the bill." },
    { pt: "Isso não está certo.", en: "This isn't right." },
    { pt: "Você poderia me ajudar?", en: "Could you help me?" },
    { pt: "Eu gostaria de falar com o gerente.", en: "I'd like to speak with the manager." },
  ], "The conditional softens requests: queria / gostaria (I'd like) instead of quero (I want), and poderia (could you) instead of pode (can you). Same meaning, much more polite — exactly what you want when sorting out a problem."),

  mk("a2-11", "a2-future", "🔗", "Conversa de verdade", "Link your ideas like a native.", "Connectors", "Join ideas with: mas, porque, então, por isso, apesar de.", "Connectors are the difference between word lists and real speech.", ["connectors", "conversation"], [
    { pt: "Eu queria ir, mas estava cansado.", en: "I wanted to go, but I was tired." },
    { pt: "Eu estudo todo dia porque é importante.", en: "I study every day because it's important." },
    { pt: "Então, o que você acha?", en: "So, what do you think?" },
    { pt: "Por isso eu cheguei cedo.", en: "That's why I arrived early." },
    { pt: "Apesar disso, foi um bom dia.", en: "Despite that, it was a good day." },
  ], "Connectors glue sentences together: mas (but), porque (because), então (so/then), por isso (that's why), apesar de / apesar disso (despite / despite that). Sprinkle them in and your Portuguese instantly sounds more fluent."),

  mk("a2-12", "a2-future", "🏆", "Missão Tagarela A2", "Tell your language-learning story.", "Final A2 mini mission", "Combine past, present, future and opinion in one short story.", "You can now move between time frames — that's real conversational range.", ["conversation", "review"], [
    { pt: "Mês passado, eu comecei a estudar português.", en: "Last month, I started studying Portuguese." },
    { pt: "No começo, foi difícil, mas eu não desisti.", en: "At first, it was hard, but I didn't give up." },
    { pt: "Agora eu consigo ter conversas simples.", en: "Now I can have simple conversations." },
    { pt: "No futuro, eu quero visitar o Brasil.", en: "In the future, I want to visit Brazil." },
    { pt: "Eu acho que estou melhorando.", en: "I think I'm getting better." },
  ], "This mission moves across time: past (comecei, foi), present (consigo, estou melhorando) and future (quero visitar). Being able to shift between time frames in one short story is the heart of A2 — well done."),
];

export const SKILL_LABELS = {
  greetings: "greetings",
  conversation: "conversation",
  identity: "introductions",
  politeness: "politeness",
  gender: "gender",
  survival: "survival phrases",
  numbers: "numbers",
  listening: "listening",
  questions: "questions",
  review: "review",
  food: "food",
  ordering: "ordering",
  shopping: "shopping",
  prepositions: "prepositions",
  verbs: "verbs",
  directions: "directions",
  transport: "transport",
  travel: "travel",
  hotel: "hotel",
  time: "time",
  weather: "weather",
  family: "family",
  work: "work",
  feelings: "feelings",
  writing: "writing",
  past: "past tense",
  future: "future",
  opinions: "opinions",
  comparison: "comparisons",
  connectors: "connectors",
  health: "health",
  requests: "polite requests",
};

export function skillLabel(tag) {
  return SKILL_LABELS[tag] || tag;
}
