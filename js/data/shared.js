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
    desc: "precisely, correcting small inaccuracies as {they} go{es}",
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
    why: ["because {they} {has} not forgotten being hungry", "because money is the only wall {they} trust{s}"] },
  { t: "to see what lies past the edge of the map", short: "go where no map reaches", tags: ["travel", "wild", "learning"],
    why: ["because staying put feels like dying slowly", "because {their} mentor went and never came back"] },
  { t: "to tear down the people at the top", short: "bring down the powerful", tags: ["poverty", "order", "violence"],
    why: ["because {they} watched them ruin {their} street", "because nobody else will"] },
  { t: "to earn a place where {they} truly belong", short: "find somewhere to belong", tags: ["isolation", "family"],
    why: ["because {they} {has} been a guest everywhere and family nowhere", "because {they} {is} tired of leaving"] },
  { t: "to keep a dangerous promise", short: "keep a dangerous promise", tags: ["duty", "faith", "loss"],
    why: ["because {they} gave {their} word to someone who died", "because breaking it would make {them} someone {they} hate{s}"] },
  { t: "to prove {their} old mentor wrong", short: "prove {their} mentor wrong", tags: ["learning", "ambition", "betrayal"],
    why: ["because the mentor called {them} ordinary", "because the mentor stole {their} best work"] },
  // Small, everyday wants for background characters.
  { t: "to get through the week without trouble", short: "get through the week", tags: ["poverty", "duty"],
    why: ["because the rent is due and the roof leaks", "because last week was bad enough"] },
  { t: "to be left alone to do {their} work", short: "be left alone", tags: ["craft", "isolation"],
    why: ["because people are more trouble than they're worth", "because the work is the only thing that makes sense"] },
  { t: "to open a small business of {their} own", short: "open a business of {their} own", tags: ["ambition", "craft", "family"],
    why: ["because {they} {is} tired of making someone else rich", "because {their} grandfather always meant to"] },
  { t: "to win back someone's good opinion", short: "win back someone's respect", tags: ["family", "art"],
    why: ["because {they} said something unforgivable at a wedding", "because it was {their} fault the shop burned"] },
  // World-scale wants for heroes of legend.
  { t: "to stop a catastrophe only {they} can see coming", short: "stop the catastrophe only {they} can see", tags: ["faith", "duty", "loss"],
    why: ["because the visions get closer every night", "because {they} saw it happen once already, and woke up in the past"] },
  { t: "to break a curse that has followed {their} bloodline for generations", short: "break {their} family's curse", tags: ["family", "faith", "loss"],
    why: ["because {they} {is} the last one left", "because it took {their} mother on her fortieth birthday, and {their} own is coming"] },
  { t: "to overthrow the power that rules {their} world", short: "overthrow the power that rules {their} world", tags: ["order", "violence", "poverty"],
    why: ["because no one else has ever come so close", "because {they} {was} raised to be its weapon and know where it is weak"] },
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
  // Small secrets for background characters.
  { t: "is saving up for something small and specific, and won't say what.", tags: ["poverty", "family"] },
  { t: "has a crush on a regular customer and has never said a word.", tags: ["art", "isolation"] },
  { t: "is quietly planning to quit.", tags: ["travel", "chaos"] },
  { t: "waters down the {drink}, but only for people {they} dislike{s}.", tags: ["crime", "craft"] },
  // World-shaking secrets for heroes of legend.
  { t: "is the subject of a prophecy {they} {has} spent {their} whole life trying to outrun.", tags: ["faith", "secrecy", "travel"] },
  { t: "carries the only key to something that was locked away for a very good reason.", tags: ["secrecy", "duty", "learning"] },
  { t: "is the lost heir of the very power {they} {is} fighting against.", tags: ["family", "secrecy", "order"] },
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

// ---------- Moral compass ----------
// Two axes, each from -1 to +1:
//   order:  Freedom (-1) <-> Order (+1)
//   mercy:  Ruthlessness (-1) <-> Mercy (+1)

// Tags that pull a character along each axis.
export const MORAL_PULL = {
  order: { duty: 1, order: 1, faith: 0.6, family: 0.3, chaos: -1, crime: -0.6, travel: -0.4, art: -0.3 },
  mercy: { healing: 1, family: 0.6, faith: 0.5, loss: 0.2, violence: -0.6, crime: -0.4, betrayal: -0.5, ambition: -0.5, wealth: -0.3 },
};

// Names for the nine regions of the compass, [mercy row][order column],
// rows from merciful to ruthless, columns from order to freedom.
export const MORAL_NAMES = [
  ["Guardian", "Good Samaritan", "Rebel with a cause"],
  ["Rule keeper", "Pragmatist", "Free agent"],
  ["Iron fist", "Mercenary", "Wildfire"],
];

export const MORAL_LINES = [
  { t: "never harms a child", tags: ["family", "healing"], mercy: 0 },
  { t: "never breaks a sworn oath", tags: ["duty", "order", "faith"], order: 0.2 },
  { t: "never leaves anyone behind", tags: ["family", "duty", "violence"], mercy: 0.2 },
  { t: "never kills someone who has surrendered", tags: ["violence", "duty"], mercy: 0 },
  { t: "never lies to family", tags: ["family", "betrayal"] },
  { t: "never takes from people poorer than {them}", tags: ["poverty", "crime"], mercy: 0.1 },
  { t: "never kneels to anyone", tags: ["chaos", "ambition"], order: -0.2 },
  { t: "never betrays an employer mid-job", tags: ["crime", "duty"] },
  { t: "never lets a debt go unpaid, in either direction", tags: ["crime", "wealth", "betrayal"] },
  { t: "never abandons a patient", tags: ["healing", "duty"], mercy: 0.2 },
  { t: "never trusts power that comes with no price", tags: ["learning", "tech", "order"] },
  { t: "never sells out a friend, whatever the price", tags: ["betrayal", "family", "crime"] },
];

export const BREAKING_POINTS = [
  { t: "if someone {they} love{s} were in danger", tags: ["family", "loss"] },
  { t: "for enough money to never be poor again", tags: ["poverty", "wealth"] },
  { t: "to keep {their} past buried", tags: ["secrecy", "crime"] },
  { t: "if the law itself became the threat", tags: ["order", "duty"] },
  { t: "for revenge on whoever betrayed {them}", tags: ["betrayal", "violence"] },
  { t: "if {their} faith demanded it", tags: ["faith"] },
  { t: "to save more lives than it cost", tags: ["healing", "duty", "learning"] },
  { t: "if {they} {was} sure no one would ever know", tags: ["secrecy", "ambition"] },
];

