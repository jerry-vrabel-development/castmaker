// High fantasy tables. Original Castmaker content — CC BY 4.0.
// Peoples map to SRD 5.1 ancestries in the D&D 5e adapter.

const G = {
  id: "fantasy",
  label: "High fantasy",
  vocab: { coin: "silver", drink: "ale", package: "sealed letter", messages: "letters", city: "town", authority: "the town watch", ruler: "the duke" },

  // Name lists are filled in from NAMES at the bottom of this file.
  cultures: {
    valemark: { people: "human", first: [], last: [] },
    elf: { people: "elf", first: [], last: [] },
    dwarf: { people: "dwarf", first: [], last: [] },
    halfling: { people: "halfling", first: [], last: [] },
    orc: { people: "halforc", first: [], last: [] },
    freecity: { people: "tiefling", first: [], last: [] },
    gnome: { people: "gnome", first: [], last: [] },
    dragonborn: { people: "dragonborn", first: [], last: [] },
    halfelf: { people: "halfelf", first: [], last: [] },
  },

  peoples: {
    human: { label: "human", age: [17, 65] },
    elf: { label: "elf", age: [100, 450] },
    dwarf: { label: "dwarf", age: [50, 280] },
    halfling: { label: "halfling", age: [20, 110] },
    halforc: { label: "half-orc", age: [15, 60] },
    tiefling: { label: "tiefling", age: [17, 85] },
    gnome: { label: "gnome", age: [40, 380] },
    dragonborn: { label: "dragonborn", age: [15, 70] },
    halfelf: { label: "half-elf", age: [20, 160] },
  },

  origins: [
    { t: "a river town in the Valemark", short: "the Valemark", cultures: ["valemark", "valemark", "halfelf", "halfling"], tags: ["family", "craft", "travel"] },
    { t: "the high forest of Saevyn", short: "the high forest", cultures: ["elf", "elf", "halfelf"], tags: ["wild", "art", "isolation"] },
    { t: "the deep holds under the Greyteeth mountains", short: "the deep holds", cultures: ["dwarf", "dwarf", "gnome"], tags: ["craft", "order", "family"] },
    { t: "a hill village of round-doored burrows", short: "the hill burrows", cultures: ["halfling", "halfling", "gnome"], tags: ["family", "craft"] },
    { t: "a war-camp on the grass steppe", short: "the steppe camps", cultures: ["orc", "orc", "valemark"], tags: ["violence", "wild", "duty"] },
    { t: "the crowded Lantern Quarter of the free city of Ostrava", short: "Ostrava", cultures: ["freecity", "valemark", "halfelf", "gnome", "dragonborn"], tags: ["crime", "wealth", "art"] },
    { t: "a clan aerie on the Ember Coast", short: "the Ember Coast", cultures: ["dragonborn", "dragonborn"], tags: ["duty", "faith", "violence"] },
    { t: "a tinkers' warren beneath the capital", short: "the tinkers' warren", cultures: ["gnome", "gnome", "halfling"], tags: ["tech", "learning", "craft"] },
    { t: "a border fortress that changed hands three times in {their} childhood", short: "the border fortress", cultures: ["valemark", "dwarf", "orc", "halfelf"], tags: ["violence", "duty", "loss"] },
  ],

  upbringings: [
    { t: "in a temple orphanage, where kindness came with a schedule", tags: ["faith", "order", "poverty"] },
    { t: "in a noble house that was quietly running out of money", tags: ["wealth", "family", "ambition"] },
    { t: "on the road with a troupe of players", tags: ["art", "travel"] },
    { t: "in the back of a smithy, among sparks and shouting", tags: ["craft", "family"] },
    { t: "in a thieves' den that was the closest thing to a family", tags: ["crime", "poverty", "family"] },
    { t: "alone in the woods after the age of eight", tags: ["wild", "isolation"] },
    { t: "as the youngest of nine, mostly ignored", tags: ["family", "poverty"] },
    { t: "in a scholar's tower, surrounded by books and silence", tags: ["learning", "isolation"] },
    { t: "in a garrison town where everyone answered to the bell", tags: ["duty", "order", "violence"] },
    { t: "on a river barge, never in one place for long", tags: ["travel", "crime"] },
  ],

  occupations: [
    { t: "a caravan guard", tags: ["violence", "travel", "duty"], arch: ["warrior"], skills: ["reading a road for ambush", "calming a spooked horse"] },
    { t: "a temple healer", tags: ["faith", "healing"], arch: ["healer"], skills: ["setting bones", "herb lore"] },
    { t: "a hedge witch", tags: ["wild", "healing", "secrecy"], arch: ["caster", "wild", "healer"], skills: ["charms and curses", "reading the weather"] },
    { t: "a cutpurse", tags: ["crime", "poverty"], arch: ["skulker"], skills: ["picking pockets", "vanishing into a crowd"] },
    { t: "a court scribe", tags: ["learning", "order", "secrecy"], arch: ["sage", "face"], skills: ["forging handwriting", "court etiquette"] },
    { t: "a failed wizard's apprentice", tags: ["learning", "ambition", "chaos"], arch: ["caster"], skills: ["a handful of minor spells", "reading old scripts"] },
    { t: "a traveling minstrel", tags: ["art", "travel"], arch: ["face"], skills: ["lute and song", "remembering every face"] },
    { t: "a blacksmith", tags: ["craft", "family"], arch: ["warrior"], skills: ["metalwork", "judging a blade at a glance"] },
    { t: "a deserter from the duke's army", tags: ["violence", "betrayal", "duty"], arch: ["warrior", "skulker"], skills: ["shield-wall drill", "living rough"] },
    { t: "a monster hunter for hire", tags: ["violence", "wild"], arch: ["wild", "warrior"], skills: ["tracking", "knowing what bleeds"] },
    { t: "a smuggler on the river barges", tags: ["crime", "travel"], arch: ["skulker", "face"], skills: ["hidden compartments", "bribing toll-keepers"] },
    { t: "a grave warden", tags: ["faith", "loss", "isolation"], arch: ["healer", "sage"], skills: ["funeral rites", "spotting the restless dead"] },
    { t: "a merchant's factor", tags: ["wealth", "ambition"], arch: ["face"], skills: ["haggling", "appraising goods"] },
    { t: "a forester", tags: ["wild", "isolation"], arch: ["wild"], skills: ["archery", "moving silently through woods"] },
    { t: "a cartographer", tags: ["learning", "travel"], arch: ["sage", "skulker"], skills: ["mapmaking", "navigating by the stars"] },
    { t: "an oath-bound knight", tags: ["duty", "order", "faith"], arch: ["warrior", "healer"], skills: ["mounted combat", "heraldry"] },
    { t: "a tavern keeper", tags: ["family", "craft"], arch: ["face"], skills: ["brewing", "hearing every rumor"] },
    { t: "a cultist who escaped", tags: ["faith", "secrecy", "betrayal"], arch: ["caster", "skulker"], skills: ["forbidden rites", "lying under pressure"] },
    { t: "an alchemist", tags: ["learning", "craft", "tech"], arch: ["sage", "caster"], skills: ["brewing potions", "identifying poisons"] },
  ],

  events: [
    { t: "{they} served a long, quiet apprenticeship that taught {them} patience and little else", short: "the long apprenticeship", tags: ["craft", "duty"], wound: "years spent waiting for a life to start" },
    { t: "the red fever came through and took {their} mother and baby brother within a week", short: "the red fever", tags: ["loss", "healing", "family"], wound: "watching the people {they} loved die while {they} could do nothing" },
    { t: "raiders burned {their} village while {they} hid in the root cellar", short: "the burning of {their} village", tags: ["violence", "loss"], wound: "hiding while others died" },
    { t: "{their} closest friend sold {them} out to the city watch", short: "the betrayal", tags: ["betrayal", "crime"], wound: "being betrayed by the one person {they} trusted" },
    { t: "{they} killed a man in a tavern brawl that should have ended with bruises", short: "the tavern death", tags: ["violence", "loss", "chaos"], wound: "taking a life that didn't need taking" },
    { t: "a wandering mage saw something in {them}, promised to return, and never did", short: "the mage who left", tags: ["learning", "isolation", "betrayal"], wound: "being chosen and then abandoned" },
    { t: "{their} family's lands were seized on a lie told to the duke", short: "the seizure of the family lands", tags: ["family", "betrayal", "wealth"], wound: "watching {their} parents lose everything to a lie" },
    { t: "{they} spent a winter lost in the mountains and came back different", short: "the lost winter", tags: ["wild", "isolation"], wound: "surviving something {they} can't describe" },
    { t: "{they} {was} sold into service to pay a debt {they} didn't owe", short: "the indenture", tags: ["poverty", "crime", "order"], wound: "being owned" },
    { t: "{they} saw a miracle at the temple, and no one believed {them}", short: "the miracle", tags: ["faith", "isolation"], wound: "being called a liar for telling the truth" },
    { t: "{their} older sister went into the deep woods to find a cure and never came out", short: "{their} sister's disappearance", tags: ["family", "wild", "loss"], wound: "not going with her" },
  ],

  // Gifts scale with grade. Common characters have none. Each is a phrase
  // that follows the character's first name.
  gifts: [
    { t: "has a way with animals that borders on uncanny", tier: 1, tags: ["wild"] },
    { t: "has a beautiful singing voice", tier: 1, tags: ["art"] },
    { t: "picks up languages in weeks", tier: 1, tags: ["learning", "travel"] },
    { t: "has endless patience", tier: 1, tags: ["craft"] },
    { t: "has uncanny luck at cards and dice", tier: 2, tags: ["crime", "chaos"] },
    { t: "has a minor talent for healing magic", tier: 2, tags: ["healing", "faith"] },
    { t: "is followed everywhere by a hawk that seems to understand speech", tier: 2, tags: ["wild"] },
    { t: "always knows which way is north, even underground", tier: 2, tags: ["travel"] },
    { t: "carries a hereditary blade that knows its bearer", tier: 3, tags: ["family", "violence"] },
    { t: "commands raw storm magic {they} never trained for", tier: 3, tags: ["chaos", "wild"] },
    { t: "can speak with the dead for one minute at a time", tier: 3, tags: ["faith", "loss"] },
    { t: "is the rightful heir to a lost throne", tier: 3, tags: ["family", "wealth", "secrecy"] },
    { t: "is named in a prophecy as the one who will end the Long Night", tier: 4, tags: ["faith", "duty"] },
    { t: "carries the blood of the last dragon-kings, and the fire that comes with it", tier: 4, tags: ["family", "violence"] },
    { t: "dreams the future, and the dreams always come true", tier: 4, tags: ["faith", "isolation"] },
    { t: "cannot be harmed by any weapon forged by mortal hands", tier: 4, tags: ["violence", "faith"] },
  ],

  appearance: {
    builds: ["wiry", "broad-shouldered", "slight", "heavyset", "tall and stooped", "compact and strong", "lanky", "soft-bodied but quick"],
    features: ["a ritual tattoo across the knuckles", "one silver-grey eye", "a calloused sword hand", "a braid threaded with small charms", "a badly set nose", "a streak of white through dark hair", "ink-stained fingers", "a burn scar along one forearm", "a gap-toothed smile", "freckles everywhere"],
    styles: ["travel-stained leathers", "a patched but carefully mended cloak", "cheap finery worn with total confidence", "plain homespun, always clean", "mismatched armor from three different owners", "temple greys"],
    items: ["a dented tin locket", "a dagger with someone else's initials", "a pipe that's never lit", "a deck of hand-painted cards", "a lucky copper coin with a hole through it", "a prayer cord with one bead missing", "a battered map case", "a whistle carved from bone"],
  },

  combat: {
    warrior: ["shield and spear, holding the line", "a greatsword swung with more strength than grace"],
    skulker: ["a knife from the dark, then gone", "crossbow from cover"],
    caster: ["fire and fury from the back rank", "subtle hexes and misdirection"],
    face: ["talks first; rapier when talking fails", "rallies others and lets them fight"],
    healer: ["mace and shield, keeping allies on their feet", "holds off death rather than dealing it"],
    sage: ["avoids fights; knows the monster's weakness", "quarterstaff and quick wards"],
    wild: ["longbow at range, hatchet up close", "fights like a cornered animal"],
  },
  abilities: {
    warrior: ["takes a hit that would drop most people", "reads an enemy's stance"],
    skulker: ["opens most locks", "goes unnoticed in a crowd"],
    caster: ["casts minor spells", "senses magic nearby"],
    face: ["talks guards into things", "reads lies in a face"],
    healer: ["closes wounds", "eases pain and fear"],
    sage: ["identifies relics and runes", "recalls obscure lore"],
    wild: ["tracks over bare stone", "calms wild animals"],
  },
};

