// Shared, genre-neutral tables. Original Castmaker content — CC BY 4.0.
//
// Every entry carries `tags`. The engine keeps a running bag of tags from
// everything already chosen and weights new picks toward entries that share
// them. That is what makes background explain personality, personality
// explain flaws, and so on.
//
// Text tokens filled in at render time:
//   {they} {them} {their} {themself} {They} {Their}  pronouns
//   {was} {is} {has} {does}                           verbs that agree with the pronoun
//   {coin} {drink} {package} {messages} {city}        genre vocabulary

export const TAGS = [
  "loss", "violence", "faith", "wealth", "poverty", "learning", "crime",
  "duty", "wild", "art", "betrayal", "ambition", "family", "isolation",
  "craft", "travel", "healing", "secrecy", "order", "chaos", "tech",
];

// law / good feed alignment in tabletop adapters. opp = never paired with.
export const TRAITS = [
  { t: "watchful", tags: ["secrecy", "crime", "violence"] },
  { t: "dutiful", tags: ["duty", "order", "faith"], law: 1 },
  { t: "reckless", tags: ["chaos", "violence", "ambition"], law: -1, opp: "meticulous" },
  { t: "tender-hearted", tags: ["healing", "family", "loss"], good: 1, opp: "ruthless" },
  { t: "calculating", tags: ["ambition", "wealth", "secrecy"], opp: "impulsive" },
  { t: "devout", tags: ["faith", "order"], law: 1, opp: "irreverent" },
  { t: "irreverent", tags: ["chaos", "art", "crime"], law: -1, opp: "devout" },
  { t: "generous", tags: ["family", "healing", "poverty"], good: 1, opp: "greedy" },
  { t: "greedy", tags: ["wealth", "ambition", "crime"], good: -1, opp: "generous" },
  { t: "curious", tags: ["learning", "travel", "tech"] },
  { t: "stubborn", tags: ["craft", "duty", "family"] },
  { t: "charming", tags: ["art", "crime", "wealth"] },
  { t: "blunt", tags: ["violence", "craft", "duty"] },
  { t: "secretive", tags: ["secrecy", "crime", "betrayal"], opp: "trusting" },
  { t: "loyal", tags: ["family", "duty"], law: 1 },
  { t: "restless", tags: ["travel", "chaos"], law: -1, opp: "patient" },
  { t: "patient", tags: ["craft", "learning", "wild"], opp: "restless" },
  { t: "vain", tags: ["wealth", "art", "ambition"], opp: "humble" },
  { t: "protective", tags: ["family", "violence", "duty"], good: 1 },
  { t: "cynical", tags: ["betrayal", "crime", "poverty"], opp: "idealistic" },
  { t: "idealistic", tags: ["faith", "learning", "ambition"], good: 1, opp: "cynical" },
  { t: "meticulous", tags: ["craft", "order", "learning", "tech"], law: 1, opp: "impulsive" },
  { t: "impulsive", tags: ["chaos", "art"], law: -1, opp: "meticulous" },
  { t: "melancholy", tags: ["loss", "isolation", "art"], opp: "cheerful" },
  { t: "cheerful", tags: ["family", "art", "travel"], opp: "melancholy" },
  { t: "proud", tags: ["wealth", "duty", "ambition"], opp: "humble" },
  { t: "humble", tags: ["poverty", "faith", "craft"], opp: "proud" },
  { t: "ruthless", tags: ["violence", "ambition", "crime"], good: -1, opp: "tender-hearted" },
  { t: "self-reliant", tags: ["isolation", "wild", "poverty"], opp: "gregarious" },
  { t: "gregarious", tags: ["travel", "art", "family"], opp: "self-reliant" },
  { t: "suspicious", tags: ["betrayal", "secrecy", "isolation"], opp: "trusting" },
  { t: "trusting", tags: ["family", "faith"], opp: "suspicious" },
  { t: "inventive", tags: ["tech", "craft", "learning"] },
  { t: "wry", tags: ["crime", "art", "learning"] },
  { t: "vengeful", tags: ["betrayal", "violence", "loss"], good: -1 },
  { t: "principled", tags: ["order", "duty", "faith"], law: 1, good: 1 },
];