// =====================================================================
// Expanded content (v0.4). Added in bulk to cut repetition. Same format as
// the tables above; these are appended to them at load time.
// =====================================================================

TRAITS.push(
  { t: "ambitious", tags: ["ambition", "wealth"] },
  { t: "gentle", tags: ["healing", "family"], good: 1, opp: "ruthless" },
  { t: "sly", tags: ["crime", "secrecy"], law: -1, opp: "honest" },
  { t: "earnest", tags: ["faith", "duty"], opp: "sly" },
  { t: "grumpy", tags: ["isolation", "craft"], opp: "cheerful" },
  { t: "playful", tags: ["art", "chaos"], opp: "solemn" },
  { t: "solemn", tags: ["faith", "loss"], opp: "playful" },
  { t: "brave", tags: ["violence", "duty"], opp: "timid" },
  { t: "timid", tags: ["poverty", "isolation"], opp: "brave" },
  { t: "nosy", tags: ["secrecy", "learning"], opp: "discreet" },
  { t: "discreet", tags: ["secrecy", "order"], opp: "nosy" },
  { t: "sentimental", tags: ["family", "loss", "art"] },
  { t: "practical", tags: ["craft", "poverty"], opp: "dreamy" },
  { t: "dreamy", tags: ["art", "travel"], opp: "practical" },
  { t: "jealous", tags: ["betrayal", "ambition"] },
  { t: "forgiving", tags: ["healing", "faith"], good: 1, opp: "vengeful" },
  { t: "prickly", tags: ["isolation", "betrayal"] },
  { t: "competitive", tags: ["ambition", "violence"] },
  { t: "methodical", tags: ["order", "learning", "tech"], law: 1, opp: "impulsive" },
  { t: "superstitious", tags: ["faith", "wild"], opp: "skeptical" },
  { t: "skeptical", tags: ["learning", "tech"], opp: "superstitious" },
  { t: "flirtatious", tags: ["art", "chaos"], opp: "shy" },
  { t: "shy", tags: ["isolation", "art"], opp: "gregarious" },
  { t: "bossy", tags: ["order", "ambition"], law: 1 },
  { t: "easygoing", tags: ["travel", "family"], opp: "prickly" },
  { t: "honest", tags: ["duty", "faith"], good: 1, opp: "sly" },
  { t: "manipulative", tags: ["crime", "ambition", "secrecy"], good: -1, opp: "honest" },
  { t: "hot-headed", tags: ["violence", "chaos"], law: -1, opp: "patient" },
  { t: "resourceful", tags: ["poverty", "craft", "wild"] },
  { t: "weary", tags: ["loss", "duty"] },
  { t: "hopeful", tags: ["faith", "family"], opp: "cynical" },
  { t: "bookish", tags: ["learning", "isolation"] },
  { t: "kind", tags: ["healing", "family"], good: 1, opp: "ruthless" },
  { t: "spiteful", tags: ["betrayal", "violence"], good: -1, opp: "forgiving" },
  { t: "obsessive", tags: ["craft", "learning", "ambition"] },
  { t: "devoted", tags: ["family", "faith", "duty"], law: 1 },
);

TEMPERAMENTS.push(
  { t: "nervous", phrase: "jumpy, quick to apologize, slow to relax", tags: ["poverty", "isolation"], voices: ["rambling", "quiet"] },
  { t: "stern", phrase: "hard to impress and harder to please", tags: ["order", "duty"], voices: ["formal", "blunt"] },
  { t: "playful", phrase: "never entirely serious, even in danger", tags: ["art", "chaos"], voices: ["chatty", "folksy"] },
  { t: "gloomy", phrase: "certain the worst is coming, and usually right", tags: ["loss", "betrayal"], voices: ["sardonic", "quiet"] },
  { t: "earnest", phrase: "means every word, sometimes painfully", tags: ["faith", "duty", "family"], voices: ["formal", "plainspoken"] },
  { t: "restless", phrase: "always halfway out the door", tags: ["travel", "chaos"], voices: ["chatty", "terse"] },
  { t: "serene", phrase: "calm in a way that took years to earn", tags: ["faith", "healing", "wild"], voices: ["gentle", "measured"] },
);