// ---------- Expanded content (v0.4) ----------
const more = (list, ...items) => list.push(...items);

// Original names only. (Earlier versions borrowed some names from non-SRD
// books; every fantasy name list is now Castmaker's own.)
const NAMES = {
  valemark: {
    first: ["Aldric", "Alys", "Benedict", "Bryn", "Corwin", "Cressida", "Dunstan", "Edda", "Elric", "Fenna", "Garrick", "Gwendolyn", "Harlan", "Hesper", "Isolde", "Ivo", "Joren", "Linnet", "Maren", "Merrick", "Nell", "Osric", "Rowena", "Sabine", "Tamsin", "Wendel", "Yara", "Ottoline", "Piers", "Wynne"],
    last: ["Ashdown", "Ashcombe", "Blackwood", "Brightwater", "Coldridge", "Corrin", "Fairweather", "Fennick", "Greaves", "Holloway", "Larkspur", "Mallory", "Marsh", "Oakhart", "Pellam", "Rowntree", "Stroud", "Thorne", "Underhill", "Wexley"],
  },
  elf: {
    first: ["Ithrael", "Saevyn", "Calennor", "Mirethel", "Aelindra", "Thalorin", "Venarion", "Ilmaren", "Sethiel", "Naeris", "Orivane", "Caerwen", "Elunara", "Faerion", "Ilvasse", "Lorendhil", "Nyriel", "Sylvaine", "Taerith", "Voryndel"],
    last: ["Thaelorn", "Duskwhisper", "Aerendyl", "Starhollow", "Dawnmere", "Fernshade", "Hollowmere", "Mistvale", "Rainsong", "Sunreach", "Willowend", "Lumeris"],
  },
  dwarf: {
    first: ["Borrik", "Hedda", "Kazrin", "Magda", "Torvald", "Gunnhild", "Dorrik", "Ragna", "Brumli", "Sigrun", "Agna", "Bodvar", "Dagny", "Grimma", "Haldor", "Ketla", "Morgrim", "Rosvi", "Thyrna", "Volund"],
    last: ["Stonehollow", "Ironmantle", "Deepdelver", "Coppervein", "Hammerfall", "Granitebrow", "Anvilmar", "Blackforge", "Cragborn", "Emberbeard", "Flintheart", "Stoutbelly", "Orehand", "Slatecrown"],
  },
  halfling: {
    first: ["Tobin", "Marigold", "Ned", "Posy", "Wendell", "Lila", "Barnaby", "Clover", "Fenn", "Dilly", "Bramble", "Daisy", "Eddo", "Hilda", "Pim", "Rosie", "Tansy", "Wilbur", "Mabel", "Otto"],
    last: ["Thistledown", "Hollowell", "Applebrook", "Bramblefoot", "Butterby", "Hearthkettle", "Mossbottom", "Puddingham", "Sweetwater", "Toadstool", "Warmhollow", "Pebblefoot"],
  },
  orc: {
    first: ["Draka", "Ushka", "Korg", "Varga", "Shara", "Brug", "Yenna", "Morra", "Gash", "Durga", "Grisha", "Kesh", "Mog", "Ruk", "Ugrin", "Zarra", "Torvok", "Hruna", "Skara", "Bolgra"],
    last: ["Ashfang", "Redmaw", "Stonejaw", "Ironhide", "Bloodriver", "Bonebreaker", "Duskhowl", "Greyfang", "Thunderhide", "Wolfscar", "Emberhand"],
  },
  freecity: {
    first: ["Vesper", "Ishara", "Rieven", "Ember", "Quill", "Malachar", "Patience", "Blessing", "Reverie", "Solace", "Cinder", "Lament", "Halcyon", "Valerian", "Zethar", "Morwenna", "Ashbel", "Seraphine", "Tobiah", "Verity"],
    last: ["Ashdown", "Vane", "Corrin", "Morrow", "Sable", "Pellam", "Ashgrave", "Blackthorn", "Cindermoor", "Grimsby", "Lantern", "Nightingale", "Crowe"],
  },
  gnome: {
    first: ["Bimble", "Tannifer", "Quillo", "Sprocket", "Fennimore", "Wizzle", "Dibbin", "Fizzwick", "Gimmeny", "Lottie", "Nibsy", "Pockle", "Rindle", "Tamsy", "Widget", "Zibbet"],
    last: ["Gearwhistle", "Tumblebrook", "Copperpot", "Fizzbang", "Brasswinkle", "Cogsworth", "Fiddlefuse", "Sparkletoe", "Tinkerton", "Whirligig"],
  },
  dragonborn: {
    first: ["Vorsaar", "Khesra", "Tazhul", "Rhoska", "Szarith", "Kaelix", "Daarvos", "Iyrsha", "Arrakh", "Brennix", "Coryth", "Drasha", "Haldrex", "Ixara", "Mezhul", "Pyrrha", "Sarvok", "Vaelith"],
    last: ["Ysthrak", "Valdorr", "Kharash", "Thurrix", "Azhkarn", "Draxvel", "Kethrion", "Sorrovan", "Vyrmorr"],
  },
  halfelf: {
    first: ["Aldric", "Saevyn", "Isolde", "Thalorin", "Maren", "Naeris", "Corwin", "Mirethel", "Caerwen", "Ivo", "Linnet", "Sylvaine", "Rowan", "Elowyn", "Tarian", "Wren"],
    last: ["Blackwood", "Fairweather", "Thorne", "Dawnmere", "Fernshade", "Larkspur", "Oakhart", "Mistvale", "Willowend"],
  },
};
for (const [id, n] of Object.entries(NAMES)) Object.assign(G.cultures[id], n);