export const TEMPERAMENTS = [
  { t: "steady", phrase: "slow to anger and slower to forgive", tags: ["duty", "craft", "order"], voices: ["measured", "plainspoken"] },
  { t: "fiery", phrase: "quick to anger and quick to laugh", tags: ["violence", "chaos", "ambition"], voices: ["blunt", "theatrical"] },
  { t: "brooding", phrase: "inward, private, always half somewhere else", tags: ["loss", "isolation", "secrecy"], voices: ["terse", "measured"] },
  { t: "bright", phrase: "warm, loud, and impossible to stay angry at", tags: ["art", "family", "travel"], voices: ["chatty", "theatrical"] },
  { t: "cool", phrase: "composed in a way that unsettles people", tags: ["secrecy", "wealth", "crime", "ambition"], voices: ["precise", "sardonic"] },
  { t: "anxious", phrase: "always braced for the next bad thing", tags: ["poverty", "learning", "betrayal"], voices: ["rambling", "precise"] },
  { t: "warm", phrase: "gentle with others and hard on {themself}", tags: ["healing", "family", "faith"], voices: ["gentle", "plainspoken"] },
  { t: "wry", phrase: "amused by most things, including disaster", tags: ["crime", "art", "learning"], voices: ["sardonic", "chatty"] },
];

export const VOICES = {
  measured: {
    desc: "in a measured, unhurried way, choosing each word",
    habits: ["pauses before answering, even small questions", "repeats the other person's last words back to them", "never raises {their} voice"],
    lines: [
      "Let's not decide anything tonight. Sleep on it, and see what still seems true in the morning.",
      "I heard what you said. I'm still deciding what you meant.",
      "There's a right way to do this. It's slower. Let's do it anyway.",
    ],
  },
  plainspoken: {
    desc: "plainly, with short words and no decoration",
    habits: ["calls everyone by their first name immediately", "answers questions with a nod or shake when possible", "uses old sayings from home"],
    lines: [
      "I don't know much, but I know when a deal stinks, and this one does.",
      "Eat first. Then tell me the bad news.",
      "I'll help. Don't make me regret it.",
    ],
  },
  blunt: {
    desc: "bluntly, saying the uncomfortable thing first",
    habits: ["interrupts", "says 'no' as a complete sentence", "stares until people finish lying"],
    lines: [
      "No. Next question.",
      "You're lying, and you're bad at it.",
      "If you didn't want my opinion, you shouldn't have asked.",
    ],
  },
  theatrical: {
    desc: "theatrically, as though there is always an audience",
    habits: ["gestures with whatever {they} {is} holding", "gives everyone a nickname", "sighs loudly before agreeing"],
    lines: [
      "Oh, splendid. Another plan held together with hope and string.",
      "Everyone says they want the truth. Nobody ever tips for it.",
      "Darling, I was born for a crisis.",
    ],
  },
  terse: {
    desc: "tersely, in as few words as possible",
    habits: ["answers questions with questions", "goes silent instead of arguing", "never says goodbye"],
    lines: ["Later.", "Not my problem. Not yet.", "Ask someone who cares. Then come back to me."],
  },
  chatty: {
    desc: "in a rush of words, circling back to the point eventually",
    habits: ["over-explains when nervous", "remembers everyone's family members by name", "laughs at {their} own stories before the end"],
    lines: [
      "Sorry, I'm talking too much. My sister says I do that when I'm nervous. Am I nervous? I might be nervous.",
      "Oh, you'll love this, it's a funny story. Well, funny now. Not funny at the time.",
      "Have you eaten? You look like you haven't eaten. I know a place.",
    ],
  },
  precise: {
    desc: "precisely, correcting small inaccuracies as {they} go",
    habits: ["counts things out loud", "corrects other people's grammar under {their} breath", "gives estimates with error margins"],
    lines: [
      "Three exits. Two of them are watched. I'd like to discuss the third.",
      "That is not what I said. I said probably.",
      "I've counted the {coin}. Twice. Someone's skimming.",
    ],
  },
  sardonic: {
    desc: "sardonically, with a dry edge on everything",
    habits: ["thanks people for terrible news", "raises one eyebrow instead of answering", "narrates disasters as they happen"],
    lines: [
      "Wonderful. My favorite kind of plan: the kind where I get hurt.",
      "I'd say I'm surprised, but I've met people.",
      "Of course it's raining. Why wouldn't it be raining.",
    ],
  },
  rambling: {
    desc: "in long, looping sentences that wander off and come back",
    habits: ["starts stories in the middle", "loses track of what {they} {was} saying", "apologizes for things that aren't {their} fault"],
    lines: [
      "Right, so, where was I? The thing is, it's not the {drink}, it's who poured it.",
      "I had a point. It was a good point. It'll come back to me.",
      "Did I tell you about my uncle? This is relevant, I promise. Mostly relevant.",
    ],
  },
  gentle: {
    desc: "gently, softening hard truths without hiding them",
    habits: ["touches people's arms when talking", "asks how people are and waits for the real answer", "never says 'I told you so'"],
    lines: [
      "You don't have to tell me. But I'll listen if you do.",
      "Sit down a minute. The world will still be on fire after.",
      "It's all right to be afraid. It means you understood the question.",
    ],
  },
};

