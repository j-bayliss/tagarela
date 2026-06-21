export const COURSE_UNITS = [
  { id: "start", title: "Começo esperto", subtitle: "Sound friendly from day one.", emoji: "👋" },
  { id: "cafe", title: "Café e comida", subtitle: "Order, ask and survive menus.", emoji: "☕" },
  { id: "city", title: "Pela cidade", subtitle: "Directions, transport and useful questions.", emoji: "🚌" },
  { id: "people", title: "Pessoas e planos", subtitle: "Talk about yourself, family and daily life.", emoji: "💬" },
  { id: "daily", title: "Vida cotidiana", subtitle: "Everyday situations you'll actually face.", emoji: "🗓️" },
  { id: "bridge", title: "Ponte para o A2", subtitle: "Verb basics before the grammar levels.", emoji: "🌉" },
  { id: "a2-past", title: "Histórias e passado", subtitle: "A2 · Talk about what happened.", emoji: "📖" },
  { id: "a2-future", title: "Opiniões e futuro", subtitle: "A2 · Plans, opinions and richer chat.", emoji: "🔮" },
  { id: "b1-core", title: "Nuance e fluência", subtitle: "B1 · Hypotheticals, nuance and flow.", emoji: "🧠" },
  { id: "b1-real", title: "Português de verdade", subtitle: "B1 · Real conversations with range.", emoji: "🗣️" },
  { id: "b2-core", title: "Precisão e estilo", subtitle: "B2 · Get the fine grammar right.", emoji: "🎯" },
  { id: "b2-real", title: "Soando natural", subtitle: "B2 · Idioms, register and polish.", emoji: "✨" },
  { id: "c1-lang", title: "Domínio da língua", subtitle: "C1 · Advanced grammar mastery.", emoji: "🏛️" },
  { id: "c1-ideias", title: "Ideias e expressão", subtitle: "C1 · Register, idioms and nuance.", emoji: "🎩" },
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

  // ===================== Vida cotidiana (everyday) =====================
  mk("daily-01", "daily", "📞", "No telefone", "Handle a simple phone call.", "Phone basics", "On the phone, Brazilians say “Alô?” (never as an in-person greeting) and “Quem fala?” to ask who's calling.", "Phone calls feel hard because there are no gestures — lean on fixed phrases.", ["conversation", "survival"], [
    { pt: "Alô, quem fala?", en: "Hello, who's speaking?" },
    { pt: "Posso falar com a Ana?", en: "Can I speak with Ana?" },
    { pt: "Um momento, vou chamar.", en: "One moment, I'll get her." },
    { pt: "Ela não está agora.", en: "She's not here right now." },
    { pt: "Pode deixar um recado?", en: "Can I leave a message?" },
    { pt: "Eu ligo mais tarde, então.", en: "I'll call later, then." },
  ], "Phone Portuguese runs on set phrases: “Alô?” answers a call (it's not a general hello), “Quem fala?” asks who's calling, “recado” is a message, and “ligar” is the verb to call (eu ligo, ele liga)."),

  mk("daily-02", "daily", "👕", "Roupas e compras", "Shop for clothes confidently.", "Shopping for clothes", "Key verbs: experimentar (to try on) and levar (to take/buy).", "Sizes and colours plus a couple of verbs cover almost any clothes shop.", ["shopping"], [
    { pt: "Eu queria uma camiseta, por favor.", en: "I'd like a t-shirt, please." },
    { pt: "Qual é o seu tamanho?", en: "What's your size?" },
    { pt: "Posso experimentar?", en: "Can I try it on?" },
    { pt: "Tem em outra cor?", en: "Do you have it in another colour?" },
    { pt: "Ficou um pouco apertado.", en: "It came out a bit tight." },
    { pt: "Vou levar este.", en: "I'll take this one." },
  ], "Clothes shopping vocabulary: experimentar (to try on), tamanho (size), cor (colour), apertado/largo (tight/loose). “Vou levar” = I'll take it. “Ficar” describes the fit: ficou apertado (it turned out tight)."),

  mk("daily-03", "daily", "💊", "Na farmácia", "Describe a symptom and get medicine.", "At the pharmacy", "Use “estar com” + a symptom: estou com dor de garganta, com febre.", "Pharmacies in Brazil help with minor issues — these phrases go far.", ["health", "survival"], [
    { pt: "Estou com dor de garganta.", en: "I have a sore throat." },
    { pt: "Você tem algo para febre?", en: "Do you have something for a fever?" },
    { pt: "Quantas vezes por dia?", en: "How many times a day?" },
    { pt: "É com ou sem receita?", en: "Is it with or without a prescription?" },
    { pt: "Melhoras!", en: "Get well soon!" },
  ], "Symptoms use “estar com” + noun: estou com dor de garganta (sore throat), com febre (a fever), com tosse (a cough). “Receita” is a prescription; “quantas vezes por dia?” asks the dosage. A kind sign-off: “Melhoras!”"),

  mk("daily-04", "daily", "📱", "Tecnologia e celular", "Deal with everyday tech.", "Tech essentials", "Handy nouns: bateria, senha, mensagem, internet.", "Modern life needs modern words — these come up constantly.", ["conversation", "writing"], [
    { pt: "Meu celular está sem bateria.", en: "My phone is out of battery." },
    { pt: "Qual é a senha do wi-fi?", en: "What's the wi-fi password?" },
    { pt: "Você pode me mandar por mensagem?", en: "Can you text it to me?" },
    { pt: "A internet está muito lenta.", en: "The internet is very slow." },
    { pt: "Esqueci a senha de novo.", en: "I forgot the password again." },
  ], "Everyday tech: “sem bateria” (out of battery), “senha” (password), “mandar por mensagem” (to text), “lenta” (slow). “De novo” = again. These phrases come up far more than most textbook vocabulary."),

  mk("daily-05", "daily", "💳", "Dinheiro e banco", "Pay and handle money.", "Paying & money", "Very Brazilian: “parcelar” (to pay in instalments) and “à vista” (in one payment).", "Knowing how payment works avoids awkward moments at the till.", ["shopping", "numbers"], [
    { pt: "Quanto custa no total?", en: "How much is it in total?" },
    { pt: "Aceita cartão ou só dinheiro?", en: "Do you take card or only cash?" },
    { pt: "Pode parcelar?", en: "Can I pay in instalments?" },
    { pt: "Onde fica o caixa eletrônico?", en: "Where's the ATM?" },
    { pt: "Acho que o troco veio errado.", en: "I think the change is wrong." },
  ], "Brazilian payment vocabulary: “parcelar” (to split into monthly instalments — extremely common), “à vista” (pay in full), “caixa eletrônico” (ATM), “troco” (change). “No total” = altogether."),

  mk("daily-06", "daily", "🎉", "Convites e combinados", "Make and answer plans.", "Inviting & arranging", "Casual invites: “Vamos…?”, “Bora!”, and “Combinado” to seal a plan.", "This is the social glue that turns vocabulary into friendships.", ["conversation", "time"], [
    { pt: "Vamos sair hoje à noite?", en: "Shall we go out tonight?" },
    { pt: "Bora! Que horas?", en: "Let's do it! What time?" },
    { pt: "Pode ser às oito?", en: "Can it be at eight?" },
    { pt: "Combinado, te encontro lá.", en: "Deal, I'll meet you there." },
    { pt: "Infelizmente, não vou poder ir.", en: "Unfortunately, I won't be able to go." },
    { pt: "Fica para a próxima!", en: "Next time, then!" },
  ], "Making plans casually: “Vamos…?” / “Bora!” (let's), “Pode ser às oito?” (how about eight?), “Combinado” (deal/agreed), and the friendly rain-check “Fica para a próxima”. To decline kindly: “infelizmente, não vou poder”."),

  // ===================== Ponte para o A2 (bridge) =====================
  mk("bridge-01", "bridge", "🗣️", "O presente: verbos em -ar", "Conjugate regular -ar verbs.", "Present tense (-ar)", "Drop -ar and add the endings: eu -o, você/ele -a, nós -amos, eles -am.", "Most Portuguese verbs are -ar, so this one pattern unlocks hundreds of them.", ["verbs", "grammar"], [
    { pt: "Eu falo português.", en: "I speak Portuguese." },
    { pt: "Você trabalha muito.", en: "You work a lot." },
    { pt: "Nós moramos no Brasil.", en: "We live in Brazil." },
    { pt: "Eles gostam de música.", en: "They like music." },
    { pt: "A gente estuda todo dia.", en: "We study every day." },
  ], "Regular -ar verbs (falar, trabalhar, morar, gostar, estudar) follow one pattern in the present: eu falo, você/ele fala, nós falamos, eles/vocês falam. Note that 'a gente' (we, colloquial) takes the ele/ela form: a gente estuda."),

  mk("bridge-02", "bridge", "🗣️", "O presente: -er e -ir", "Conjugate regular -er and -ir verbs.", "Present tense (-er/-ir)", "-er: -o, -e, -emos, -em. -ir: -o, -e, -imos, -em. Only the 'nós' form differs.", "These two families behave almost identically — learn them together.", ["verbs", "grammar"], [
    { pt: "Eu como às sete.", en: "I eat at seven." },
    { pt: "Você bebe café?", en: "Do you drink coffee?" },
    { pt: "Nós abrimos a loja.", en: "We open the shop." },
    { pt: "Eles decidem juntos.", en: "They decide together." },
    { pt: "Eu escrevo todo dia.", en: "I write every day." },
  ], "Regular -er (comer, beber, escrever): eu como, você come, nós comemos, eles comem. Regular -ir (abrir, decidir, partir): eu abro, você abre, nós abrimos, eles abrem. The only difference is the nós form: -emos vs -imos."),

  mk("bridge-03", "bridge", "⚖️", "Ser ou estar?", "Choose between the two verbs for 'to be'.", "Ser vs estar", "ser = permanent/essential (identity, origin, profession); estar = temporary states & location.", "Getting this contrast right early prevents a very common beginner mistake.", ["grammar", "verbs"], [
    { pt: "Eu sou brasileiro.", en: "I am Brazilian." },
    { pt: "Eu estou cansado.", en: "I am tired." },
    { pt: "Ela é médica.", en: "She is a doctor." },
    { pt: "Ela está em casa.", en: "She is at home." },
    { pt: "O café está quente.", en: "The coffee is hot." },
    { pt: "Como você está?", en: "How are you?" },
  ], "Both mean 'to be'. Use ser (sou, é, somos, são) for lasting things — identity, origin, profession: sou inglês, ela é médica. Use estar (estou, está, estamos, estão) for temporary states and location: estou cansado, está em casa, o café está quente. Quick test: a feeling, a place, or right-now → estar; a defining, lasting fact → ser."),

  mk("bridge-04", "bridge", "⭐", "Irregulares essenciais", "Use the most common irregular verbs.", "Key irregular verbs", "Memorise the present of ter, ir, fazer, querer and poder — they're everywhere.", "These five carry an enormous amount of everyday Portuguese.", ["verbs", "grammar"], [
    { pt: "Eu tenho tempo hoje.", en: "I have time today." },
    { pt: "Você vai ao trabalho?", en: "Are you going to work?" },
    { pt: "Nós fazemos exercício.", en: "We do exercise." },
    { pt: "Eu quero água, por favor.", en: "I want water, please." },
    { pt: "Ela pode ajudar.", en: "She can help." },
  ], "High-frequency irregulars to know cold in the present: ter (tenho, tem, temos, têm), ir (vou, vai, vamos, vão), fazer (faço, faz, fazemos, fazem), querer (quero, quer, queremos, querem), poder (posso, pode, podemos, podem). They anchor countless sentences."),

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

  // ===================== B1 · Nuance e fluência =====================
  mk("b1-01", "b1-core", "🙏", "Espero que dê certo", "Express wishes, hopes and doubts.", "Present subjunctive", "After hopes, wishes and doubt, Portuguese switches to the subjunctive: espero que você esteja bem.", "The subjunctive feels strange at first — learn it through fixed openers like 'espero que' and 'tomara que'.", ["subjunctive", "conversation"], [
    { pt: "Espero que você esteja bem.", en: "I hope you're well." },
    { pt: "Tomara que dê tudo certo.", en: "Hopefully everything works out." },
    { pt: "É importante que a gente pratique.", en: "It's important that we practise." },
    { pt: "Quero que você venha comigo.", en: "I want you to come with me." },
    { pt: "Talvez ele não saiba.", en: "Maybe he doesn't know." },
  ], "The present subjunctive appears after wishes, doubt and emotion: espero que, tomara que, é importante que, quero que, talvez. Form it from the eu-present stem with the 'opposite' vowel: -ar → e (fale), -er/-ir → a (coma, parta). Memorise the irregulars: seja, esteja, vá, dê, venha, saiba."),

  mk("b1-02", "b1-core", "🌈", "Se eu pudesse", "Talk about hypotheticals and dreams.", "Conditional + se", "Hypotheticals: Se + imperfect subjunctive (tivesse, fosse), main verb in the conditional (-ria).", "This pattern lets you talk about dreams, advice and 'what ifs'.", ["conditional", "subjunctive"], [
    { pt: "Se eu tivesse tempo, eu viajaria mais.", en: "If I had time, I would travel more." },
    { pt: "Se eu fosse você, eu aceitaria.", en: "If I were you, I would accept." },
    { pt: "Eu gostaria de morar perto da praia.", en: "I would like to live near the beach." },
    { pt: "Seria ótimo te ver de novo.", en: "It would be great to see you again." },
    { pt: "Se pudesse, eu mudaria isso.", en: "If I could, I would change this." },
  ], "Unreal conditions use two pieces: 'Se' + the imperfect subjunctive (tivesse, fosse, pudesse, fizesse) and a main clause in the conditional, formed with -ria (viajaria, aceitaria, gostaria). 'Se eu fosse você…' (if I were you) is the classic way to give advice."),

  mk("b1-03", "b1-core", "💬", "Me liga depois", "Use object pronouns like a Brazilian.", "Object pronouns", "In spoken Brazil, object pronouns come before the verb: me, te, lhe, nos.", "Don't overthink placement — copy the natural spoken order: 'me dá', 'te ligo'.", ["pronouns", "conversation"], [
    { pt: "Eu te ligo mais tarde.", en: "I'll call you later." },
    { pt: "Me passa o sal, por favor.", en: "Pass me the salt, please." },
    { pt: "Eu já te falei isso.", en: "I already told you that." },
    { pt: "Posso te ajudar?", en: "Can I help you?" },
    { pt: "Ela me convidou para a festa.", en: "She invited me to the party." },
  ], "Brazilians place object pronouns before the verb in speech: me, te, lhe, nos. They even start sentences with them — 'Me passa…', 'Te amo' — which textbooks call wrong but everyone says. 'Te' is the everyday informal 'you', matching 'você' in practice."),

  mk("b1-04", "b1-core", "⏳", "Faz tempo que...", "Talk about duration and recent habits.", "há / faz + time", "'Há' and 'faz' + a time period = 'for' or 'ago'. 'Tenho + particípio' = a recent, ongoing pattern.", "These structures express things English does with 'have been …-ing'.", ["fluency", "time"], [
    { pt: "Eu moro aqui há cinco anos.", en: "I've lived here for five years." },
    { pt: "Faz tempo que não te vejo.", en: "It's been a while since I saw you." },
    { pt: "Ultimamente, eu tenho dormido mal.", en: "Lately, I've been sleeping badly." },
    { pt: "Eu tenho estudado bastante.", en: "I've been studying a lot." },
    { pt: "Há quanto tempo você espera?", en: "How long have you been waiting?" },
  ], "'Há' (formal) and 'faz' (spoken) + a period mean 'for' or 'ago': moro aqui há cinco anos. The compound 'tenho + past participle' (tenho estudado, tenho dormido) describes something repeated and ongoing up to now — close to English 'have been -ing'."),

  mk("b1-05", "b1-core", "🗨️", "Ele disse que...", "Report what other people said.", "Reported speech", "Report with 'disse que…', ask with 'perguntou se…', and shift the tense back.", "Reported speech is essential for telling stories about other people.", ["storytelling", "conversation"], [
    { pt: "Ele disse que ia chegar tarde.", en: "He said he was going to arrive late." },
    { pt: "Ela me perguntou se eu estava bem.", en: "She asked me if I was okay." },
    { pt: "Eles falaram que o restaurante é ótimo.", en: "They said the restaurant is great." },
    { pt: "Eu pensei que fosse mais caro.", en: "I thought it would be more expensive." },
    { pt: "O médico disse para eu descansar.", en: "The doctor told me to rest." },
  ], "Report statements with 'disse/falou que…' and questions with 'perguntou se…'. The tense usually shifts back: vai → ia, é → era. For relayed instructions use 'disse para + eu + infinitive' (disse para eu descansar = told me to rest)."),

  mk("b1-06", "b1-core", "⚖️", "Por um lado...", "Build a balanced opinion.", "Structuring opinions", "Frame two sides with 'por um lado… por outro', and hedge with 'na verdade', 'depende'.", "Sounding thoughtful is about structure, not big words.", ["opinions", "connectors"], [
    { pt: "Por um lado é caro, por outro vale a pena.", en: "On one hand it's expensive, on the other it's worth it." },
    { pt: "Na verdade, eu discordo um pouco.", en: "Actually, I disagree a little." },
    { pt: "Faz sentido, mas tenho minhas dúvidas.", en: "It makes sense, but I have my doubts." },
    { pt: "Depende do ponto de vista.", en: "It depends on the point of view." },
    { pt: "De modo geral, eu concordo.", en: "Generally speaking, I agree." },
  ], "Structure an opinion to sound fluent: 'por um lado… por outro (lado)' weighs two sides; 'na verdade' = actually; 'de modo geral' = generally speaking. Hedge politely with 'tenho minhas dúvidas' and 'depende' instead of flat disagreement."),

  // ===================== B1 · Português de verdade =====================
  mk("b1-07", "b1-real", "💼", "No trabalho", "Handle work conversations.", "Professional language", "Workplace chunks: ficar responsável por, remarcar, prazo, resolver.", "Work Portuguese is full of fixed expressions — learn them as blocks.", ["professional", "verbs"], [
    { pt: "Eu fiquei responsável pelo projeto.", en: "I became responsible for the project." },
    { pt: "A gente precisa resolver isso logo.", en: "We need to sort this out soon." },
    { pt: "Vou te mandar um e-mail com os detalhes.", en: "I'll send you an email with the details." },
    { pt: "Podemos remarcar a reunião?", en: "Can we reschedule the meeting?" },
    { pt: "Estou um pouco atrasado com o prazo.", en: "I'm a little behind on the deadline." },
  ], "Useful work vocabulary: ficar responsável por (to be in charge of), resolver (to sort out), remarcar (to reschedule), prazo (deadline), reunião (meeting). Note the contraction 'pelo' = por + o (responsável pelo projeto)."),

  mk("b1-08", "b1-real", "❤️", "Saudade e sentimentos", "Express feelings with nuance.", "Feelings + ficar", "'Ficar + adjective' = to become/feel; 'deixar alguém + adjective' = to make someone feel.", "'Saudade' is the famous Brazilian feeling — learn to use it naturally.", ["relationships", "feelings"], [
    { pt: "Eu fico feliz quando te vejo.", en: "I feel happy when I see you." },
    { pt: "Isso me deixa um pouco nervoso.", en: "That makes me a little nervous." },
    { pt: "Eu estava com saudade de você.", en: "I missed you." },
    { pt: "Não leva a mal, mas eu discordo.", en: "Don't take it the wrong way, but I disagree." },
    { pt: "Fica tranquilo, vai dar tudo certo.", en: "Relax, it's all going to work out." },
  ], "'Ficar + adjective' means to become/feel (fico feliz, fica nervoso). 'Deixar alguém + adjective' = to make someone feel (me deixa nervoso). 'Saudade' (estar com saudade de) is the longing for someone or something — there's no single English word. Soften hard things with 'não leva a mal'."),

  mk("b1-09", "b1-real", "🎬", "De repente...", "Tell a vivid story.", "Past tenses combined", "Background uses the imperfect; the interrupting action uses the simple past; 'tinha + particípio' = had done.", "Great stories layer description, action and earlier events.", ["storytelling", "past"], [
    { pt: "Eu estava saindo quando começou a chover.", en: "I was leaving when it started to rain." },
    { pt: "Enquanto eu cozinhava, ele assistia TV.", en: "While I was cooking, he was watching TV." },
    { pt: "De repente, o telefone tocou.", en: "Suddenly, the phone rang." },
    { pt: "Eu nem tinha percebido que era tarde.", en: "I hadn't even noticed it was late." },
    { pt: "No fim das contas, deu tudo certo.", en: "In the end, everything worked out." },
  ], "Layer your past tenses: the imperfect sets the scene (estava saindo, cozinhava), the pretérito perfeito drops in the key event (começou, tocou), and the pluperfect 'tinha + particípio' (tinha percebido) refers to something that had happened even earlier. 'De repente' = suddenly."),

  mk("b1-10", "b1-real", "🤝", "Mal-entendidos", "Smooth over a misunderstanding.", "Repair + apology", "Useful: 'houve um mal-entendido', 'deixa eu explicar', 'não foi minha intenção'.", "Repairing communication politely is a true sign of fluency.", ["professional", "survival"], [
    { pt: "Acho que houve um mal-entendido.", en: "I think there was a misunderstanding." },
    { pt: "Não foi minha intenção.", en: "It wasn't my intention." },
    { pt: "Deixa eu explicar melhor.", en: "Let me explain better." },
    { pt: "Desculpa se eu não fui claro.", en: "Sorry if I wasn't clear." },
    { pt: "Tudo certo, sem ressentimentos.", en: "It's all good, no hard feelings." },
  ], "'Houve' is the past of 'haver' (there was): houve um mal-entendido. 'Deixa eu + infinitive' is the spoken way to say 'let me…' (deixa eu explicar). These phrases let you de-escalate and clarify without switching to English."),

  mk("b1-11", "b1-real", "🔮", "Quando eu tiver tempo", "Talk about open-ended future plans.", "Future subjunctive", "After quando, se, assim que about the future, use the future subjunctive (tiver, chegar, der).", "This tense is extremely common in Brazil and marks real fluency.", ["subjunctive", "future"], [
    { pt: "Quando eu tiver tempo, eu viajo.", en: "When I have time, I'll travel." },
    { pt: "Assim que eu chegar, eu te aviso.", en: "As soon as I arrive, I'll let you know." },
    { pt: "Se tudo der certo, eu mudo no ano que vem.", en: "If all goes well, I'll move next year." },
    { pt: "Faça o que você achar melhor.", en: "Do whatever you think is best." },
    { pt: "Vou esperar até que ele responda.", en: "I'll wait until he replies." },
  ], "The future subjunctive points to an uncertain future after quando, se, assim que, enquanto and 'o que': quando eu tiver, se der, o que você achar. Build it from the 'eles' simple-past stem (tiveram → tiver, fizeram → fizer, foram → for). Brazilians use it constantly."),

  mk("b1-12", "b1-real", "🏆", "Missão Tagarela B1", "Tell your story with full range.", "Final B1 mini mission", "Combine subjunctive, conditional and future subjunctive in one reflection.", "If you can move between these moods, you're genuinely conversational.", ["conversation", "review"], [
    { pt: "Se eu pudesse dar um conselho, seria: não desista.", en: "If I could give one piece of advice, it'd be: don't give up." },
    { pt: "Faz um tempo que eu estudo português todo dia.", en: "I've been studying Portuguese every day for a while." },
    { pt: "Espero que um dia eu seja fluente.", en: "I hope that one day I'll be fluent." },
    { pt: "Quando eu for ao Brasil, vou falar com todo mundo.", en: "When I go to Brazil, I'll talk to everyone." },
    { pt: "No fim das contas, o esforço vale a pena.", en: "In the end, the effort is worth it." },
  ], "This mission blends the B1 toolkit: conditional (seria), 'faz + tempo' for duration, present subjunctive (espero que… seja), and future subjunctive (quando eu for). Switching smoothly between these moods in one short reflection is exactly what conversational B1 sounds like."),

  // ===================== B2 · Precisão e estilo =====================
  mk("b2-01", "b2-core", "🎯", "Crase: o famoso à", "Master the dreaded à.", "Crase (à)", "Crase = the preposition 'a' + the article 'a' merging into 'à'.", "Even Brazilians debate crase — learn the high-frequency cases and you're ahead.", ["grammar", "writing"], [
    { pt: "Eu vou à praia amanhã.", en: "I'm going to the beach tomorrow." },
    { pt: "A reunião é às oito horas.", en: "The meeting is at eight o'clock." },
    { pt: "Entregue o relatório à diretora.", en: "Deliver the report to the director." },
    { pt: "Vou ao mercado e à farmácia.", en: "I'm going to the market and the pharmacy." },
    { pt: "Estou disposto a ajudar.", en: "I'm willing to help." },
  ], "Crase happens when the preposition 'a' meets a feminine article 'a': vou a + a praia → vou à praia. Use it before feminine nouns (à diretora), in clock times (às oito), and in 'à direita/à esquerda'. No crase before verbs (disposto a ajudar) or masculine nouns (ao mercado = a + o)."),

  mk("b2-02", "b2-core", "🔀", "Por ou para?", "Choose the right preposition.", "por vs para", "'Por' = reason, exchange, route; 'para' = purpose, destination, recipient.", "This pair confuses learners for years — anchor each to a clear idea.", ["grammar", "prepositions"], [
    { pt: "Eu fiz isso por você.", en: "I did this for (the sake of) you." },
    { pt: "Este presente é para você.", en: "This gift is for you." },
    { pt: "Passei pela sua casa ontem.", en: "I passed by your house yesterday." },
    { pt: "Estudo para passar na prova.", en: "I study (in order) to pass the test." },
    { pt: "Obrigado por tudo.", en: "Thanks for everything." },
  ], "'Por' covers cause/motive (por você), exchange (paguei por isso), route and 'through' (pela casa — por + a), and 'thanks for' (por tudo). 'Para' covers purpose/goal (para passar), destination (para o Rio) and recipient (para você). Rough test: para points forwards to a goal; por points back to a reason."),

  mk("b2-03", "b2-core", "🔁", "Voz passiva", "Say what was done, not who did it.", "Passive voice", "Passive = ser + past participle (+ por + agent); the participle agrees in gender/number.", "The passive is everywhere in news and formal writing.", ["grammar", "verbs"], [
    { pt: "O livro foi escrito por ele.", en: "The book was written by him." },
    { pt: "A casa foi vendida no ano passado.", en: "The house was sold last year." },
    { pt: "Os ingressos serão vendidos online.", en: "The tickets will be sold online." },
    { pt: "O problema já foi resolvido.", en: "The problem has already been solved." },
    { pt: "Esse prato é feito com camarão.", en: "This dish is made with prawns." },
  ], "Form the passive with ser + particípio: foi escrito, foi vendida, serão vendidos. The participle agrees with the subject (a casa foi vendida, os ingressos foram vendidos). Brazilians also use the 'se' passive: 'vende-se casas', 'aluga-se quartos'."),

  mk("b2-04", "b2-core", "🎭", "Pronomes: o, a, lhe", "Replace nouns precisely.", "Object pronouns (formal)", "Direct objects: o, a, os, as (it/him/her/them). Indirect: lhe (to him/her).", "Spoken Brazil simplifies these, but recognising them is essential for reading.", ["pronouns", "grammar"], [
    { pt: "Eu o vi ontem.", en: "I saw him yesterday." },
    { pt: "Você a conhece?", en: "Do you know her?" },
    { pt: "Eu lhe disse a verdade.", en: "I told him/her the truth." },
    { pt: "Vou comprá-lo amanhã.", en: "I'm going to buy it tomorrow." },
    { pt: "Ainda não a encontrei.", en: "I still haven't found her/it." },
  ], "Direct-object pronouns o/a/os/as replace the thing or person (eu o vi). After an infinitive they attach with a hyphen and the verb loses its -r: comprar + o → comprá-lo. 'Lhe' is the indirect object (to him/her). In casual speech Brazilians often just say 'vi ele' / 'comprar ele', but the o/a forms dominate in writing."),

  mk("b2-05", "b2-core", "🔗", "Conjunções + subjuntivo", "Use the subjunctive after key linkers.", "Subjunctive triggers", "Some conjunctions always take the subjunctive: embora, para que, caso, a menos que, antes que.", "Memorise the trigger words — the mood follows automatically.", ["subjunctive", "connectors"], [
    { pt: "Embora seja difícil, eu vou tentar.", en: "Although it's hard, I'm going to try." },
    { pt: "Vou explicar para que você entenda.", en: "I'll explain so that you understand." },
    { pt: "Caso precise, é só me avisar.", en: "If you need to, just let me know." },
    { pt: "A menos que chova, vamos sair.", en: "Unless it rains, we'll go out." },
    { pt: "Antes que eu esqueça, obrigado.", en: "Before I forget, thank you." },
  ], "These conjunctions always force the subjunctive: embora (although), para que (so that), caso (in case/if), a menos que (unless), antes que (before), sem que (without), contanto que (as long as). Learn the trigger and the mood is automatic: embora seja, caso precise, antes que eu esqueça."),

  mk("b2-06", "b2-core", "🧵", "Conectando com estilo", "Link long ideas smoothly.", "Discourse markers", "Markers like ou seja, aliás, portanto and enfim organise longer speech.", "These small words make you sound articulate, not just correct.", ["connectors", "fluency"], [
    { pt: "Ou seja, não vai dar certo.", en: "In other words, it's not going to work." },
    { pt: "Aliás, eu queria te falar uma coisa.", en: "By the way, I wanted to tell you something." },
    { pt: "Portanto, é melhor esperar.", en: "Therefore, it's better to wait." },
    { pt: "Por outro lado, pode funcionar.", en: "On the other hand, it might work." },
    { pt: "Enfim, foi uma experiência válida.", en: "Anyway, it was a worthwhile experience." },
  ], "Discourse markers steer a conversation: ou seja (in other words), aliás (by the way / actually), portanto (therefore), por outro lado (on the other hand), enfim (anyway / in short). Drop them at the start of a sentence to sound natural and organised."),

  // ===================== B2 · Soando natural =====================
  mk("b2-07", "b2-real", "🎁", "Expressões com dar", "Use the verb everyone overloads.", "Idioms with dar", "'Dar' is wildly idiomatic: dar certo, dá para, deu ruim.", "Learn these as whole chunks, not word by word.", ["idioms", "verbs"], [
    { pt: "Deu certo no final.", en: "It worked out in the end." },
    { pt: "Não dá para fazer isso agora.", en: "It's not possible to do this now." },
    { pt: "Me dá um desconto?", en: "Will you give me a discount?" },
    { pt: "Vai dar tudo certo.", en: "Everything's going to be fine." },
    { pt: "Deu ruim.", en: "It went wrong. (slang)" },
  ], "'Dar' goes far beyond 'to give': dar certo (to work out), dá para + infinitive (it's possible to), não dá (no way / can't), deu ruim (it went wrong — slang), dar uma olhada (to take a look). These chunks are everywhere in everyday Brazilian speech."),

  mk("b2-08", "b2-real", "🔧", "Ficar: muito mais que 'stay'", "Unlock a verb with many lives.", "Uses of ficar", "Ficar means stay, but also become, end up, arrange and 'be located'.", "One verb, many meanings — context tells you which.", ["idioms", "verbs"], [
    { pt: "Eu fico em casa no domingo.", en: "I stay home on Sundays." },
    { pt: "Ela ficou brava comigo.", en: "She got angry with me." },
    { pt: "Ficou caro demais.", en: "It ended up too expensive." },
    { pt: "A gente ficou de se encontrar.", en: "We arranged to meet." },
    { pt: "Fica para a próxima.", en: "Let's leave it for next time." },
  ], "Ficar = to stay (fico em casa), to become (ficou brava, fica feliz), to end up (ficou caro), to arrange (ficou de + infinitive = agreed to), and to be located (a praia fica longe). 'Fica para a próxima' is the friendly Brazilian rain-check."),

  mk("b2-09", "b2-real", "🍬", "Diminutivos e tom", "Add warmth with -inho/-inha.", "Diminutives", "Diminutives aren't only about size — they add affection, softness or charm.", "A cafezinho isn't a tiny coffee; it's a friendly one.", ["style", "conversation"], [
    { pt: "Vamos tomar um cafezinho?", en: "Shall we have a (little) coffee?" },
    { pt: "Só um minutinho.", en: "Just a minute (please)." },
    { pt: "Que casa bonitinha!", en: "What a cute little house!" },
    { pt: "Está frio, leva um casaquinho.", en: "It's cold, take a (little) jacket." },
    { pt: "Vamos devagarinho.", en: "Let's go nice and slowly." },
  ], "Adding -inho/-inha rarely means 'small'. It softens and warms: cafezinho (a friendly coffee), minutinho (just a moment), bonitinho (cute), devagarinho (nice and slow). Overusing it sounds sweet and very Brazilian — a key part of the culture's tone."),

  mk("b2-10", "b2-real", "🕰️", "Hipóteses no passado", "Talk about what could have been.", "Past hypotheticals", "Se + pluperfect subjunctive + conditional perfect: se eu soubesse, teria avisado.", "This is how you express regret and 'what if' about the past.", ["conditional", "subjunctive"], [
    { pt: "Se eu soubesse, teria avisado.", en: "If I had known, I would have warned you." },
    { pt: "Eu teria ido, mas estava doente.", en: "I would have gone, but I was sick." },
    { pt: "Eles já tinham saído quando cheguei.", en: "They had already left when I arrived." },
    { pt: "Eu deveria ter estudado mais.", en: "I should have studied more." },
    { pt: "Podia ter sido pior.", en: "It could have been worse." },
  ], "Past 'what ifs' combine 'se' + pluperfect subjunctive (se eu tivesse sabido / soubesse) with the conditional perfect (teria avisado). For regret use 'deveria ter + particípio' (should have) and 'podia ter + particípio' (could have). 'Já tinha + particípio' = had already done."),

  mk("b2-11", "b2-real", "📧", "Registro formal", "Write and speak formally.", "Formal register", "Formal Portuguese swaps everyday verbs for solicitar, informar, and set polite phrases.", "Essential for emails, officialdom and the workplace.", ["formal", "professional"], [
    { pt: "Gostaria de solicitar uma informação.", en: "I would like to request some information." },
    { pt: "Poderia me informar o horário?", en: "Could you inform me of the time?" },
    { pt: "Agradeço desde já a atenção.", en: "Thank you in advance for your attention." },
    { pt: "Fico à disposição.", en: "I remain at your disposal." },
    { pt: "Prezado senhor, boa tarde.", en: "Dear sir, good afternoon." },
  ], "Formal register prefers solicitar (vs pedir), informar (vs falar) and gostaria/poderia for politeness. Set closings: 'agradeço desde já', 'fico à disposição', 'atenciosamente'. Openers: 'Prezado(a)…'. Use these for emails, bureaucracy and professional settings."),

  mk("b2-12", "b2-real", "🏆", "Missão Tagarela B2", "Reflect with full nuance.", "Final B2 mini mission", "Blend past hypotheticals, subjunctive and concessive structures.", "If this feels natural, you've got real B2 range and style.", ["conversation", "review"], [
    { pt: "Se eu tivesse começado antes, já estaria fluente.", en: "If I had started earlier, I'd already be fluent." },
    { pt: "Ainda assim, não me arrependo de nada.", en: "Even so, I don't regret anything." },
    { pt: "O importante é que eu continue praticando.", en: "What matters is that I keep practising." },
    { pt: "Por mais difícil que seja, vale a pena.", en: "However hard it may be, it's worth it." },
    { pt: "Enfim, essa é a minha jornada com o português.", en: "Anyway, that's my journey with Portuguese." },
  ], "This mission blends B2 hallmarks: the past hypothetical (se tivesse começado… estaria), the subjunctive after 'o importante é que' (que eu continue), and the concessive 'por mais que' (however much). Carrying nuance like this across a short reflection is exactly what B2 sounds like."),

  // ===================== C1 · Domínio da língua =====================
  mk("c1-01", "c1-lang", "🏛️", "Mais-que-perfeito", "Talk about the past-before-the-past.", "Pluperfect", "tinha/havia + particípio = had done; 'havia' is more formal.", "Layering pasts precisely is a hallmark of advanced speech.", ["grammar", "past"], [
    { pt: "Quando cheguei, ele já tinha saído.", en: "When I arrived, he had already left." },
    { pt: "Eu nunca tinha visto algo assim.", en: "I had never seen anything like it." },
    { pt: "Ela disse que já havia terminado.", en: "She said she had already finished." },
    { pt: "Tínhamos combinado de nos encontrar.", en: "We had arranged to meet." },
    { pt: "Se eu tivesse sabido, teria agido diferente.", en: "Had I known, I'd have acted differently." },
  ], "The pluperfect (mais-que-perfeito composto) is tinha or havia + past participle: 'já tinha saído' (had already left). 'Havia' is the more formal/written variant. It pairs with the conditional perfect (teria + particípio) for past hypotheticals: 'se eu tivesse sabido, teria agido…'."),

  mk("c1-02", "c1-lang", "🎚️", "Subjuntivo avançado", "Use the subjunctive after advanced linkers.", "Advanced subjunctive", "More triggers: nem que, conquanto, contanto que, por mais que.", "These conjunctions instantly raise your register.", ["subjunctive", "grammar"], [
    { pt: "Farei isso nem que leve a noite toda.", en: "I'll do it even if it takes all night." },
    { pt: "Conquanto seja difícil, é possível.", en: "Although it's hard, it's possible." },
    { pt: "Vou ajudar, contanto que você se esforce.", en: "I'll help, provided you make an effort." },
    { pt: "Caso haja dúvidas, me procure.", en: "Should there be questions, come to me." },
    { pt: "Por mais que eu tente, não consigo.", en: "However much I try, I can't." },
  ], "Advanced subjunctive triggers: nem que (even if), conquanto (although, formal), contanto que (provided that), caso (if/should), por mais que (however much). Note 'haja' (subjunctive of haver) in 'caso haja dúvidas'."),

  mk("c1-03", "c1-lang", "🔁", "Voz passiva e impessoal", "Use the impersonal and passive 'se'.", "Passive/impersonal se", "'se' makes verbs impersonal or passive: fala-se, trata-se de.", "This is the register of signs, news and formal writing.", ["grammar", "formal"], [
    { pt: "Fala-se português aqui.", en: "Portuguese is spoken here." },
    { pt: "Trata-se de um caso raro.", en: "It's a matter of a rare case." },
    { pt: "Construiu-se uma ponte nova.", en: "A new bridge was built." },
    { pt: "Foram tomadas várias medidas.", en: "Several measures were taken." },
    { pt: "Espera-se que a situação melhore.", en: "It's hoped the situation will improve." },
  ], "The pronoun 'se' creates passive/impersonal sentences: fala-se português (Portuguese is spoken), trata-se de (it's about/a matter of). The verb agrees with the subject: 'construiu-se uma ponte' but 'venderam-se as casas'. Common in notices and formal prose."),

  mk("c1-04", "c1-lang", "🧱", "Coesão e conectivos", "Link ideas in formal speech.", "Formal connectors", "ademais, por conseguinte, tendo em vista, ainda que, vale ressaltar.", "Cohesion devices make arguments flow at C1.", ["connectors", "formal"], [
    { pt: "Ademais, há outro fator a considerar.", en: "Moreover, there's another factor to consider." },
    { pt: "Tendo em vista os resultados, seguimos.", en: "Given the results, we carried on." },
    { pt: "Por conseguinte, a decisão foi adiada.", en: "Consequently, the decision was postponed." },
    { pt: "Ainda que pareça simples, não é.", en: "Even though it seems simple, it isn't." },
    { pt: "Vale ressaltar que isso é exceção.", en: "It's worth stressing that this is an exception." },
  ], "Formal cohesion: ademais (moreover), por conseguinte (consequently), tendo em vista (given/in view of), ainda que + subjunctive (even though), vale ressaltar/destacar que (it's worth noting that). These structure essays and presentations."),

  mk("c1-05", "c1-lang", "📐", "Regência e crase", "Get verb regency and crase right.", "Regency & crase", "Some verbs require 'a': assistir a, preferir A a B, obedecer a.", "Precise regency separates advanced from intermediate speakers.", ["grammar", "regency"], [
    { pt: "Ele assistiu ao jogo ontem.", en: "He watched the game yesterday." },
    { pt: "Prefiro chá a café.", en: "I prefer tea to coffee." },
    { pt: "Obedeça às regras.", en: "Obey the rules." },
    { pt: "Cheguei a uma conclusão.", en: "I reached a conclusion." },
    { pt: "Refiro-me àquilo que falamos.", en: "I'm referring to what we discussed." },
  ], "Verb regency: assistir a (to watch), preferir A a B (never 'do que'), obedecer a, referir-se a, chegar a. When that 'a' meets a feminine article or aquele/aquilo, you get crase: às regras, àquilo. Hallmark of careful, educated Portuguese."),

  mk("c1-06", "c1-lang", "🏁", "Checkpoint C1: argumentar", "Build a formal argument.", "Argumentation", "Frame arguments: em primeiro lugar, em suma, não se pode negar, portanto.", "Structured argument is the core C1 speaking skill.", ["conversation", "review"], [
    { pt: "Em primeiro lugar, é preciso considerar o contexto.", en: "Firstly, one must consider the context." },
    { pt: "Por um lado há vantagens; por outro, riscos.", en: "On one hand there are advantages; on the other, risks." },
    { pt: "Não se pode negar que houve avanços.", en: "It can't be denied that there were advances." },
    { pt: "Em suma, os benefícios superam os custos.", en: "In short, the benefits outweigh the costs." },
    { pt: "Portanto, defendo essa posição.", en: "Therefore, I defend this position." },
  ], "An argument arc: em primeiro lugar (firstly) → por um lado… por outro (weigh sides) → não se pode negar que (concede) → em suma (sum up) → portanto (conclude). Pair with the impersonal 'se' and the subjunctive for a polished register."),

  // ===================== C1 · Ideias e expressão =====================
  mk("c1-07", "c1-ideias", "🎭", "Expressões idiomáticas", "Use vivid idioms naturally.", "Idioms", "Idioms rarely translate word-for-word — learn the whole image.", "Idioms signal real cultural fluency.", ["idioms", "style"], [
    { pt: "Ele pagou o pato pelos outros.", en: "He took the blame for the others." },
    { pt: "Isso é a cereja do bolo.", en: "That's the cherry on the cake." },
    { pt: "Vou pôr os pingos nos is.", en: "I'm going to set things straight." },
    { pt: "Ela ficou de mãos atadas.", en: "She was left powerless." },
    { pt: "Não precisa chover no molhado.", en: "No need to state the obvious." },
  ], "Idioms carry meaning as a whole: pagar o pato (take the blame), pôr os pingos nos is (set things straight), ficar de mãos atadas (be powerless), chover no molhado (belabour the obvious). Learn the image, not the words."),

  mk("c1-08", "c1-ideias", "🛹", "Coloquialismos e gírias", "Understand casual, slangy speech.", "Slang & informal", "Very informal Brazilian speech — great to understand, use with care.", "Knowing slang helps you follow friends, music and memes.", ["slang", "style"], [
    { pt: "Cara, que rolê irado!", en: "Dude, what an awesome outing!" },
    { pt: "Tô de boa, relaxa.", en: "I'm chill, relax." },
    { pt: "Isso aí é mó treta.", en: "That's a load of drama." },
    { pt: "Bora marcar alguma coisa.", en: "Let's arrange to do something." },
    { pt: "Que mico que eu paguei!", en: "How embarrassing that was!" },
  ], "Casual register: cara (dude), rolê (an outing), irado/massa (awesome), de boa (chill), treta (drama/beef), bora (let's go), pagar mico (to embarrass yourself). Great for comprehension — but read the room before using it."),

  mk("c1-09", "c1-ideias", "🪶", "Nuance e modalização", "Soften and qualify your claims.", "Hedging", "Modalize with: eu diria que, talvez fosse, convém, não deixa de ser.", "Measured language sounds thoughtful and diplomatic.", ["style", "conversation"], [
    { pt: "Talvez fosse melhor reconsiderar.", en: "Perhaps it would be better to reconsider." },
    { pt: "Eu diria que é arriscado.", en: "I'd say it's risky." },
    { pt: "Não deixa de ser verdade.", en: "It's true nonetheless." },
    { pt: "De certo modo, faz sentido.", en: "In a way, it makes sense." },
    { pt: "Convém ter cautela.", en: "It's advisable to be cautious." },
  ], "Hedging softens strong claims: eu diria que (I'd say), talvez fosse (perhaps it would be), não deixa de ser (it is nonetheless), de certo modo (in a way), convém + infinitive (it's advisable to). Diplomatic and distinctly advanced."),

  mk("c1-10", "c1-ideias", "📜", "Discurso formal e escrita", "Write formal emails and letters.", "Formal writing", "Set formulas open and close formal correspondence.", "Bureaucracy and work demand this register.", ["formal", "writing"], [
    { pt: "Venho por meio desta solicitar uma reunião.", en: "I am writing to request a meeting." },
    { pt: "Conforme combinado, segue o documento.", en: "As agreed, the document follows." },
    { pt: "Cabe destacar a relevância do tema.", en: "It is worth highlighting the topic's relevance." },
    { pt: "Em virtude do exposto, concluímos que...", en: "In view of the above, we conclude that…" },
    { pt: "Atenciosamente, subscrevo-me.", en: "Yours sincerely." },
  ], "Formal writing runs on fixed formulas: 'venho por meio desta' (I am writing to), 'conforme combinado' (as agreed), 'cabe destacar' (it's worth highlighting), 'em virtude do exposto' (in view of the above), 'atenciosamente' (yours sincerely)."),

  mk("c1-11", "c1-ideias", "💡", "Tópicos abstratos", "Discuss abstract ideas.", "Abstract discussion", "Verbs for ideas: implicar, suscitar, considerar, a meu ver.", "Abstract vocabulary unlocks debate and essays.", ["abstract", "conversation"], [
    { pt: "A liberdade implica responsabilidade.", en: "Freedom entails responsibility." },
    { pt: "Trata-se de uma questão ética complexa.", en: "It's a complex ethical question." },
    { pt: "Há de se considerar o impacto social.", en: "One must consider the social impact." },
    { pt: "Isso suscita um debate profundo.", en: "That raises a profound debate." },
    { pt: "A meu ver, o fim não justifica os meios.", en: "In my view, the end doesn't justify the means." },
  ], "Vocabulary for ideas: implicar (to entail), suscitar (to raise/provoke), há de se considerar (one must consider), a meu ver (in my view). With the impersonal 'se' and subjunctive, this is the language of essays and debate."),

  mk("c1-12", "c1-ideias", "🏆", "Missão Tagarela C1", "Reflect with full command.", "Final C1 mini mission", "Combine pluperfect, advanced subjunctive, formal connectors and enclisis.", "If this feels natural, your Portuguese is genuinely advanced.", ["conversation", "review"], [
    { pt: "Ao longo dos anos, aprimorei meu português consideravelmente.", en: "Over the years, I've improved my Portuguese considerably." },
    { pt: "Ainda que reste muito a aprender, sinto-me confiante.", en: "Although much remains to learn, I feel confident." },
    { pt: "Caso surjam dúvidas, sei como esclarecê-las.", en: "Should questions arise, I know how to clear them up." },
    { pt: "Em suma, essa jornada valeu cada esforço.", en: "In short, this journey was worth every effort." },
    { pt: "Pretendo seguir me aperfeiçoando.", en: "I intend to keep improving." },
  ], "This mission blends C1 markers: refined vocabulary (aprimorar, aperfeiçoar-se), advanced subjunctive (ainda que reste, caso surjam), formal connectors (em suma) and pronoun enclisis (sinto-me, esclarecê-las). Carrying all of this naturally is genuine advanced command."),
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
  subjunctive: "subjunctive",
  conditional: "conditional",
  pronouns: "pronouns",
  fluency: "fluency",
  professional: "work & professional",
  relationships: "relationships",
  storytelling: "storytelling",
  grammar: "grammar",
  style: "style & tone",
  idioms: "idioms",
  formal: "formal register",
  regency: "verb regency",
  abstract: "abstract topics",
  slang: "slang & informal",
};

export function skillLabel(tag) {
  return SKILL_LABELS[tag] || tag;
}