more(G.origins,
  { t: "a fishing village on the Saltmarsh coast", short: "the Saltmarsh", cultures: ["valemark", "halfling", "halfelf"], tags: ["family", "travel", "poverty"] },
  { t: "a pilgrim town that grew around a shrine", short: "the shrine town", cultures: ["valemark", "halfelf", "dwarf", "dragonborn"], tags: ["faith", "order"] },
  { t: "a mining camp in the Ashen Hills", short: "the Ashen Hills", cultures: ["dwarf", "orc", "valemark", "gnome"], tags: ["craft", "poverty", "violence"] },
  { t: "a wandering caravan that never stops for long", short: "the caravan", cultures: ["valemark", "halfling", "halfelf", "freecity", "orc"], tags: ["travel", "wild", "family"] },
  { t: "a ruined university city, half-flooded", short: "the drowned university", cultures: ["elf", "gnome", "valemark", "freecity"], tags: ["learning", "loss"] },
  { t: "a cliffside monastery above the clouds", short: "the cliff monastery", cultures: ["valemark", "elf", "dragonborn", "dwarf"], tags: ["faith", "isolation", "order"] },
);

more(G.upbringings,
  { t: "in a fishing family that measured years by storms", tags: ["family", "travel", "poverty"] },
  { t: "as a ward of a minor lord who forgot {them} most days", tags: ["wealth", "isolation"] },
  { t: "in a monastery, after being left at the gate", tags: ["faith", "order", "loss"] },
  { t: "in a mercenary camp, raised by whoever was sober", tags: ["violence", "travel"] },
  { t: "in a herbalist's cottage at the edge of the woods", tags: ["healing", "wild"] },
  { t: "among the beggars of the cathedral steps", tags: ["poverty", "faith", "crime"] },
  { t: "as the heir to a crumbling inn", tags: ["family", "craft", "poverty"] },
  { t: "between two parents from peoples who hated each other", tags: ["family", "betrayal"] },
  { t: "in the mines, working since {they} {was} seven", tags: ["craft", "poverty", "duty"] },
  { t: "in a library tower, as a copyist's apprentice", tags: ["learning", "order"] },
);