export const QUIRKS = [
  { t: "counts {coin} when nervous", tags: ["poverty", "wealth"] },
  { t: "hums the same four notes over and over", tags: ["art", "isolation"] },
  { t: "keeps a list of everyone who has ever lied to {them}", tags: ["betrayal", "secrecy"] },
  { t: "always sits facing the door", tags: ["violence", "crime"] },
  { t: "collects a small stone from every town on the road", tags: ["travel"] },
  { t: "can't sleep without a light on", tags: ["loss", "isolation"] },
  { t: "talks to animals more kindly than to people", tags: ["wild", "isolation"] },
  { t: "fixes things that aren't broken", tags: ["craft", "tech"] },
  { t: "quotes scripture at the worst possible moments", tags: ["faith"] },
  { t: "cooks huge meals for anyone nearby", tags: ["family", "healing"] },
  { t: "writes everything down, even other people's jokes", tags: ["learning", "order"] },
  { t: "bets on anything, even the weather", tags: ["chaos", "crime"] },
  { t: "folds paper into tiny animals while thinking", tags: ["art", "craft"] },
  { t: "never sits with {their} back to a window", tags: ["secrecy", "violence"] },
  { t: "says a quiet thank-you to tools after using them", tags: ["craft", "faith"] },
  { t: "can't resist correcting a map", tags: ["learning", "travel"] },
  { t: "keeps a spare of everything", tags: ["poverty", "order"] },
  { t: "laughs at funerals", tags: ["loss", "chaos"] },
  { t: "dresses better than {their} job requires", tags: ["ambition", "wealth"] },
  { t: "takes {their} {drink} far too seriously", tags: ["craft", "art"] },
];

export const FLAWS = [
  { t: "can't ask for help", tags: ["isolation", "duty", "poverty"] },
  { t: "drinks to quiet {their} thoughts", tags: ["loss", "violence"] },
  { t: "lies first, thinks later", tags: ["crime", "secrecy", "poverty"] },
  { t: "holds grudges for years", tags: ["betrayal", "family"] },
  { t: "needs to be the smartest person in the room", tags: ["learning", "ambition", "wealth"] },
  { t: "takes reckless risks when bored", tags: ["chaos", "travel"] },
  { t: "trusts the wrong people too quickly", tags: ["faith", "family"] },
  { t: "spends money the moment it arrives", tags: ["poverty", "wealth", "chaos"] },
  { t: "freezes when someone raises their voice", tags: ["violence", "family", "loss"] },
  { t: "won't break a rule even when it's hurting someone", tags: ["order", "duty", "faith"] },
  { t: "keeps score in every friendship", tags: ["ambition", "betrayal"] },
  { t: "can't stand to be ignored", tags: ["art", "ambition"] },
  { t: "runs at the first sign of commitment", tags: ["travel", "isolation", "betrayal"] },
  { t: "answers every slight with force", tags: ["violence", "poverty"] },
  { t: "buries feelings under work", tags: ["craft", "duty", "loss"] },
  { t: "hoards secrets as leverage", tags: ["secrecy", "crime"] },
  { t: "is easily flattered", tags: ["wealth", "art"] },
  { t: "believes the worst about strangers", tags: ["betrayal", "isolation", "violence"] },
  { t: "overthinks every choice until the moment passes", tags: ["learning", "tech"] },
  { t: "takes responsibility for things that were never {their} fault", tags: ["loss", "family", "healing"] },
];