const VOICE_EXTRA = {
  measured: {
    habits: ["steeples {their} fingers while listening", "answers a question with a careful summary of it first", "never uses a word {they} {does}n't know"],
    lines: [
      "There are two ways to read this. I'd like to be sure before I pick one.",
      "Anger is expensive. I prefer to spend it on purpose.",
      "Tell me what happened in order. Leave nothing out, even the parts that embarrass you.",
      "I don't doubt you. I'd simply like to doubt the situation for a little while longer.",
      "Slowly is still a speed.",
    ],
  },
  plainspoken: {
    habits: ["spits before making a promise", "calls weather by its local name", "won't say a word in front of strangers until fed"],
    lines: [
      "Roof's leaking, horse is lame, and now you. Fine. Sit.",
      "Folks round here don't ask questions. That's how they get old.",
      "I'm not clever. I'm just still here.",
      "Work's work. Doesn't care how you feel about it.",
      "Say it plain or don't say it.",
    ],
  },
  blunt: {
    habits: ["points with {their} chin", "repeats an insult back word for word", "answers compliments with silence"],
    lines: [
      "That's a bad plan. I'll still help, but it's bad.",
      "I don't like you. That's not the same as not trusting you.",
      "You want sympathy, find a priest.",
      "Stop talking. You're making it worse.",
      "Yes, I'm angry. No, it's not about you. Mostly.",
    ],
  },
  theatrical: {
    habits: ["bows slightly when introduced", "quotes lines from plays nobody else has seen", "lowers {their} voice for the important part"],
    lines: [
      "Picture it: rain, a locked door, and me, magnificent as ever.",
      "I've died twice on stage and once for real. Only the stage deaths got applause.",
      "Oh, you poor dear. You thought this was a quiet evening.",
      "Exits are my specialty. Entrances, I'm still working on.",
      "Every disaster needs a narrator. I volunteer.",
    ],
  },
  terse: {
    habits: ["nods instead of saying yes", "stops talking mid-sentence when bored", "signs notes with one initial"],
    lines: ["Done.", "Wrong door.", "Maybe. Pay first.", "Not tonight.", "I saw. I'm not telling."],
  },
  chatty: {
    habits: ["tells strangers {their} life story within minutes", "fills every silence", "names {their} tools and animals"],
    lines: [
      "Oh, I know that look. That's a 'something went wrong' look. Tell me everything.",
      "You'll never guess who I saw at the market. Well, you might. Guess.",
      "I'm not nosy, I'm interested. There's a difference. A small one.",
      "Did you know there's a song about this exact road? No? I'll sing it.",
      "Sorry, sorry, I'll let you talk. After this one thing.",
    ],
  },
  precise: {
    habits: ["dates every note {they} write{s}", "corrects {their} own estimates aloud", "uses full names, always"],
    lines: [
      "Eleven minutes late. I won't mention it again. I've noted it.",
      "Probably isn't a plan. Give me a number.",
      "The lock is new. The door is old. One of those will fail first.",
      "You have three questions. I'll answer two.",
      "I'm not worried. I've calculated how worried to be, and it's moderately.",
    ],
  },
  sardonic: {
    habits: ["applauds slowly at bad ideas", "calls everyone 'friend' in a tone that suggests otherwise", "sighs before good news, too"],
    lines: [
      "Ah, a heroic plan. My favorite kind to survive.",
      "No, please, keep explaining. I love this part.",
      "Optimism. How quaint.",
      "If it's any comfort, I expected worse. Not much worse.",
      "Look at that. Things got worse. Who could have predicted it. Me. I predicted it.",
    ],
  },
  rambling: {
    habits: ["counts on {their} fingers and loses count", "starts sentences with 'Anyway'", "remembers the end of the story first"],
    lines: [
      "Anyway, the point is, never trust a goat. Or a priest. Or was it a priest's goat?",
      "I had a dream like this once. Not exactly like this. There was more soup.",
      "Where was I? Right, the fire. Before that, the wedding. Before that, also a fire.",
      "It's simple, really, once you know the whole story, which takes about an hour.",
      "Sorry, what was the question? It was a good question. I liked it.",
    ],
  },
  gentle: {
    habits: ["kneels to talk to children", "offers food before advice", "says people's names softly"],
    lines: [
      "Whatever you did, you're still welcome at my table.",
      "Breathe first. Then we'll fix what can be fixed.",
      "You've been brave long enough today. Let someone else carry it.",
      "I won't lie to you. But I'll stay while you hear it.",
      "Some things don't heal. You learn to carry them more gently.",
    ],
  },
};
for (const [style, extra] of Object.entries(VOICE_EXTRA)) {
  VOICES[style].habits.push(...extra.habits);
  VOICES[style].lines.push(...extra.lines);
}
Object.assign(VOICES, {
  formal: {
    desc: "formally, with old-fashioned courtesy",
    habits: ["uses titles, never first names", "apologizes before disagreeing", "stands when others enter", "folds {their} hands while speaking", "never contracts a word"],
    lines: [
      "I must respectfully decline. Twice, if you insist on asking again.",
      "It would be my honor. It would also be extremely dangerous.",
      "Forgive me. I was raised to finish what I start.",
      "One does not leave a guest in the rain, whatever they may have done.",
      "I am not angry. I am disappointed, which is considerably worse.",
      "Please, sit. We shall discuss your betrayal like civilized people.",
    ],
  },
  quiet: {
    habits: ["speaks so softly people lean in", "goes silent when lied to", "answers with a look first", "waits until the room empties to say the real thing", "writes things down rather than say them"],
    lines: [
      "I heard. I always hear.",
      "Not here. Later, when it's just us.",
      "You don't have to shout. I'm listening.",
      "I knew before you said it.",
      "Some things are better said once and never again.",
      "Don't. Please.",
    ],
  },
  folksy: {
    habits: ["has a proverb for everything", "calls younger people 'kid'", "measures distance in meals", "talks about the weather as if it were a person", "remembers everyone's grandmother"],
    lines: [
      "Well, that's a horse of a different color, and it's kicking.",
      "My mother always said trouble comes in threes, and she was trouble one through three.",
      "Can't plow a field by turning it over in your mind.",
      "Sit a spell. Nothing out there that won't be there in an hour.",
      "If you're gonna be dumb, you gotta be tough. You look tough.",
      "Ain't my first barn fire, kid.",
    ],
  },
});