more(G.occupations,
  { t: "a fisher", tags: ["travel", "poverty"], arch: ["wild"], skills: ["reading weather", "knots and nets"] },
  { t: "a midwife", tags: ["healing", "family"], arch: ["healer"], skills: ["delivering children", "herbal remedies"] },
  { t: "a stablehand", tags: ["wild", "poverty"], arch: ["wild"], skills: ["handling horses", "hearing trouble coming"] },
  { t: "a miner", tags: ["craft", "poverty"], arch: ["warrior"], skills: ["stonework", "working in the dark"] },
  { t: "a baker", tags: ["craft", "family"], arch: ["face"], skills: ["baking", "knowing the town's gossip"] },
  { t: "a gravedigger", tags: ["loss", "isolation"], arch: ["warrior", "sage"], skills: ["digging", "recognizing causes of death"] },
  { t: "a town crier", tags: ["art", "order"], arch: ["face"], skills: ["a carrying voice", "knowing the latest news"] },
  { t: "a rat-catcher", tags: ["poverty", "wild"], arch: ["skulker"], skills: ["traps", "the sewer routes"] },
  { t: "a tax collector", tags: ["order", "wealth"], arch: ["face", "sage"], skills: ["arithmetic", "spotting hidden wealth"] },
  { t: "a bounty hunter", tags: ["violence", "crime"], arch: ["warrior", "skulker"], skills: ["tracking people", "manacles and rope"], w: 0.3 },
  { t: "a ship's navigator", tags: ["travel", "learning"], arch: ["sage", "wild"], skills: ["navigating by stars", "reading currents"], w: 0.55 },
  { t: "a court jester", tags: ["art", "secrecy"], arch: ["face"], skills: ["juggling", "saying the unsayable"], w: 0.15 },
  { t: "a herald of the royal court", tags: ["order", "duty"], arch: ["face", "sage"], skills: ["heraldry", "diplomatic forms"], w: 0.3 },
  { t: "a temple guardian", tags: ["faith", "duty", "violence"], arch: ["warrior", "healer"], skills: ["standing watch", "rites of protection"], w: 0.55 },
);