export const FEARS = [
  { t: "being forgotten", tags: ["art", "isolation", "ambition"] },
  { t: "fire", tags: ["loss", "violence"] },
  { t: "becoming like {their} parents", tags: ["family", "violence"] },
  { t: "deep water", tags: ["travel", "loss"] },
  { t: "being poor again", tags: ["poverty", "wealth"] },
  { t: "crowds", tags: ["isolation", "violence"] },
  { t: "being found out", tags: ["secrecy", "crime", "betrayal"] },
  { t: "losing control", tags: ["violence", "chaos", "order"] },
  { t: "being alone when it matters", tags: ["isolation", "loss", "family"] },
  { t: "failing the people who rely on {them}", tags: ["duty", "family", "healing"] },
  { t: "sickness", tags: ["healing", "loss"] },
  { t: "the dark", tags: ["isolation", "wild"] },
  { t: "that faith is a lie", tags: ["faith"] },
  { t: "being owned by someone", tags: ["poverty", "crime", "order"] },
  { t: "enclosed spaces", tags: ["violence", "isolation"] },
  { t: "an old debt being called in", tags: ["crime", "wealth", "betrayal"] },
  { t: "machines that think", tags: ["tech", "learning"] },
  { t: "being ordinary", tags: ["ambition", "learning", "art"] },
];

export const WANTS = [
  { t: "to clear {their} family's name", short: "clear {their} family's name", tags: ["family", "betrayal", "duty"],
    why: ["because the shame landed on people who didn't earn it", "because {they} {is} certain the accusation was a lie"] },
  { t: "to buy back the land {their} family lost", short: "win back {their} family's land", tags: ["family", "poverty", "wealth"],
    why: ["because {their} grandmother is buried there", "because it's the last thing {their} father asked for"] },
  { t: "to find the person who betrayed {them}", short: "find the one who betrayed {them}", tags: ["betrayal", "violence"],
    why: ["because {they} {has} to know why", "because some debts can only be paid in person"] },
  { t: "to be remembered for something", short: "do something worth remembering", tags: ["art", "ambition"],
    why: ["because nobody remembers {their} parents", "because {they} {has} already been forgotten once"] },
  { t: "to protect a younger sibling from the life {they} lived", short: "keep a younger sibling safe", tags: ["family", "poverty", "crime"],
    why: ["because {they} promised {their} mother", "because {they} {has} seen where that road ends"] },
  { t: "to master {their} craft completely", short: "master {their} craft", tags: ["craft", "learning", "art"],
    why: ["because it is the one thing that has never let {them} down", "because a rival said {they} never would"] },
  { t: "to pay off a debt before it is collected the hard way", short: "pay off a dangerous debt", tags: ["crime", "wealth", "poverty"],
    why: ["because the collector has started asking about {their} friends", "because {they} signed for someone else's mistake"] },
  { t: "to find out what really happened", short: "learn the truth about the past", tags: ["secrecy", "learning", "loss"],
    why: ["because the official story has too many holes", "because someone keeps paying to keep it buried"] },
  { t: "to atone for one terrible choice", short: "make up for a terrible choice", tags: ["violence", "faith", "loss"],
    why: ["because {they} can still see the faces", "because nobody else ever punished {them} for it"] },
  { t: "to get rich enough to never be afraid again", short: "get rich and get safe", tags: ["poverty", "wealth", "ambition"],
    why: ["because {they} {has} not forgotten being hungry", "because money is the only wall {they} trust"] },
  { t: "to see what lies past the edge of the map", short: "go where no map reaches", tags: ["travel", "wild", "learning"],
    why: ["because staying put feels like dying slowly", "because {their} mentor went and never came back"] },
  { t: "to tear down the people at the top", short: "bring down the powerful", tags: ["poverty", "order", "violence"],
    why: ["because {they} watched them ruin {their} street", "because nobody else will"] },
  { t: "to earn a place where {they} truly belong", short: "find somewhere to belong", tags: ["isolation", "family"],
    why: ["because {they} {has} been a guest everywhere and family nowhere", "because {they} {is} tired of leaving"] },
  { t: "to keep a dangerous promise", short: "keep a dangerous promise", tags: ["duty", "faith", "loss"],
    why: ["because {they} gave {their} word to someone who died", "because breaking it would make {them} someone {they} hate"] },
  { t: "to prove {their} old mentor wrong", short: "prove {their} mentor wrong", tags: ["learning", "ambition", "betrayal"],
    why: ["because the mentor called {them} ordinary", "because the mentor stole {their} best work"] },
];