QUIRKS.push(
  { t: "names every animal on sight", tags: ["wild", "family"] },
  { t: "keeps {their} hair cut short with {their} own knife", tags: ["violence", "isolation"] },
  { t: "can't walk past a musician without leaving {coin}", tags: ["art", "poverty"] },
  { t: "collects keys to locks {they} {has} never found", tags: ["secrecy", "travel"] },
  { t: "eats dessert first, always", tags: ["chaos", "art"] },
  { t: "talks in {their} sleep, in a language nobody recognizes", tags: ["secrecy", "loss"] },
  { t: "keeps a pressed flower in every book {they} own{s}", tags: ["loss", "art"] },
  { t: "sharpens things when anxious", tags: ["violence", "craft"] },
  { t: "can't resist a dare", tags: ["chaos", "ambition"] },
  { t: "keeps meticulous accounts of every favor owed", tags: ["order", "wealth"] },
  { t: "hates having {their} back to anyone, even friends", tags: ["betrayal", "violence"] },
  { t: "sings to plants", tags: ["wild", "art"] },
  { t: "salutes the dead, even strangers", tags: ["duty", "loss"] },
  { t: "touches every doorframe {they} pass{es} through", tags: ["faith", "order"] },
  { t: "always carries a spare meal for someone else", tags: ["poverty", "healing"] },
  { t: "refuses to say goodbye, only 'later'", tags: ["loss", "travel"] },
  { t: "writes {their} name in every place {they} {has} slept", tags: ["travel", "isolation"] },
  { t: "is always slightly too warmly dressed", tags: ["poverty", "isolation"] },
  { t: "keeps a tally of near-death experiences, currently at nine", tags: ["violence", "chaos"] },
  { t: "can identify any {drink} by smell", tags: ["craft", "art"] },
  { t: "hums war songs while cooking", tags: ["violence", "family"] },
  { t: "can't stand an untidy table", tags: ["order", "craft"] },
  { t: "gives terrible nicknames and refuses to explain them", tags: ["art", "chaos"] },
  { t: "checks the exits before checking the menu", tags: ["crime", "secrecy"] },
  { t: "reads the last page of a book first", tags: ["learning", "chaos"] },
  { t: "keeps a small jar of soil from home", tags: ["family", "travel"] },
  { t: "feeds stray cats, then denies it", tags: ["wild", "secrecy"] },
  { t: "argues with {their} own reflection", tags: ["isolation", "chaos"] },
  { t: "folds {their} clothes with military precision", tags: ["duty", "order"] },
  { t: "keeps a list of the worst meals {they} {has} ever eaten", tags: ["travel", "art"] },
  { t: "won't eat anything {they} can't name", tags: ["order", "isolation"] },
  { t: "carves small figures out of scrap", tags: ["craft", "art"] },
  { t: "blows on dice before every roll, including other people's", tags: ["chaos", "crime"] },
  { t: "always knows the time without looking", tags: ["order", "duty"] },
  { t: "sleeps sitting up", tags: ["violence", "isolation"] },
  { t: "has a laugh far louder than {their} voice", tags: ["art", "family"] },
  { t: "can't keep a secret about birthdays", tags: ["family", "chaos"] },
  { t: "practices {their} signature on scraps of paper", tags: ["ambition", "crime"] },
  { t: "keeps old letters tied with string, unopened", tags: ["loss", "secrecy"] },
  { t: "quotes {their} grandmother as if she were scripture", tags: ["family", "faith"] },
  { t: "keeps every promise, but only to the letter", tags: ["order", "crime"] },
  { t: "eats standing up", tags: ["duty", "poverty"] },
  { t: "can't sit still through a sermon or speech", tags: ["chaos", "faith"] },
  { t: "studies maps the way other people read stories", tags: ["learning", "travel"] },
  { t: "tips far too much", tags: ["wealth", "poverty"] },
  { t: "keeps a lucky charm {they} openly admit{s} doesn't work", tags: ["faith", "chaos"] },
  { t: "whistles when lying", tags: ["crime", "secrecy"] },
  { t: "brings flowers to people {they} {has} wronged", tags: ["betrayal", "healing"] },
  { t: "keeps {their} boots on indoors, just in case", tags: ["violence", "travel"] },
  { t: "can't pass a market without haggling for something useless", tags: ["wealth", "craft"] },
);

FLAWS.push(
  { t: "picks fights with people above {their} station", tags: ["poverty", "violence", "order"] },
  { t: "can't say no to a friend in trouble", tags: ["family", "healing"] },
  { t: "makes promises {they} can't keep", tags: ["family", "chaos"] },
  { t: "gambles when {they} should be saving", tags: ["chaos", "poverty", "crime"] },
  { t: "sulks for days after losing an argument", tags: ["ambition", "isolation"] },
  { t: "tells people what they want to hear", tags: ["art", "crime"] },
  { t: "assumes {they} {is} always the cleverest one present", tags: ["learning", "ambition"] },
  { t: "panics when plans change", tags: ["order", "learning"] },
  { t: "lets other people take credit, then resents it", tags: ["craft", "betrayal"] },
  { t: "trusts rules more than people", tags: ["order", "duty"] },
  { t: "trusts {their} gut over evidence, every time", tags: ["faith", "wild"] },
  { t: "talks too much when nervous", tags: ["art", "poverty"] },
  { t: "keeps people at arm's length", tags: ["isolation", "loss"] },
  { t: "can't let an insult pass", tags: ["violence", "ambition"] },
  { t: "romanticizes the past", tags: ["loss", "family", "art"] },
  { t: "steals small things without thinking", tags: ["crime", "poverty"] },
  { t: "drinks to be brave", tags: ["violence", "loss"] },
  { t: "judges people by their shoes", tags: ["wealth", "order"] },
  { t: "won't admit to being hurt", tags: ["duty", "violence"] },
  { t: "forgets people who aren't useful", tags: ["ambition", "wealth"] },
  { t: "is proud of {their} own stubbornness", tags: ["craft", "family"] },
  { t: "is jealous of anyone with an easy life", tags: ["poverty", "betrayal"] },
  { t: "punishes {themself} harder than anyone else could", tags: ["faith", "loss", "duty"] },
  { t: "needs everyone to like {them}", tags: ["art", "family"] },
  { t: "can't resist a mystery, even a dangerous one", tags: ["learning", "secrecy"] },
  { t: "treats every disagreement as a betrayal", tags: ["betrayal", "family"] },
  { t: "hides problems until they explode", tags: ["secrecy", "craft"] },
  { t: "believes {they} {is} owed something by the world", tags: ["poverty", "ambition"] },
  { t: "freezes when asked to choose", tags: ["learning", "isolation"] },
  { t: "takes risks with other people's safety", tags: ["chaos", "ambition", "violence"] },
);

FEARS.push(
  { t: "horses", tags: ["travel", "violence"] },
  { t: "being touched without warning", tags: ["violence", "isolation"] },
  { t: "hospitals and healers", tags: ["healing", "loss"] },
  { t: "heights", tags: ["travel", "wild"] },
  { t: "public speaking", tags: ["art", "isolation"] },
  { t: "dogs", tags: ["wild", "violence"] },
  { t: "storms", tags: ["wild", "loss"] },
  { t: "the sound of a key turning in a lock", tags: ["crime", "order"] },
  { t: "being in debt", tags: ["poverty", "wealth"] },
  { t: "growing old alone", tags: ["isolation", "family"] },
  { t: "forgetting {their} mother's face", tags: ["loss", "family"] },
  { t: "authority figures in uniform", tags: ["order", "crime"] },
  { t: "silence", tags: ["isolation", "art"] },
  { t: "fire spreading faster than {they} can run", tags: ["loss", "violence"] },
  { t: "being trapped underground", tags: ["isolation", "craft"] },
  { t: "letting down {their} mentor", tags: ["learning", "duty"] },
  { t: "being laughed at", tags: ["art", "ambition"] },
  { t: "dying somewhere no one will find {them}", tags: ["travel", "isolation"] },
  { t: "turning into someone cruel", tags: ["violence", "betrayal"] },
  { t: "needles", tags: ["healing"] },
  { t: "open water at night", tags: ["travel", "wild"] },
  { t: "the people {they} once worked for", tags: ["crime", "betrayal"] },
  { t: "mirrors", tags: ["secrecy", "faith"] },
  { t: "being right about something terrible", tags: ["learning", "faith"] },
  { t: "losing {their} memory", tags: ["learning", "loss", "tech"] },
  { t: "children, oddly", tags: ["family", "isolation"] },
  { t: "being ignored when it matters", tags: ["ambition", "isolation"] },
);

