// Modern-day tables. Original Castmaker content — CC BY 4.0.

const anyCulture = ["american", "latino", "westafrican", "southasian", "eastasian", "easteuro", "arabic", "quebecois"];

export default {
  id: "modern",
  label: "Modern",
  vocab: { coin: "cash", drink: "coffee", package: "sealed envelope", messages: "texts", city: "the city" },

  cultures: {
    american: { people: "human", first: ["Danny", "Kayla", "Marcus", "Jenna", "Travis", "Brooke", "Cody", "Megan", "Darnell", "Tasha"], last: ["Miller", "Hayes", "Brooks", "Carter", "Sullivan", "Parker", "Reed", "Walsh"] },
    latino: { people: "human", first: ["Mateo", "Lucía", "Diego", "Camila", "Javier", "Valeria", "Rafael", "Ximena"], last: ["Ortiz", "Delgado", "Reyes", "Castillo", "Navarro", "Fuentes", "Medina"] },
    westafrican: { people: "human", first: ["Kwame", "Adaeze", "Tunde", "Abena", "Chidi", "Folake", "Kofi", "Ngozi"], last: ["Mensah", "Okafor", "Adeyemi", "Boateng", "Eze", "Owusu"] },
    southasian: { people: "human", first: ["Arjun", "Priya", "Rohan", "Ananya", "Imran", "Kavya", "Sanjay", "Nisha"], last: ["Sharma", "Patel", "Iyer", "Khan", "Reddy", "Malhotra"] },
    eastasian: { people: "human", first: ["Kenji", "Mei", "Daniel", "Yuna", "Hao", "Soo-ah", "Wei", "Akiko"], last: ["Tanaka", "Chen", "Park", "Nguyen", "Lin", "Kim", "Watanabe"] },
    easteuro: { people: "human", first: ["Pavel", "Katya", "Tomasz", "Irina", "Luka", "Milena", "Andrei", "Zofia"], last: ["Novak", "Kowalski", "Petrov", "Horvat", "Dragan", "Wójcik"] },
    arabic: { people: "human", first: ["Omar", "Layla", "Karim", "Yasmin", "Tariq", "Nour", "Samir", "Rania"], last: ["Haddad", "Nasser", "Saleh", "Mansour", "Khoury", "Aziz"] },
    quebecois: { people: "human", first: ["Mathieu", "Élodie", "Julien", "Camille", "Antoine", "Sophie", "Gabriel", "Maude"], last: ["Tremblay", "Gagnon", "Roy", "Bouchard", "Côté", "Lavoie"] },
  },

  peoples: { human: { label: "human", age: [19, 68] } },

  origins: [
    { t: "a mill town that lost its mill", short: "the mill town", cultures: anyCulture, tags: ["poverty", "family", "craft"] },
    { t: "a high-rise apartment above a loud, crowded city", short: "the city", cultures: anyCulture, tags: ["ambition", "crime", "art"] },
    { t: "a farming county where everyone knows your business", short: "the county", cultures: anyCulture, tags: ["family", "wild", "duty"] },
    { t: "a string of military bases", short: "a string of military bases", cultures: anyCulture, tags: ["duty", "order", "travel"] },
    { t: "a coastal fishing town", short: "the coast", cultures: anyCulture, tags: ["family", "travel", "loss"] },
    { t: "a quiet suburb with a lot of locked doors", short: "the suburbs", cultures: anyCulture, tags: ["secrecy", "wealth", "family"] },
    { t: "a university town", short: "the college town", cultures: anyCulture, tags: ["learning", "art"] },
    { t: "a border city", short: "the border", cultures: anyCulture, tags: ["travel", "crime"] },
  ],

  upbringings: [
    { t: "with a single mother who worked two jobs and still made every school play", tags: ["family", "poverty", "duty"] },
    { t: "in foster care, four homes in six years", tags: ["isolation", "poverty"] },
    { t: "in a big, loud, religious family", tags: ["faith", "family"] },
    { t: "in a wealthy family that cared more about appearances than people", tags: ["wealth", "secrecy"] },
    { t: "above the family restaurant", tags: ["family", "craft"] },
    { t: "mostly raised by a grandparent", tags: ["family", "loss"] },
    { t: "in a house where nobody talked about the drinking", tags: ["secrecy", "family", "violence"] },
    { t: "as the gifted kid everyone expected great things from", tags: ["learning", "ambition"] },
  ],

  occupations: [
    { t: "an ER nurse", tags: ["healing", "duty"], arch: ["healer"], skills: ["triage under pressure", "staying calm with angry people"] },
    { t: "a line cook", tags: ["craft", "poverty"], arch: ["warrior", "face"], skills: ["knife work", "surviving a twelve-hour shift"] },
    { t: "a public defender", tags: ["order", "duty", "poverty"], arch: ["face", "sage"], skills: ["cross-examination", "finding loopholes"] },
    { t: "a paramedic", tags: ["healing", "violence"], arch: ["healer", "warrior"], skills: ["emergency medicine", "driving fast and safely"] },
    { t: "a high school teacher", tags: ["learning", "family"], arch: ["sage", "face"], skills: ["handling a room", "spotting a kid in trouble"] },
    { t: "a bartender", tags: ["art", "crime"], arch: ["face"], skills: ["reading people", "ending fights before they start"] },
    { t: "an investigative reporter", tags: ["secrecy", "learning"], arch: ["sage", "skulker"], skills: ["records research", "getting people to talk"] },
    { t: "a private investigator", tags: ["secrecy", "crime"], arch: ["skulker"], skills: ["surveillance", "skip tracing"] },
    { t: "a software engineer", tags: ["tech", "learning"], arch: ["sage", "caster"], skills: ["coding", "taking systems apart"] },
    { t: "a mechanic", tags: ["craft", "tech"], arch: ["warrior", "sage"], skills: ["engine repair", "improvising tools"] },
    { t: "a small-time con artist", tags: ["crime", "art"], arch: ["face", "skulker"], skills: ["the long con", "fake accents"] },
    { t: "a police detective", tags: ["order", "violence", "secrecy"], arch: ["warrior", "sage"], skills: ["interrogation", "procedure"] },
    { t: "a social worker", tags: ["healing", "family", "duty"], arch: ["healer", "face"], skills: ["crisis counseling", "navigating bureaucracy"] },
    { t: "a session musician", tags: ["art", "travel"], arch: ["face"], skills: ["sight-reading", "playing any room"] },
    { t: "a long-haul trucker", tags: ["travel", "isolation"], arch: ["wild", "warrior"], skills: ["driving through anything", "staying awake"] },
    { t: "a youth pastor", tags: ["faith", "family"], arch: ["healer", "face"], skills: ["public speaking", "getting teenagers to talk"] },
    { t: "a security consultant who used to be a burglar", tags: ["crime", "tech"], arch: ["skulker", "caster"], skills: ["alarm systems", "lockpicking"] },
  ],

  events: [
    { t: "{their} younger brother overdosed, and {they} {was} the one who found him", short: "{their} brother's overdose", tags: ["loss", "family", "healing"], wound: "finding him too late" },
    { t: "{they} testified against someone dangerous and had to move cities", short: "the testimony", tags: ["crime", "secrecy", "violence"], wound: "losing a whole life for doing the right thing" },
    { t: "the family business went bankrupt after a partner stole from it", short: "the bankruptcy", tags: ["betrayal", "wealth", "family"], wound: "watching {their} parents' life's work disappear" },
    { t: "{they} caused a car accident that left a friend unable to walk", short: "the accident", tags: ["violence", "loss"], wound: "ruining someone else's life in a single second" },
    { t: "{they} {was} accepted to a top school and couldn't afford to go", short: "the lost scholarship", tags: ["poverty", "ambition", "learning"], wound: "being good enough and it not mattering" },
    { t: "a fire destroyed {their} childhood home and everything in it", short: "the house fire", tags: ["loss", "family"], wound: "losing every photograph of the people {they} loved" },
    { t: "{their} parents divorced and each asked {them} to spy on the other", short: "the divorce", tags: ["family", "betrayal", "secrecy"], wound: "being used as a weapon by the people who should have protected {them}" },
    { t: "{they} served overseas and came back with fewer friends than {they} left with", short: "the deployment", tags: ["violence", "duty", "loss"], wound: "coming home when others didn't" },
    { t: "a viral video made {them} briefly and horribly famous", short: "the video", tags: ["art", "isolation"], wound: "being judged by millions for one bad moment" },
  ],

  appearance: {
    builds: ["wiry", "broad-shouldered", "slight", "heavyset", "tall and stooped", "compact and strong", "lanky", "soft-bodied but quick"],
    features: ["a fitness-tracker tan line on one wrist", "reading glasses pushed up into {their} hair", "a faded tattoo {they} {is} clearly embarrassed by", "a phone with a badly cracked screen, always in hand", "a badly set nose", "a streak of grey through dark hair", "bitten-down nails", "a burn scar along one forearm", "a gap-toothed smile", "freckles everywhere"],
    styles: ["work boots and a flannel shirt", "a suit that cost too much and fits too well", "scrubs under a hoodie", "band T-shirts older than some of the bands", "athleisure, always", "thrift-store vintage chosen with real care"],
    items: ["a cheap ring that never leaves {their} finger", "a dog-eared paperback", "a keychain from a motel that no longer exists", "a dented thermos", "a phone full of voice memos", "a lighter, though {they} quit smoking", "a lucky poker chip", "a worn baseball cap from a team that moved away"],
  },

  combat: {
    warrior: ["boxing and bad decisions", "whatever's heavy and nearby"],
    skulker: ["avoids the fight, wins the chase", "a taser and an exit plan"],
    caster: ["kills the lights, kills the cameras", "fights through a laptop"],
    face: ["de-escalation, then a cheap shot", "gets someone else to throw the punch"],
    healer: ["keeps people alive until help arrives", "pepper spray and a tourniquet"],
    sage: ["knows who to call", "plans the ambush, doesn't spring it"],
    wild: ["a shotgun, mostly for show", "a hunting rifle and the patience of a stone"],
  },
  abilities: {
    warrior: ["handles {themself} in a brawl", "reads a room for threats"],
    skulker: ["picks locks", "tails people unnoticed"],
    caster: ["gets into most computer systems", "jury-rigs electronics"],
    face: ["talks past receptionists and bouncers", "spots a lie"],
    healer: ["first aid and trauma care", "calms panicking people"],
    sage: ["researches anything fast", "knows the law"],
    wild: ["drives anything", "survives outdoors"],
  },
};
