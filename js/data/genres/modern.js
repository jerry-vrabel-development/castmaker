// Modern-day tables. Original Castmaker content — CC BY 4.0.

const anyCulture = ["american", "latino", "westafrican", "southasian", "eastasian", "easteuro", "arabic", "quebecois"];

const G = {
  id: "modern",
  label: "Modern",
  vocab: { coin: "cash", drink: "coffee", package: "sealed envelope", messages: "texts", city: "the city", authority: "the police", ruler: "the mayor" },

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
    { t: "{their} family moved towns three times before {they} turned twelve", short: "the moves", tags: ["family", "travel"], wound: "never staying long enough to belong" },
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

  // Gifts scale with grade. Common characters have none. At Legendary, the
  // modern genre turns superhero.
  gifts: [
    { t: "can fix almost anything", tier: 1, tags: ["craft", "tech"] },
    { t: "never forgets a name", tier: 1, tags: ["art", "family"] },
    { t: "is a natural with kids and animals", tier: 1, tags: ["family", "healing"] },
    { t: "has a sharp eye for a lie", tier: 1, tags: ["secrecy"] },
    { t: "has a photographic memory", tier: 2, tags: ["learning"] },
    { t: "has perfect pitch and a voice that stops rooms", tier: 2, tags: ["art"] },
    { t: "speaks seven languages fluently", tier: 2, tags: ["learning", "travel"] },
    { t: "feels no fear, in a way doctors can't explain", tier: 2, tags: ["violence"] },
    { t: "is the best alive at one thing, and everyone in that world knows it", tier: 3, tags: ["craft", "ambition"] },
    { t: "reads people so well it looks like mind reading", tier: 3, tags: ["secrecy", "art"] },
    { t: "was trained since childhood by an order that doesn't officially exist", tier: 3, tags: ["secrecy", "violence", "duty"] },
    { t: "has a body that heals in days from injuries that take others months", tier: 3, tags: ["healing"] },
    { t: "survived a lightning strike and now hears every electrical signal nearby", tier: 4, tags: ["tech"] },
    { t: "heals from any wound overnight, and has never once been sick", tier: 4, tags: ["healing"] },
    { t: "is impossibly strong, and has hidden it since childhood", tier: 4, tags: ["violence", "secrecy"] },
    { t: "can stop time for three seconds, once a day", tier: 4, tags: ["chaos"] },
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

// ---------- Expanded content (v0.4) ----------
const more = (list, ...items) => list.push(...items);

more(G.cultures.american.first, "Austin", "Brianna", "Chase", "Destiny", "Garrett", "Holly", "Jamal", "Lacey", "Shane", "Whitney", "Ronnie", "Dolores");
more(G.cultures.american.last, "Bennett", "Coleman", "Dawson", "Fletcher", "Grant", "Jennings", "Lawson", "Pruitt", "Tucker", "Wheeler");
more(G.cultures.latino.first, "Alejandro", "Beatriz", "Emilio", "Guadalupe", "Ignacio", "Marisol", "Rodrigo", "Soledad", "Tomás", "Yesenia");
more(G.cultures.latino.last, "Aguilar", "Cervantes", "Espinoza", "Guerrero", "Morales", "Salazar", "Vargas", "Zamora");
more(G.cultures.westafrican.first, "Ama", "Babajide", "Chiamaka", "Emeka", "Ifeoma", "Kojo", "Nana", "Obinna", "Yaw", "Zainab");
more(G.cultures.westafrican.last, "Adebayo", "Asante", "Danso", "Nwosu", "Ogunleye", "Okeke", "Quaye");
more(G.cultures.southasian.first, "Aditya", "Divya", "Farhan", "Lakshmi", "Neel", "Pooja", "Ravi", "Shreya", "Vikram", "Zara");
more(G.cultures.southasian.last, "Bose", "Chatterjee", "Desai", "Gupta", "Joshi", "Nair", "Qureshi", "Rao");
more(G.cultures.eastasian.first, "Bao", "Haruki", "Jia", "Ji-ho", "Ken", "Linh", "Ming", "Sora", "Tae-yang", "Xiu");
more(G.cultures.eastasian.last, "Choi", "Hoang", "Ito", "Lee", "Ma", "Pham", "Suzuki", "Wong");
more(G.cultures.easteuro.first, "Bogdan", "Dorota", "Goran", "Jana", "Marek", "Natasha", "Radek", "Vesna", "Yuri", "Agnieszka");
more(G.cultures.easteuro.last, "Babić", "Ivanova", "Kovač", "Lewandowski", "Morozov", "Popescu", "Szabo");
more(G.cultures.arabic.first, "Amira", "Bilal", "Dina", "Faris", "Hana", "Jamil", "Leena", "Nabil", "Salma", "Youssef");
more(G.cultures.arabic.last, "Abboud", "Darwish", "Farah", "Habib", "Issa", "Nasr", "Sabbagh");
more(G.cultures.quebecois.first, "Benoît", "Chloé", "Étienne", "Geneviève", "Hugo", "Isabelle", "Louis", "Rosalie", "Simon", "Valérie");
more(G.cultures.quebecois.last, "Bélanger", "Bergeron", "Gauthier", "Lefebvre", "Morin", "Pelletier", "Thibault");

more(G.origins,
  { t: "a desert town built around a prison", short: "the prison town", cultures: anyCulture, tags: ["order", "crime", "isolation"] },
  { t: "a ski resort town that empties every spring", short: "the resort town", cultures: anyCulture, tags: ["wealth", "isolation"] },
  { t: "a river delta parish", short: "the delta", cultures: anyCulture, tags: ["family", "faith", "wild"] },
  { t: "a gated community with a dark history", short: "the gated community", cultures: anyCulture, tags: ["wealth", "secrecy"] },
);

more(G.upbringings,
  { t: "in a trailer park where everyone looked out for everyone", tags: ["poverty", "family"] },
  { t: "touring with a parent's band", tags: ["art", "travel"] },
  { t: "as a child actor, which ended badly", tags: ["art", "wealth", "loss"] },
  { t: "on a family farm that was always one bad year from failing", tags: ["family", "craft", "poverty"] },
  { t: "in a boarding school, mostly alone", tags: ["wealth", "isolation", "learning"] },
  { t: "translating for immigrant parents from age six", tags: ["family", "duty", "learning"] },
  { t: "in a cop family with a code of silence", tags: ["order", "secrecy", "family"] },
  { t: "in a strict religious community {they} later left", tags: ["faith", "order", "betrayal"] },
  { t: "with grandparents after the custody fight", tags: ["family", "loss"] },
  { t: "in the back room of a pawn shop", tags: ["crime", "poverty", "craft"] },
  { t: "as the oldest of five, raising the others", tags: ["family", "duty", "poverty"] },
  { t: "in a house full of books and very little money", tags: ["learning", "poverty"] },
);

more(G.occupations,
  { t: "an electrician", tags: ["craft", "tech"], arch: ["sage", "warrior"], skills: ["wiring", "fixing what others break"] },
  { t: "a firefighter", tags: ["duty", "violence", "healing"], arch: ["warrior", "healer"], skills: ["search and rescue", "staying calm in smoke"] },
  { t: "a pharmacist", tags: ["healing", "learning"], arch: ["healer", "sage"], skills: ["drug interactions", "noticing who's overdoing it"] },
  { t: "a plumber", tags: ["craft", "poverty"], arch: ["warrior", "sage"], skills: ["pipework", "getting into tight spaces"] },
  { t: "a real estate agent", tags: ["wealth", "ambition"], arch: ["face"], skills: ["closing deals", "knowing every house's secrets"] },
  { t: "a night-shift security guard", tags: ["duty", "isolation"], arch: ["warrior"], skills: ["patrol routes", "staying awake"] },
  { t: "a farmer", tags: ["wild", "family", "craft"], arch: ["wild", "warrior"], skills: ["animal care", "fixing machinery"] },
  { t: "a librarian", tags: ["learning", "order"], arch: ["sage"], skills: ["research", "finding anything"] },
  { t: "a veterinarian", tags: ["healing", "wild"], arch: ["healer"], skills: ["surgery", "calming frightened animals"] },
  { t: "a commercial pilot", tags: ["travel", "duty"], arch: ["wild", "sage"], skills: ["flying", "decisions under pressure"] },
  { t: "an accountant", tags: ["order", "wealth"], arch: ["sage"], skills: ["following money", "tax law"] },
  { t: "a flight attendant", tags: ["travel", "art"], arch: ["face", "healer"], skills: ["de-escalation", "first aid at altitude"] },
  { t: "a funeral director", tags: ["loss", "faith"], arch: ["sage", "healer"], skills: ["comforting the grieving", "embalming"] },
  { t: "a chef", tags: ["craft", "art", "ambition"], arch: ["face", "warrior"], skills: ["running a kitchen", "knife work"] },
  { t: "a carpenter", tags: ["craft"], arch: ["warrior"], skills: ["building anything", "reading a structure"] },
  { t: "a street magician", tags: ["art", "crime"], arch: ["face", "skulker"], skills: ["sleight of hand", "reading a crowd"], w: 0.08 },
  { t: "a professional poker player", tags: ["chaos", "wealth", "crime"], arch: ["face", "sage"], skills: ["odds in {their} head", "reading tells"], w: 0.06 },
  { t: "a stunt performer", tags: ["violence", "art"], arch: ["warrior", "skulker"], skills: ["falls and fights", "stunt driving"], w: 0.05 },
);

more(G.events,
  { t: "{they} {was} laid off three weeks before Christmas", short: "the layoff", tier: 0, tags: ["poverty", "betrayal"], wound: "being disposable" },
  { t: "{their} best friend moved across the country without saying goodbye", short: "the move", tier: 0, tags: ["loss", "betrayal"], wound: "being left without a word" },
  { t: "{they} failed the exam {they} studied two years for", short: "the exam", tier: 0, tags: ["learning", "ambition"], wound: "working hard and still failing" },
  { t: "a long engagement ended a month before the wedding", short: "the broken engagement", tier: 0, tags: ["family", "loss"], wound: "planning a life that didn't happen" },
  { t: "{their} parents lost the house to foreclosure", short: "the foreclosure", tier: 0, tags: ["poverty", "family"], wound: "watching {their} parents lose everything" },
  { t: "{they} got sober after a decade of drinking", short: "getting sober", tier: 1, tags: ["healing", "loss"], wound: "the years {they} can't get back" },
  { t: "{they} spent eighteen months in prison for something {they} did do", short: "the prison stretch", tier: 1, tags: ["crime", "order"], wound: "being defined by {their} worst year" },
  { t: "{they} {was} the whistleblower at {their} last job", short: "the whistleblowing", tier: 1, tags: ["betrayal", "order", "secrecy"], wound: "doing the right thing and losing everything" },
  { t: "{they} survived a mass shooting", short: "the shooting", tier: 2, tags: ["violence", "loss"], wound: "the sound that still makes {them} flinch" },
  { t: "{they} {was} kidnapped as a child and returned with no memory of the missing week", short: "the missing week", tier: 2, tags: ["secrecy", "loss", "family"], wound: "a gap in {their} life that nobody can explain" },
  { t: "{they} won the lottery and lost it all within two years", short: "the lottery win", tier: 2, tags: ["wealth", "chaos", "loss"], wound: "having everything and losing it" },
  { t: "{they} {was} the only survivor of a plane crash", short: "the crash", tier: 3, tags: ["loss", "isolation", "faith"], wound: "being chosen to live without knowing why" },
  { t: "{they} discovered {their} father was a serial killer", short: "the discovery", tier: 3, tags: ["family", "secrecy", "violence"], wound: "loving a monster" },
  { t: "{they} died on an operating table for four minutes and came back changed", short: "the four minutes", tier: 3, tags: ["healing", "faith"], wound: "remembering something from those four minutes" },
  { t: "a meteor struck {their} hometown and {they} {was} standing at the edge of the crater", short: "the impact", tier: 4, tags: ["loss", "tech", "chaos"], wound: "being the only one who walked out of the light" },
  { t: "{they} {was} part of a government experiment {they} {was} told was a summer camp", short: "the summer program", tier: 4, tags: ["secrecy", "order", "tech"], wound: "being made into something without consent" },
  { t: "{they} woke up in a hospital with a stranger's name on {their} wristband and powers {they} couldn't explain", short: "the wrong name", tier: 4, tags: ["secrecy", "chaos"], wound: "not knowing who {they} really {is}" },
);

more(G.gifts,
  { t: "can parallel park anything, first try", tier: 1, tags: ["travel"] },
  { t: "makes anyone feel at ease within a minute", tier: 1, tags: ["art", "healing"] },
  { t: "has a perfect sense of direction", tier: 1, tags: ["travel"] },
  { t: "cooks like a professional", tier: 1, tags: ["craft", "family"] },
  { t: "can do complex math in {their} head faster than a calculator", tier: 2, tags: ["learning", "tech"] },
  { t: "has never lost a fight", tier: 2, tags: ["violence"] },
  { t: "can mimic any voice after hearing it once", tier: 2, tags: ["art", "crime"] },
  { t: "always knows when someone is about to die", tier: 2, tags: ["loss", "faith"] },
  { t: "is a chess grandmaster who plays in parks for {coin}", tier: 3, tags: ["learning", "poverty"] },
  { t: "remembers every face {they} {has} ever seen", tier: 3, tags: ["secrecy", "learning"] },
  { t: "survived three things that should have killed {them}", tier: 3, tags: ["violence", "faith"] },
  { t: "can hack any system given ten minutes and a cable", tier: 3, tags: ["tech", "crime"] },
  { t: "can move objects with {their} mind, and is still learning how far", tier: 4, tags: ["chaos", "secrecy"] },
  { t: "can see a few seconds into the future in moments of danger", tier: 4, tags: ["violence", "faith"] },
  { t: "can make {themself} unseen by cameras and crowds", tier: 4, tags: ["secrecy", "tech"] },
  { t: "absorbs electricity and can throw it back", tier: 4, tags: ["tech", "violence"] },
);

more(G.appearance.features,
  "a neck tattoo {they} got at eighteen", "a nose ring", "a prosthetic left hand", "deep acne scars", "a shaved head",
  "a wedding ring tan line", "a hearing aid", "gold-rimmed glasses", "a crooked, charming smile", "chipped nail polish",
  "a sunburned neck", "dreadlocks tied back", "grey roots showing through dyed hair", "a gap in {their} eyebrow from a scar",
);
more(G.appearance.styles,
  "a hospital ID badge on a lanyard, even off shift", "a leather jacket older than {they} {is}", "a sharp blazer over a band shirt",
  "fishing gear and a faded cap", "a church dress, always", "black on black on black", "a high-visibility vest", "a tracksuit and gold chain",
);
more(G.appearance.items,
  "a phone case covered in stickers", "a pack of gum {they} never share", "a flask engraved with someone else's initials",
  "a set of keys to a car {they} sold", "a burner phone", "a laminated prayer card", "a pocketknife from {their} grandfather",
  "a stack of unpaid parking tickets", "a backpack that's always half-packed", "a cassette tape with no label",
  "earbuds in, always, playing nothing", "a dog-eared address book", "a coffee-stained notebook", "a photo of a dog that died years ago",
  "a bus pass for a city {they} left", "a bottle of pills {they} won't explain",
);
for (const [k, list] of Object.entries({
  warrior: ["a tire iron and nothing to lose", "wrestling, the dirty kind"],
  skulker: ["vanishes into crowds", "a knife {they} {has} never used, yet"],
  caster: ["shuts down a building's power grid", "turns phones into tracking beacons"],
  face: ["talks the gun down", "calls in a favor at the worst moment"],
  healer: ["drags the wounded out of the line of fire", "a fire extinguisher, used creatively"],
  sage: ["plans every exit before the fight", "knows where the cameras can't see"],
  wild: ["drives a truck through the wall", "a crossbow from hunting season"],
})) G.combat[k].push(...list);
for (const [k, list] of Object.entries({
  warrior: ["takes a punch", "carries injured people for miles"],
  skulker: ["shoplifts anything", "blends into any crowd"],
  caster: ["clones key cards", "recovers deleted files"],
  face: ["gets into any party", "lies to police convincingly"],
  healer: ["stitches wounds", "talks people down from panic"],
  sage: ["finds anyone's address", "reads contracts for traps"],
  wild: ["tracks in the woods", "fixes a car with junk"],
})) G.abilities[k].push(...list);

export default G;