WANTS.push(
  // stakes 0: everyday
  { t: "to fix the leak in the roof before winter", short: "fix the roof before winter", tier: 0, tags: ["poverty", "craft"],
    why: ["because the baby keeps getting sick", "because {they} promised {their} father {they} would"] },
  { t: "to win the local contest {they} lose{s} every year", short: "finally win the yearly contest", tier: 0, tags: ["ambition", "art"],
    why: ["because the same smug rival wins every time", "because {their} mother never saw {them} win anything"] },
  { t: "to make it through a season without a fight", short: "get through a season without a fight", tier: 0, tags: ["violence", "family"],
    why: ["because the last fight nearly cost {them} {their} job", "because {they} promised someone"] },
  { t: "to earn enough to visit home", short: "save enough to visit home", tier: 0, tags: ["travel", "family", "poverty"],
    why: ["because {their} grandmother is getting old", "because {they} left on bad terms"] },
  { t: "to be taken seriously at work", short: "be taken seriously at work", tier: 0, tags: ["ambition", "craft"],
    why: ["because everyone still treats {them} like the new one", "because {they} {is} better at it than {their} boss"] },
  { t: "to make one real friend in this place", short: "make one real friend here", tier: 0, tags: ["isolation", "family"],
    why: ["because the nights are long", "because {they} {has} been here a year and still {has} no one"] },
  { t: "to retire somewhere quiet", short: "retire somewhere quiet", tier: 0, tags: ["travel", "wealth"],
    why: ["because {their} knees have had enough", "because {they} {has} seen enough noise for a lifetime"] },
  { t: "to learn to read", short: "learn to read", tier: 0, tags: ["learning", "poverty"],
    why: ["because {they} {is} tired of pretending", "because {their} child is learning and {they} {is} determined to keep up"] },
  // stakes 1: personal
  { t: "to win back a partner {they} drove away", short: "win back the one {they} drove away", tier: 1, tags: ["family", "loss"],
    why: ["because {they} {has} finally understood what went wrong", "because the other person is about to marry someone else"] },
  { t: "to escape a dead-end life before it's too late", short: "escape a dead-end life", tier: 1, tags: ["poverty", "travel", "ambition"],
    why: ["because {their} parents never left, and regretted it", "because something in {them} is going quiet"] },
  { t: "to find the parent who abandoned {them}", short: "find the parent who left", tier: 1, tags: ["family", "loss", "secrecy"],
    why: ["because {they} {has} to know if it was {their} fault", "because a letter arrived with no return address"] },
  { t: "to be forgiven by someone {they} hurt badly", short: "earn one person's forgiveness", tier: 1, tags: ["betrayal", "healing"],
    why: ["because that person is dying", "because {they} can't forgive {themself} until then"] },
  { t: "to get out from under a criminal boss", short: "get free of a criminal boss", tier: 1, tags: ["crime", "poverty"],
    why: ["because the jobs keep getting worse", "because the boss has started asking about {their} family"] },
  { t: "to make a name in the big city", short: "make a name in the city", tier: 1, tags: ["ambition", "art", "travel"],
    why: ["because everyone back home said {they} couldn't", "because it's the only dream {they} {has} ever had"] },
  { t: "to protect a secret that would ruin {their} family", short: "protect a family secret", tier: 1, tags: ["family", "secrecy"],
    why: ["because {they} {is} the only one who knows", "because {their} sister would never recover"] },
  // stakes 2: dangerous
  { t: "to bring a murderer to justice", short: "bring a killer to justice", tier: 2, tags: ["violence", "order", "loss"],
    why: ["because the law closed the case too quickly", "because the victim was {their} friend"] },
  { t: "to steal back what was stolen from {their} people", short: "steal back what was taken from {their} people", tier: 2, tags: ["crime", "family", "betrayal"],
    why: ["because it's sitting in a rich man's vault as decoration", "because the elders are dying without it"] },
  { t: "to expose a powerful liar", short: "expose a powerful liar", tier: 2, tags: ["secrecy", "order", "betrayal"],
    why: ["because the lie has already cost lives", "because {they} helped tell it once"] },
  { t: "to find a cure for a sickness everyone else has given up on", short: "find a cure no one believes in", tier: 2, tags: ["healing", "learning"],
    why: ["because someone {they} love{s} has it", "because {they} {has} seen it beaten before"] },
  { t: "to free the people {they} once helped imprison", short: "free the people {they} helped imprison", tier: 2, tags: ["order", "betrayal", "violence"],
    why: ["because {they} finally saw the inside of those cells", "because one of them saved {their} life"] },
  // stakes 3: grand
  { t: "to end a war {they} helped start", short: "end the war {they} helped start", tier: 3, tags: ["violence", "duty", "loss"],
    why: ["because the reasons turned out to be lies", "because both sides are now burying children"] },
  { t: "to unite enemies against something worse", short: "unite old enemies against a greater threat", tier: 3, tags: ["duty", "order", "violence"],
    why: ["because no one else has seen what's coming", "because {they} {has} friends on both sides"] },
  { t: "to reclaim a stolen birthright", short: "reclaim a stolen birthright", tier: 3, tags: ["family", "wealth", "order"],
    why: ["because {their} uncle took it the night {their} parents died", "because the people are suffering under the usurper"] },
  { t: "to rebuild a destroyed order or guild", short: "rebuild a fallen order", tier: 3, tags: ["duty", "faith", "craft"],
    why: ["because {they} {is} its last true member", "because its oath still binds {them}"] },
  // stakes 4: world-scale
  { t: "to seal away an ancient evil before it fully wakes", short: "seal away an ancient evil", tier: 4, tags: ["faith", "duty", "violence"],
    why: ["because {they} {has} heard it whispering", "because the last seal was broken by {their} own family"] },
  { t: "to change the fate written for {them} before {they} {was} born", short: "rewrite {their} written fate", tier: 4, tags: ["faith", "chaos", "family"],
    why: ["because the prophecy ends with {them} destroying everything", "because {they} {is} no one's instrument"] },
  { t: "to free {their} people from a centuries-old bondage", short: "free {their} people from bondage", tier: 4, tags: ["order", "violence", "family"],
    why: ["because {they} {is} the first to slip the chains", "because the old songs say one of them would"] },
  { t: "to find the last door out of a dying world", short: "find a way out of a dying world", tier: 4, tags: ["travel", "loss", "learning"],
    why: ["because the end has a date now", "because {they} {has} seen the other side in dreams"] },
);