more(G.events,
  { t: "{they} spent a year as the village's only healer after the old one died", short: "the year of healing", tier: 0, tags: ["healing", "duty"], wound: "being needed by everyone and helped by no one" },
  { t: "{their} parents' inn burned down the winter {they} turned twelve", short: "the inn fire", tier: 0, tags: ["family", "loss", "poverty"], wound: "watching {their} home burn" },
  { t: "{they} {was} jilted on {their} wedding day in front of the whole village", short: "the wedding", tier: 0, tags: ["family", "betrayal"], wound: "being humiliated in front of everyone {they} knew" },
  { t: "{they} lost {their} savings to a traveling swindler", short: "the swindle", tier: 0, tags: ["poverty", "crime"], wound: "being made a fool of" },
  { t: "{their} father drank away the family farm", short: "the lost farm", tier: 0, tags: ["family", "poverty"], wound: "watching a parent fail" },
  { t: "{they} {was} accused of witchcraft and barely escaped the village", short: "the witch trial", tier: 1, tags: ["faith", "violence", "isolation"], wound: "being hunted by neighbors" },
  { t: "a plague ship arrived and {they} {was} one of the few who didn't fall sick", short: "the plague ship", tier: 1, tags: ["healing", "loss"], wound: "surviving while everyone around {them} died" },
  { t: "{they} fought in a border war that no one remembers now", short: "the forgotten war", tier: 1, tags: ["violence", "duty", "loss"], wound: "killing for a cause that didn't matter" },
  { t: "{they} {was} captured by slavers and escaped after two years", short: "the slave caravan", tier: 2, tags: ["violence", "crime", "poverty"], wound: "being owned" },
  { t: "{they} found a dying knight who pressed a ring into {their} hand", short: "the knight's ring", tier: 2, tags: ["duty", "secrecy", "loss"], wound: "inheriting a stranger's unfinished oath" },
  { t: "{they} {was} the sole survivor when the mine collapsed", short: "the collapse", tier: 2, tags: ["craft", "loss", "isolation"], wound: "hearing the others call for help" },
  { t: "{they} saw a dragon burn {their} city, and saw its rider", short: "the burning of the city", tier: 3, tags: ["violence", "loss", "secrecy"], wound: "knowing who did it when no one else does" },
  { t: "{they} {was} stolen away by the fey for what felt like a night and was seven years", short: "the lost seven years", tier: 3, tags: ["wild", "loss", "isolation"], wound: "coming home to a world that moved on" },
  { t: "{they} {was} chosen by a dying god to carry its last spark", short: "the god's last spark", tier: 4, tags: ["faith", "duty"], wound: "being chosen without being asked" },
  { t: "{they} {was} born during an eclipse that the priests had prophesied for a thousand years", short: "the eclipse birth", tier: 4, tags: ["faith", "family"], wound: "never being allowed to be ordinary" },
);

