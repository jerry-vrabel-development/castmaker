// Science fiction tables. Original Castmaker content — CC BY 4.0.

export default {
  id: "scifi",
  label: "Science fiction",
  vocab: { coin: "credits", drink: "recycled coffee", package: "sealed data-chip", messages: "messages", city: "the station" },

  cultures: {
    core: { people: "human", first: ["Aster", "Jun", "Leda", "Orion", "Sable", "Tycho", "Vega", "Mira", "Cassius", "Iona"], last: ["Okonkwo-Lind", "Varga", "Halloran", "Sato", "Mbeki", "Castellane", "Ruiz-Abara", "Voss"] },
    belt: { people: "human", first: ["Dex", "Kit", "Rook", "Sana", "Tamsin", "Juno", "Pike", "Ash"], last: ["Kaur", "Maddox", "Ibarra", "Tran", "Ostrova", "Quill"] },
    mars: { people: "human", first: ["Arek", "Nadia", "Soren", "Talia", "Emeka", "Rhea", "Idris", "Selene"], last: ["Harrow", "Abiodun", "Kesler", "Dubrovna", "Solano", "Achterberg"] },
    shipborn: { people: "human", first: ["Seven", "Haven", "Lumen", "Kestrel", "Wren", "Arden", "Solace", "Ember"], last: ["of Deck Four", "Halvorsen", "Mbatha", "Fen", "Yoshida", "Laurent"] },
    arcology: { people: "human", first: ["Reyna", "Caius", "Indira", "Felix", "Anouk", "Darius", "Saoirse", "Hiro"], last: ["Valcourt", "Steiner-Park", "Ashworth", "Delacroix", "Nakamura", "Brandt"] },
  },

  peoples: { human: { label: "human", age: [19, 72] } },

  origins: [
    { t: "a mining habitat in the Belt", short: "the Belt", cultures: ["belt"], tags: ["poverty", "craft", "isolation"] },
    { t: "a corporate arcology on old Earth", short: "the arcology", cultures: ["arcology"], tags: ["wealth", "order", "ambition"] },
    { t: "the terraformed plains of Mars", short: "Mars", cultures: ["mars"], tags: ["wild", "family", "craft"] },
    { t: "a generation ship still decades from arrival", short: "the generation ship", cultures: ["shipborn"], tags: ["duty", "order", "isolation"] },
    { t: "a frontier colony at the edge of charted space", short: "the frontier", cultures: ["belt", "mars", "core"], tags: ["wild", "travel", "violence"] },
    { t: "an orbital slum ring above Earth", short: "the ring", cultures: ["core", "belt"], tags: ["poverty", "crime"] },
    { t: "a naval academy station", short: "the academy", cultures: ["core", "mars"], tags: ["duty", "order", "violence"] },
    { t: "a research outpost on a moon nobody bothered to name", short: "the outpost", cultures: ["core", "arcology"], tags: ["learning", "isolation", "tech"] },
  ],

  upbringings: [
    { t: "in zero-g crèches, raised by a rotating shift of caretakers", tags: ["isolation", "order"] },
    { t: "in a corporate family where every child had a performance review", tags: ["wealth", "ambition", "order"] },
    { t: "on a salvage tug with parents who argued in three languages", tags: ["travel", "family", "craft"] },
    { t: "in the ring's underlevels, where air was something you paid for", tags: ["poverty", "crime"] },
    { t: "in a colony that voted on everything, including bedtime", tags: ["family", "order"] },
    { t: "in a religious enclave waiting for a signal from the stars", tags: ["faith", "isolation"] },
    { t: "as a lab-raised prodigy, mostly talking to machines", tags: ["tech", "learning", "isolation"] },
    { t: "with a mother who was always somewhere else on assignment", tags: ["duty", "isolation", "family"] },
  ],

  occupations: [
    { t: "a ship's engineer", tags: ["craft", "tech"], arch: ["sage", "warrior"], skills: ["keeping a dying reactor alive", "zero-g repairs"] },
    { t: "a smuggler", tags: ["crime", "travel"], arch: ["skulker", "face"], skills: ["false transponder codes", "flying dark"] },
    { t: "a corporate negotiator", tags: ["wealth", "ambition"], arch: ["face"], skills: ["contract law", "reading people over a bad comm link"] },
    { t: "a xenobiologist", tags: ["learning", "wild"], arch: ["sage", "healer"], skills: ["alien biology", "field sampling"] },
    { t: "a colonial marine", tags: ["violence", "duty"], arch: ["warrior"], skills: ["boarding actions", "powered armor"] },
    { t: "a freelance hacker", tags: ["tech", "crime"], arch: ["caster", "skulker"], skills: ["breaking encryption", "ghosting through security"] },
    { t: "a field medic", tags: ["healing", "violence"], arch: ["healer"], skills: ["combat surgery", "pharmacology"] },
    { t: "a freighter pilot", tags: ["travel"], arch: ["skulker", "wild"], skills: ["tight-orbit flying", "plotting jumps by hand"] },
    { t: "a colonial marshal", tags: ["order", "duty", "violence"], arch: ["warrior", "face"], skills: ["interrogation", "sidearm marksmanship"] },
    { t: "a salvager", tags: ["poverty", "craft", "travel"], arch: ["wild", "skulker"], skills: ["cutting into dead ships", "long spacewalks"] },
    { t: "an AI ethicist", tags: ["learning", "tech", "faith"], arch: ["sage", "face"], skills: ["debugging machine minds", "philosophy of mind"] },
    { t: "a diplomat", tags: ["order", "art"], arch: ["face"], skills: ["first-contact protocol", "languages"] },
    { t: "a preacher of the Long Signal", tags: ["faith"], arch: ["healer", "face"], skills: ["sermons", "comforting the dying"] },
    { t: "an archivist of lost Earth", tags: ["learning", "loss"], arch: ["sage"], skills: ["dead languages", "data recovery"] },
  ],

  events: [
    { t: "{their} habitat ran on strict rationing for {their} whole childhood", short: "the rationing years", tags: ["poverty", "order"], wound: "learning that there is never quite enough" },
    { t: "a hull breach killed half of {their} deck while {they} slept", short: "the breach", tags: ["loss", "violence", "isolation"], wound: "waking up alive when others didn't" },
    { t: "{they} discovered {their} employer was poisoning the colony's water", short: "the water scandal", tags: ["secrecy", "betrayal", "crime"], wound: "learning the people in charge would let everyone die for profit" },
    { t: "{their} family was declared surplus and shipped to a work colony", short: "the surplus order", tags: ["poverty", "family", "order"], wound: "being declared worth nothing" },
    { t: "{they} {was} the only survivor of a first contact gone wrong", short: "the failed contact", tags: ["violence", "isolation", "learning"], wound: "seeing something no one believes" },
    { t: "{they} sold a friend's location to pay off a debt", short: "the sale", tags: ["betrayal", "crime"], wound: "being the betrayer" },
    { t: "a malfunctioning AI caretaker raised {them} for two years after the adults died", short: "the caretaker years", tags: ["isolation", "tech", "loss"], wound: "being loved by something that wasn't supposed to" },
    { t: "{they} mutinied against a captain who was about to space the refugees", short: "the mutiny", tags: ["violence", "duty", "order"], wound: "breaking an oath to keep {their} conscience" },
    { t: "{they} lost a year to cryosleep and woke to find {their} partner had moved on", short: "the lost year", tags: ["loss", "travel"], wound: "the world going on without {them}" },
    { t: "{they} won a lottery seat on a colony ship and gave it to {their} sister", short: "the lottery seat", tags: ["family", "loss", "duty"], wound: "choosing to stay behind" },
  ],

  // Gifts scale with grade. Common characters have none.
  gifts: [
    { t: "has zero-g reflexes", tier: 1, tags: ["travel"] },
    { t: "has a head for orbital math", tier: 1, tags: ["learning", "tech"] },
    { t: "sleeps anywhere and wakes instantly", tier: 1, tags: ["duty"] },
    { t: "speaks ring slang and three trade tongues", tier: 1, tags: ["travel", "crime"] },
    { t: "still has a working pre-war neural lace", tier: 2, tags: ["tech"] },
    { t: "is immune to every known void plague", tier: 2, tags: ["healing"] },
    { t: "navigates without instruments", tier: 2, tags: ["travel"] },
    { t: "is shadowed by an AI companion that is a little too loyal", tier: 2, tags: ["tech", "isolation"] },
    { t: "has rare psionic sensitivity", tier: 3, tags: ["faith", "isolation"] },
    { t: "carries military-grade augments {they} shouldn't have", tier: 3, tags: ["violence", "tech", "secrecy"] },
    { t: "flies by instinct better than any AI", tier: 3, tags: ["travel"] },
    { t: "holds the command codes to a lost warship", tier: 3, tags: ["secrecy", "violence"] },
    { t: "is the only human the alien Choir will speak to", tier: 4, tags: ["learning", "isolation"] },
    { t: "carries a dead AI's mind braided into {their} own", tier: 4, tags: ["tech", "loss"] },
    { t: "can feel jump-space routes like currents in water", tier: 4, tags: ["travel", "wild"] },
    { t: "is a perfect clone of a legendary war hero, with the memories to prove it", tier: 4, tags: ["violence", "secrecy", "duty"] },
  ],

  appearance: {
    builds: ["wiry", "broad-shouldered", "slight", "heavyset", "tall and stooped", "compact and strong", "lanky", "long-limbed from low gravity"],
    features: ["a cheap ocular implant that whirs when focusing", "radiation freckles across the knuckles", "a shaved strip where an old neural port was removed", "the slight stoop of someone raised in low gravity", "a badly set nose", "a streak of white through dark hair", "a burn scar along one forearm", "a gap-toothed smile"],
    styles: ["a patched flight suit covered in mission patches", "corporate grey with a company pin", "layered thermal wraps", "surplus marine fatigues", "bright synthetic fabrics from the ring markets", "an immaculate dress uniform, slightly out of date"],
    items: ["a cracked data-slate full of family photos", "a vial of real Earth soil", "a sidearm with a filed-off serial number", "a broken analog wristwatch", "a stuffed animal from the crèche", "a knife made from hull plating", "a recording of a voice {they} won't play", "a star chart with one system circled"],
  },

  combat: {
    warrior: ["armored breach and clear", "heavy rifle, steady as a bulkhead"],
    skulker: ["a vibroknife up close, then out the airlock", "silenced pistol and a vent shaft"],
    caster: ["turns the ship's systems against intruders", "drones and overloaded sensors"],
    face: ["talks the boarding party into leaving", "covers the team from behind a crate, mostly yelling"],
    healer: ["keeps the squad breathing", "stun baton and a medkit"],
    sage: ["predicts the enemy's next move", "fights from the bridge, not the corridor"],
    wild: ["mag-boots and a harpoon gun", "ambushes from the dark side of the hull"],
  },
  abilities: {
    warrior: ["fights in powered armor", "holds a corridor alone"],
    skulker: ["bypasses door locks", "slips past sensors"],
    caster: ["hacks ship systems", "commands drones"],
    face: ["negotiates with anyone", "forges credentials"],
    healer: ["field surgery", "treats radiation and decompression"],
    sage: ["analyzes alien tech", "calculates jumps in {their} head"],
    wild: ["survives hostile atmospheres", "pilots anything with thrusters"],
  },
};