TURNING_POINTS.push(
  { t: "the day {they} chose a stranger over family", tags: ["family", "betrayal"] },
  { t: "a long illness that gave {them} time to think", tags: ["healing", "isolation"] },
  { t: "an apprenticeship that ended badly", tags: ["craft", "learning", "betrayal"] },
  { t: "winning something {they} didn't deserve", tags: ["ambition", "wealth"] },
  { t: "losing a fortune in a single night", tags: ["wealth", "chaos", "poverty"] },
  { t: "a year spent on the road with no plan", tags: ["travel", "chaos"] },
  { t: "a vow taken too young", tags: ["faith", "duty"] },
  { t: "breaking a vow and getting away with it", tags: ["faith", "secrecy"] },
  { t: "an unexpected inheritance", tags: ["family", "wealth"] },
  { t: "the night {they} watched someone {they} admired do something unforgivable", tags: ["betrayal", "violence"] },
  { t: "falling in love with the wrong person", tags: ["family", "chaos"] },
  { t: "getting caught, and being let go", tags: ["crime", "faith"] },
  { t: "an argument {they} won and have regretted ever since", tags: ["family", "loss"] },
  { t: "a job that paid too well", tags: ["crime", "wealth"] },
  { t: "a book that changed everything {they} believed", tags: ["learning", "faith"] },
  { t: "the birth of a child who isn't {theirs}", tags: ["family", "secrecy"] },
  { t: "surviving something that killed better people", tags: ["violence", "loss"] },
  { t: "being chosen over someone more deserving", tags: ["ambition", "duty"] },
  { t: "a homecoming that went wrong", tags: ["family", "travel", "loss"] },
  { t: "realizing {their} hero was a fraud", tags: ["betrayal", "learning"] },
);

LIES.push(
  { lie: "I don't need anyone.", need: "to let people in", never: "Stay.", tags: ["isolation", "loss"] },
  { lie: "Love always ends in loss.", need: "to choose love anyway", never: "I love you.", tags: ["loss", "family"] },
  { lie: "I'm too old to change.", need: "to begin again", never: "I'd like to try something new.", tags: ["loss", "craft"] },
  { lie: "Money solves everything.", need: "to value what can't be bought", never: "Keep the money.", tags: ["wealth", "poverty"] },
  { lie: "I am what my father made me.", need: "to become {their} own person", never: "I'm nothing like him.", tags: ["family", "violence"] },
  { lie: "If I'm perfect, I'll be safe.", need: "to accept failing", never: "I made a mistake.", tags: ["order", "ambition"] },
  { lie: "Nobody could love the real me.", need: "to be seen and stay anyway", never: "This is who I really am.", tags: ["secrecy", "isolation"] },
  { lie: "The past can be fixed.", need: "to let the past go", never: "It's over.", tags: ["loss", "family"] },
  { lie: "Only the strong survive.", need: "to protect the weak", never: "I'll carry you.", tags: ["violence", "poverty"] },
  { lie: "I owe everyone everything.", need: "to set down debts that were never {theirs}", never: "No.", tags: ["duty", "family"] },
  { lie: "Talent is all that matters.", need: "to value the work over the gift", never: "I had help.", tags: ["art", "ambition"] },
  { lie: "Revenge will make it stop hurting.", need: "to grieve instead of hunt", never: "I forgive you.", tags: ["betrayal", "violence", "loss"] },
  { lie: "Home is a place I can go back to.", need: "to build a new home", never: "This is home now.", tags: ["travel", "family"] },
  { lie: "If I tell the truth, I'll lose everything.", need: "to trust the truth", never: "I lied.", tags: ["secrecy", "crime"] },
  { lie: "Knowledge is safer than feeling.", need: "to trust what {they} feel{s}", never: "I don't know, I just feel it.", tags: ["learning", "isolation"] },
  { lie: "I'm the villain of this story.", need: "to believe {they} can be good", never: "I deserve this.", tags: ["violence", "betrayal", "faith"] },
);

ARC_TURNS.push(
  { t: "an old enemy asks {them} for help" },
  { t: "getting exactly what {they} wanted turns out to be empty" },
  { t: "the person {they} trusted most turns out to be part of the problem" },
  { t: "an easy way out appears, and it almost works on {them}" },
  { t: "the thing {they} {has} been protecting is lost" },
  { t: "a child repeats {their} worst words back to {them}" },
  { t: "{they} {is} forced to work beside the person {they} hate most" },
  { t: "the lie {they} {has} been telling becomes true" },
  { t: "{they} {is} given power over the people who hurt {them}" },
  { t: "someone dies because of a choice {they} made" },
  { t: "it turns out {they} {was} never the hero of this story" },
  { t: "home burns, and there's nowhere to go back to" },
  { t: "{they} {is} asked to make the sacrifice {they} once asked of others" },
  { t: "the secret {they} {has} kept is used against someone {they} love" },
);