export const TURNING_POINTS = [
  { t: "walking away from the only people who knew {them}", tags: ["isolation", "travel"] },
  { t: "being given a second chance by someone who had no reason to give it", tags: ["faith", "healing"] },
  { t: "a debt called in at the worst possible moment", tags: ["crime", "wealth", "poverty"] },
  { t: "learning the truth about {their} parents", tags: ["family", "secrecy"] },
  { t: "a fight {they} won and wished {they} had lost", tags: ["violence", "loss"] },
  { t: "a promise made at a deathbed", tags: ["duty", "loss", "faith"] },
  { t: "being publicly humiliated by someone {they} trusted", tags: ["betrayal", "ambition"] },
  { t: "a windfall that brought the wrong kind of attention", tags: ["wealth", "crime"] },
  { t: "finding a teacher who finally took {them} seriously", tags: ["learning", "craft"] },
  { t: "the night {they} chose to stop running", tags: ["travel", "chaos", "duty"] },
];

// Writer layer: the lie a character believes and the truth they need.
export const LIES = [
  { lie: "If I let anyone close, they'll leave.", need: "to let someone stay, and believe they will", never: "I don't want you to go.", tags: ["loss", "betrayal", "isolation", "family"] },
  { lie: "I'm only worth what I can do for people.", need: "to accept being cared for without earning it", never: "I need help.", tags: ["poverty", "duty", "healing"] },
  { lie: "Power is the only real safety.", need: "to find safety in trust instead of control", never: "I was wrong to want it.", tags: ["violence", "ambition", "wealth", "poverty"] },
  { lie: "It was my fault.", need: "to forgive {themself}", never: "It wasn't my fault.", tags: ["loss", "violence", "family"] },
  { lie: "The rules exist for a reason, and the reason is always good.", need: "to judge right and wrong by {their} own conscience", never: "The rules were wrong.", tags: ["order", "duty", "faith"] },
  { lie: "Everyone lies, so I may as well lie first.", need: "to risk honesty with one person", never: "I trust you.", tags: ["crime", "betrayal", "secrecy"] },
  { lie: "Feelings get people killed.", need: "to let {themself} grieve", never: "I miss them.", tags: ["violence", "loss", "duty"] },
  { lie: "I don't belong anywhere.", need: "to see the home that is already {theirs}", never: "I'm happy here.", tags: ["isolation", "travel", "family"] },
  { lie: "If I stop moving, I'll have to feel it.", need: "to stay still long enough to face what happened", never: "I'm staying.", tags: ["travel", "chaos", "loss"] },
  { lie: "Being clever is the same as being right.", need: "to listen to people who know less and see more", never: "I didn't think of that.", tags: ["learning", "ambition", "tech"] },
  { lie: "The world can't change, so why try?", need: "to act as if one person matters", never: "Let's try.", tags: ["poverty", "betrayal", "loss"] },
  { lie: "Faith protects the faithful.", need: "to keep faith through doubt instead of without it", never: "I don't know if anyone is listening.", tags: ["faith"] },
];