more(G.gifts,
  { t: "can make anyone laugh, even at a funeral", tier: 1, tags: ["art", "loss"] },
  { t: "has a nose for herbs and poisons", tier: 1, tags: ["healing", "wild"] },
  { t: "never gets lost in a city", tier: 1, tags: ["travel", "crime"] },
  { t: "can carry loads that would stagger a mule", tier: 1, tags: ["craft", "poverty"] },
  { t: "senses lies as a cold prickle on the neck", tier: 2, tags: ["secrecy", "faith"] },
  { t: "has a shadow that sometimes moves on its own", tier: 2, tags: ["secrecy", "chaos"] },
  { t: "can call birds to {their} hand", tier: 2, tags: ["wild"] },
  { t: "was blessed at birth by a wandering saint", tier: 2, tags: ["faith", "healing"] },
  { t: "can walk unseen when no one is thinking of {them}", tier: 3, tags: ["secrecy", "crime"] },
  { t: "is bonded to a griffin that answers only to {them}", tier: 3, tags: ["wild", "travel"] },
  { t: "can read the memories trapped in old objects", tier: 3, tags: ["learning", "loss"] },
  { t: "heals from wounds overnight, as long as {they} sleep{s} on earth", tier: 3, tags: ["healing", "wild"] },
  { t: "is the reincarnation of a legendary queen, and is beginning to remember", tier: 4, tags: ["family", "order", "secrecy"] },
  { t: "can speak the true names of things, and they obey", tier: 4, tags: ["learning", "faith"] },
  { t: "carries a sword that once killed a god", tier: 4, tags: ["violence", "faith"] },
  { t: "was raised by dragons and can take their form, once", tier: 4, tags: ["wild", "violence"] },
);