HOOKS.push(
  // stakes 0: small, everyday secrets
  { t: "has been quietly stealing {coin} from {their} employer, a little at a time.", tier: 0, tags: ["crime", "poverty"] },
  { t: "is learning to read in secret, at night.", tier: 0, tags: ["learning", "poverty"] },
  { t: "writes anonymous love poems to someone {they} see every day.", tier: 0, tags: ["art", "isolation"] },
  { t: "lied about {their} age to get {their} job.", tier: 0, tags: ["crime", "ambition"] },
  { t: "is terrified of the dark and hides it well.", tier: 0, tags: ["isolation"] },
  { t: "keeps a second set of books for {their} own savings.", tier: 0, tags: ["wealth", "secrecy"] },
  { t: "has been sneaking food to a runaway child.", tier: 0, tags: ["healing", "poverty"] },
  { t: "can't actually do the job {they} {was} hired for, and is faking it.", tier: 0, tags: ["crime", "craft"] },
  { t: "still visits an ex in secret.", tier: 0, tags: ["family", "secrecy"] },
  { t: "bet {their} savings on a rumor and lost all of it.", tier: 0, tags: ["chaos", "poverty"] },
  { t: "is the one who broke the shop window last month.", tier: 0, tags: ["chaos", "crime"] },
  { t: "has a famous relative and pretends not to.", tier: 0, tags: ["family", "secrecy"] },
  // stakes 1: personal, with consequences
  { t: "is informing for {authority} on {their} neighbors.", tier: 1, tags: ["betrayal", "order"] },
  { t: "is deeply in debt to a moneylender with a temper.", tier: 1, tags: ["crime", "poverty"] },
  { t: "is having an affair with {their} employer's spouse.", tier: 1, tags: ["family", "secrecy", "betrayal"] },
  { t: "faked {their} credentials years ago and has never been caught.", tier: 1, tags: ["crime", "learning"] },
  { t: "witnessed a crime and was paid to forget it.", tier: 1, tags: ["crime", "secrecy"] },
  { t: "has a child in another town that nobody here knows about.", tier: 1, tags: ["family", "secrecy"] },
  { t: "deserted a post and has been hiding under a new name.", tier: 1, tags: ["duty", "betrayal"] },
  { t: "is slowly going blind and hiding it.", tier: 1, tags: ["healing", "loss"] },
  // stakes 2: dangerous
  { t: "is holding stolen goods for a gang that wants them back.", tier: 2, tags: ["crime", "violence"] },
  { t: "knows who really started the fire that killed eleven people.", tier: 2, tags: ["secrecy", "loss", "violence"] },
  { t: "is a spy for a rival power, and has started to like it here.", tier: 2, tags: ["secrecy", "betrayal"] },
  { t: "has a bounty on {their} head under another name.", tier: 2, tags: ["crime", "violence"] },
  { t: "killed someone in self-defense and hid the body.", tier: 2, tags: ["violence", "secrecy"] },
  { t: "is the anonymous writer of a pamphlet {authority} is desperate to silence.", tier: 2, tags: ["order", "art", "secrecy"] },
  // stakes 3: grand
  { t: "carries a map to something that rewrites history.", tier: 3, tags: ["learning", "secrecy", "travel"] },
  { t: "was once sworn to an order that everyone believes was destroyed.", tier: 3, tags: ["duty", "faith", "secrecy"] },
  { t: "holds evidence that {their} ruler murdered the last one.", tier: 3, tags: ["order", "secrecy", "violence"] },
  { t: "is the true author of a famous work credited to someone else.", tier: 3, tags: ["art", "betrayal"] },
  { t: "has been dead once already, and came back different.", tier: 3, tags: ["faith", "loss"] },
  // stakes 4: world-shaking
  { t: "is the only one who knows the war was started on purpose, and by whom.", tier: 4, tags: ["violence", "secrecy", "order"] },
  { t: "was born to be a vessel for something ancient, and can feel it stirring.", tier: 4, tags: ["faith", "chaos"] },
  { t: "remembers a world that existed before this one, and everyone else has forgotten it.", tier: 4, tags: ["loss", "learning"] },
  { t: "is a living key to a door that should never be opened.", tier: 4, tags: ["secrecy", "faith", "duty"] },
);

// Secrets built from parts, so small and medium secrets rarely repeat.
// Read as: {first name} {act} {whom}{twist}.
export const SECRET_PARTS = {
  acts: [
    { t: "has been stealing from", tier: 0 },
    { t: "has a hopeless crush on", tier: 0 },
    { t: "has been lying for years to", tier: 0 },
    { t: "secretly owes money to", tier: 0 },
    { t: "is quietly protecting", tier: 0 },
    { t: "is secretly related to", tier: 1 },
    { t: "is being blackmailed by", tier: 1 },
    { t: "is blackmailing", tier: 1 },
    { t: "forged papers for", tier: 1 },
    { t: "once took the blame for", tier: 1 },
    { t: "once saved the life of", tier: 1 },
    { t: "sold information about", tier: 2 },
    { t: "was paid to spy on", tier: 2 },
    { t: "once betrayed", tier: 2 },
    { t: "helped bury the crimes of", tier: 2 },
  ],
  whom: [
    "{their} employer", "{their} landlord", "{their} oldest friend", "a local priest", "the captain of {authority}",
    "a rival's daughter", "a rival's son", "{their} former teacher", "a stranger {they} met on the road", "the richest family in {city}",
    "{their} own sibling", "a famous performer", "the neighbor everyone avoids", "an old flame", "{their} business partner",
    "a retired soldier", "{their} best customer", "a known smuggler", "the healer down the street", "{ruler}",
  ],
  twists: [
    "", "", "", "",
    ", and is about to be found out", ", and nobody else knows", ", and doesn't regret it",
    ", and it's getting worse", ", and has started to enjoy it", ", and wants to confess",
  ],
};