export const ARC_TURNS = [
  { t: "the plan finally works and costs exactly what {they} feared" },
  { t: "someone {they} dismissed saves {their} life" },
  { t: "the truth about {eventShort} comes out" },
  { t: "{they} {is} forced to choose between what {they} {is} after and the people beside {them}" },
  { t: "a stranger shows {them} the future {they} {is} heading toward" },
  { t: "the person {they} {has} been protecting turns out not to need it" },
];

export const ROLES = [
  { t: "protagonist", minGood: 0 },
  { t: "foil" },
  { t: "mentor", minAge: 45 },
  { t: "antagonist", maxGood: 0 },
  { t: "rival" },
  { t: "ally", minGood: 0 },
  { t: "trickster", chaos: true },
  { t: "love interest", minGood: 0 },
];

export const HOOKS = [
  { t: "is carrying a {package} {they} {was} paid to deliver. {They} read it. {They} {has}n't delivered it.", tags: ["secrecy", "crime", "betrayal"] },
  { t: "owes a large sum to someone who would much rather be owed a favor.", tags: ["crime", "wealth", "poverty"] },
  { t: "is the only living witness to a crime that powerful people want forgotten.", tags: ["secrecy", "crime", "order"] },
  { t: "has been sending money every month to a family that doesn't know who it comes from.", tags: ["family", "secrecy", "loss"] },
  { t: "once went by a different name, and someone in {city} just recognized the old one.", tags: ["secrecy", "betrayal", "crime"] },
  { t: "found something on {their} last job that {they} {has}n't told anyone about.", tags: ["learning", "secrecy", "tech"] },
  { t: "is being quietly watched, and {has} noticed.", tags: ["secrecy", "violence"] },
  { t: "made a promise to a dying stranger and still {does}n't know what it means.", tags: ["faith", "loss", "duty"] },
  { t: "has a twin nobody here knows about.", tags: ["family", "secrecy"] },
  { t: "keeps receiving {messages} from someone {they} buried.", tags: ["loss", "secrecy"] },
  { t: "is leaving tomorrow and {has}n't told the one person it will hurt.", tags: ["travel", "family", "isolation"] },
  { t: "stole something small years ago that turned out to matter enormously.", tags: ["crime", "learning"] },
  { t: "knows where the missing heir is hiding.", tags: ["secrecy", "wealth", "order"] },
  { t: "was promised a reward for a job and is about to learn the reward was a lie.", tags: ["betrayal", "ambition"] },
  { t: "is secretly the person everyone is looking for.", tags: ["secrecy", "chaos", "violence"] },
];

export const RELATIONSHIP_TYPES = [
  { type: "Mentor", tags: ["learning", "craft", "duty"], notes: [
    "taught {them} everything useful and one thing that wasn't",
    "is dying, and has asked to see {them} once more",
    "disappeared without a word three years ago",
  ] },
  { type: "Sibling", tags: ["family"], notes: [
    "took the blame for something {they} did, and never mentions it",
    "chose the other side when the family split",
    "is the only person {they} would cross a city for",
  ] },
  { type: "Rival", tags: ["ambition", "violence", "art"], notes: [
    "wants the same thing and is a little better at getting it",
    "used to be {their} closest friend",
    "has never once beaten {them}, and has never stopped trying",
  ] },
  { type: "Creditor", tags: ["crime", "wealth", "poverty"], notes: [
    "is patient, polite, and keeps very good records",
    "would forgive the debt in exchange for one particular favor",
    "is owed more than money",
  ] },
  { type: "Old flame", tags: ["family", "art", "travel"], notes: [
    "left without explanation and just came back",
    "is now married to someone {they} can't stand",
    "still has something of {theirs} and won't give it back",
  ] },
  { type: "Former partner", tags: ["crime", "duty", "betrayal"], notes: [
    "went to prison for a job they did together",
    "saved {their} life and has never let {them} forget it",
    "thinks {they} {is} dead",
  ] },
];

export const PARTY_HOOKS = [
  "needs capable people to help {them} {wantShort}, and can't pay up front.",
  "will join anyone heading away from {originShort}, and won't say why.",
  "is after the same thing the party is, for very different reasons.",
  "owes one of the party a favor and hates it.",
  "has information the party needs, and wants a promise first.",
  "was hired to watch the party, and has started to like them.",
];