more(G.appearance.features,
  "a nose broken and badly set twice", "a missing fingertip", "eyes of two different colors", "a long scar through one eyebrow",
  "hands stained green from herb-work", "ears pierced a dozen times", "a sun-weathered face", "rings on every finger",
  "a tattoo of a ship on one forearm", "a limp from an old injury", "unusually pale eyes", "hair braided with copper wire",
  "a voice hoarse from shouting", "a missing front tooth", "a neat, carefully trimmed beard", "deep laugh lines",
);
more(G.appearance.styles,
  "a fur-trimmed coat far too warm for the season", "a priest's robe worn over chainmail", "faded court finery, carefully mended",
  "a fisher's oilskin", "a soldier's coat with the insignia cut off", "bright scarves in clashing colors", "an apron that never comes off",
  "a hooded traveling cloak, always up",
);
more(G.appearance.items,
  "a wooden flute carved by a dead friend", "a key to a door that no longer exists", "a jar of honey from home", "a cracked spyglass",
  "a child's drawing, folded small", "a silver bell with no clapper", "a dried rose pressed in a prayer book", "a tin cup dented by an arrow",
  "a lock of someone's hair in a locket", "a wanted poster with {their} own face on it", "a lucky rabbit's foot, much handled",
  "a heavy iron ring too big for any finger", "a book of poems with every page annotated", "a seashell from a sea {they} {has} never seen",
  "a broken compass that always points home", "a ribbon from a festival long ago",
);
for (const [k, list] of Object.entries({
  warrior: ["axe and shield, patient as a wall", "fists first, weapons when sober"],
  skulker: ["poisoned darts and a fast exit", "fights dirty: sand, chairs, anything"],
  caster: ["frost and lightning, carefully aimed", "illusions that make enemies fight each other"],
  face: ["talks the enemy into surrender", "a thrown dagger and a dazzling smile"],
  healer: ["a staff and a steady prayer", "shields the fallen with {their} own body"],
  sage: ["sets traps before the fight starts", "reads the enemy's weakness from old books"],
  wild: ["spear and hunting hounds", "ambush from the treeline, then gone"],
})) G.combat[k].push(...list);
for (const [k, list] of Object.entries({
  warrior: ["fights well in armor", "intimidates with a look"],
  skulker: ["climbs sheer walls", "spots traps"],
  caster: ["reads magical scripts", "lights fires with a word"],
  face: ["haggles prices down", "forges seals and signatures"],
  healer: ["treats disease", "recognizes curses"],
  sage: ["deciphers lost languages", "knows royal bloodlines"],
  wild: ["forages enough to feed a group", "moves silently in forests"],
})) G.abilities[k].push(...list);

export default G;