RELATIONSHIP_TYPES.forEach((r) => {
  const extra = {
    Mentor: ["still sends a letter every winter, unsigned", "taught {them} a trade and a grudge", "wants {them} to take over, and {they} won't"],
    Sibling: ["borrows money and never pays it back", "is the family's favorite, and knows it", "is the only one who still calls {them} by a childhood name"],
    Rival: ["is the only person who truly understands {their} work", "spread a rumor {they} {has} never shaken", "is secretly the person {they} admire most"],
    Creditor: ["has started being friendly, which is worse", "inherited the debt from a dead partner and wants it closed", "keeps {their} grandmother's ring as collateral"],
    "Old flame": ["is getting married next month and sent an invitation", "never got the letter {they} wrote", "is raising a child with {their} eyes"],
    "Former partner": ["kept the money from their last job", "is now on the other side of the law", "still has {their} back, and that scares {them}"],
  }[r.type];
  if (extra) r.notes.push(...extra);
});
RELATIONSHIP_TYPES.push(
  { type: "Parent", tags: ["family"], notes: [
    "never approved of a single choice {they} made", "is ill and refuses to say how badly", "keeps a shrine to {them} in the old house",
    "remarried someone {they} can't stand", "taught {them} everything, including the bad habits",
  ] },
  { type: "Child", tags: ["family"], notes: [
    "is grown and barely speaks to {them}", "is far braver than {they} {was} at that age", "wants to follow in {their} footsteps, which terrifies {them}",
    "was raised by someone else", "is the only thing {they} {has} ever done right",
  ] },
  { type: "Best friend", tags: ["family", "art"], notes: [
    "has known {them} since before {they} could walk", "is the only one {they} tell the truth", "owes {them} a life and pays it back in jokes",
    "is drifting away, and neither of them will mention it", "would bury a body for {them}, no questions",
  ] },
  { type: "Enemy", tags: ["violence", "betrayal"], notes: [
    "swore to ruin {them} and is patient about it", "was once {their} closest ally", "has never forgiven {them} for a single sentence",
    "is respected by everyone who doesn't know the truth", "is dying, and wants to make peace",
  ] },
  { type: "Protégé", tags: ["learning", "craft", "duty"], notes: [
    "is better than {them} already", "worships {them}, which is a heavy thing to carry", "is learning the wrong lessons from {them}",
    "was taken in off the street", "will soon be good enough to leave",
  ] },
  { type: "Patron", tags: ["wealth", "ambition", "art"], notes: [
    "pays well and asks strange favors", "wants {their} loyalty more than {their} work", "is quietly losing everything",
    "has a dangerous rival who has noticed {them}", "has never once said thank you",
  ] },
);

PARTY_HOOKS.push(
  "is being hunted and offers good pay for bodyguards.",
  "knows a shortcut through dangerous ground, and wants a share of whatever is found.",
  "mistakes one of the party for someone else, and won't let it go.",
  "needs witnesses for something {they} {is} about to do.",
  "has a map, half of one, and needs the other half.",
  "asks the party to deliver a message {they} can't deliver {themself}.",
  "is the only person who can translate what the party just found.",
  "saved one of the party's lives once, and has come to collect.",
  "is looking for a missing friend, and the trail leads where the party is going.",
  "wants to join, and is very persistent about it.",
  "knows something about one of the party's pasts.",
  "needs help moving something heavy, valuable and very illegal.",
  "has been robbed by the same people the party is after.",
  "offers the party a job that sounds too easy.",
);

MORAL_LINES.push(
  { t: "never hurts an animal", tags: ["wild", "healing"], mercy: 0 },
  { t: "never breaks bread with a liar", tags: ["betrayal", "faith"] },
  { t: "never fights unarmed opponents", tags: ["violence", "duty"], mercy: 0 },
  { t: "never steals from the dead", tags: ["faith", "crime"] },
  { t: "never turns away someone who is hungry", tags: ["poverty", "healing"], mercy: 0.2 },
  { t: "never testifies against {their} own people", tags: ["family", "crime"] },
  { t: "never works for {ruler}", tags: ["order", "chaos"], order: -0.2 },
  { t: "never uses poison", tags: ["violence", "healing"] },
  { t: "never lies under oath", tags: ["order", "faith"], order: 0.2 },
  { t: "never lets a guest come to harm under {their} roof", tags: ["family", "duty"] },
  { t: "never sells a person", tags: ["crime", "order"], mercy: 0 },
  { t: "never strikes first", tags: ["violence", "faith"], mercy: 0.1 },
  { t: "never forgives a betrayal", tags: ["betrayal", "violence"], mercy: -0.2 },
  { t: "never takes a life for money", tags: ["crime", "violence"], mercy: 0 },
);

BREAKING_POINTS.push(
  { t: "to save a child", tags: ["family", "healing"] },
  { t: "if it meant going home again", tags: ["travel", "family"] },
  { t: "for a chance at the one thing {they} {has} always wanted", tags: ["ambition"] },
  { t: "if {their} mentor asked", tags: ["learning", "duty"] },
  { t: "to stop a war", tags: ["violence", "duty"] },
  { t: "if {they} {was} cornered with no other way out", tags: ["violence", "crime"] },
  { t: "if the truth about {them} came out", tags: ["secrecy", "betrayal"] },
  { t: "to protect a stranger who reminds {them} of {themself}", tags: ["loss", "healing"] },
  { t: "for love", tags: ["family", "chaos"] },
  { t: "if someone mocked {their} family", tags: ["family", "violence"] },
  { t: "if {they} {was} drunk enough", tags: ["chaos", "loss"] },
  { t: "to save the place {they} grew up", tags: ["family", "poverty"] },
);

FLAWS.push(
  { t: "can't keep a secret", tags: ["art", "family"] },
  { t: "is cruel when cornered", tags: ["violence", "betrayal"] },
  { t: "never finishes what {they} start{s}", tags: ["chaos", "art"] },
  { t: "is too proud to apologize", tags: ["ambition", "family"] },
  { t: "hears criticism even in praise", tags: ["ambition", "loss"] },
  { t: "takes on every problem alone", tags: ["isolation", "duty"] },
  { t: "is late to everything that matters", tags: ["chaos"] },
  { t: "sees enemies everywhere", tags: ["betrayal", "secrecy"] },
  { t: "is too blunt to be kind", tags: ["violence", "craft"] },
  { t: "can be bought, for the right price", tags: ["wealth", "crime"] },
  { t: "gets bored with people quickly", tags: ["travel", "art"] },
  { t: "clings to people who are leaving", tags: ["family", "loss"] },
  { t: "worships the wrong heroes", tags: ["ambition", "faith"] },
  { t: "says yes to everything and does half of it", tags: ["family", "chaos"] },
  { t: "keeps old wounds open on purpose", tags: ["loss", "betrayal"] },
  { t: "is petty about small things", tags: ["order", "ambition"] },
  { t: "plays favorites", tags: ["family", "order"] },
  { t: "refuses to learn from anyone younger", tags: ["learning", "order"] },
  { t: "bottles everything up until it explodes", tags: ["violence", "secrecy"] },
  { t: "mistakes control for care", tags: ["order", "family"] },
);
