# Castmaker

**A deep, universal generator for original characters — one character core, many modes.**

Castmaker creates original characters that feel like people rather than random trait combinations. A single shared character model sits at the center, and mode-specific layers shape that character for whoever is using it: a Dungeon Master who needs an NPC in thirty seconds, a novelist building a protagonist's inner life, an artist looking for a design prompt, and more.

---

## Vision

Most character generators serve one audience and roll unrelated traits ("a cheerful assassin who loves knitting"). Castmaker aims to be different in three ways:

1. **Universal** — one tool for tabletop players, writers, artists, worldbuilders, and people building AI personas — and for characters of any nature, from humans to robots.
2. **Deep** — traits cause and explain each other, so every character has a coherent history and an unresolved hook.
3. **Portable** — a character created in one mode can be switched to another. Roll an NPC for tonight's session, then flip it to Writer mode for a full backstory and arc.

---

## Core Concept: Shared Core + Mode Layers

```
              ┌──────────────────────────┐
              │      Character Core      │
              │  identity · appearance   │
              │  personality · background│
              │  motivation · flaws      │
              │  relationships · voice   │
              └────────────┬─────────────┘
       ┌───────────────────┼───────────────────┐
       ▼                   ▼                   ▼
 ┌───────────┐       ┌───────────┐       ┌───────────┐
 │ D&D Mode  │       │Writer Mode│       │Future Modes│
 └───────────┘       └───────────┘       └───────────┘
```

### Character Core (shared by every mode)

| Field | Description |
|---|---|
| Nature | What kind of being they are: human, other living species, or constructed (robot, android, AI) |
| Identity | Name, age, pronouns, origin, occupation |
| Appearance | Build, notable features, style, signature item |
| Personality | Core traits, temperament, quirks |
| Background | Formative events, upbringing, turning points |
| Motivation | What they want and why |
| Flaws & fears | Weaknesses, blind spots, what they avoid |
| Secret / hook | Something unresolved that invites a story |
| Relationships | Allies, rivals, family, debts |
| Voice | How they speak, verbal habits, a sample line |

#### Constructed beings (robots, androids, AIs)
Setting **Nature** to *constructed* swaps the tables behind each core field, so a machine character works in every mode — a warforged NPC in Tabletop mode, an android protagonist in Writer mode:

| Core field | Living being | Constructed being |
|---|---|---|
| Origin | Birthplace, family | Maker, purpose built for, whether they still serve it |
| Upbringing | Childhood | Training, programming, the moment they became more than their function |
| Formative event | Turning point in life | Awakening, malfunction, reassignment, first act against orders |
| Flaws & fears | Weaknesses, phobias | Hard-coded limits, glitches, obsolescence, shutdown, memory wipe |
| Want vs. need | Personal desire | e.g. built to obey but wants to choose; wants to be human, needs to accept what it is |
| Relationships | Family, friends, rivals | Creator, owner, other units, the humans it serves or resents |
| Voice | Accent, verbal habits | Literal to uncannily warm, protocol phrases, emotional mimicry |
| Appearance | Build, features | Chassis, materials, wear and repairs, how human it looks |

### Mode Layers

**D&D / Tabletop Mode**
- Race/ancestry, class, level, alignment
- Ability scores and a compact stat block
- Plot hook tied to an adventuring party
- "How to play them" notes for the GM
- Detail slider: *Quick NPC* → *Major NPC* → *Full PC*

**Writer Mode**
- Want vs. need
- The lie they believe / the wound behind it
- Character arc (start → turning point → end state)
- Dialogue voice and things they'd never say aloud
- Role suggestions (protagonist, foil, mentor, antagonist)

**AI Persona Mode** (planned) — personalities for *real* AI systems
For game developers, chatbot builders, and anyone giving an AI assistant, companion, or AI-driven NPC a consistent character. Instead of a stat block or arc, it outputs a ready-to-use **persona brief**:
- Name, role, and one-line identity
- Backstory and the in-world reason it exists
- Tone, vocabulary, and formality level
- Core values and what it cares about
- How it handles questions it can't answer, mistakes, and pushback
- Topics it steers away from and how it stays in character
- Sample replies for common situations
- Export as a plain-text brief ready to paste into an AI system's instructions, plus JSON

**Planned modes**
- **Artist mode** — silhouette, color palette, costume and prop notes
- **Worldbuilding mode** — linked groups: families, crews, factions, rivals
- **Game-dev / screenwriting modes** — later, once the core is proven

---

## Design Principles

- **Coherence over randomness.** Generation follows cause and effect: background shapes skills, fears, and voice. Trait compatibility rules prevent nonsense combinations.
- **Every character has a hook.** A secret, want, debt, or contradiction that makes them usable immediately.
- **Lock and reroll.** Keep what you like at any level (a single trait, a whole section) and regenerate the rest.
- **Genre and tone controls.** Gritty fantasy, cozy small town, space opera, noir, and so on.
- **Curated content.** Hand-built word lists and templates to avoid repetitive output.
- **Export for each audience.** Stat blocks, character sheets, writer profiles, plain text.

---

## Prototype v0.1 — First Run

The first prototype proves the shared-core-plus-layers architecture with the two most different modes.

### In scope
- [x] Character Core data model (JSON schema)
- [x] Coherent core generator using linked trait tables (background → traits → flaws → voice)
- [x] **Tabletop mode**: system-agnostic layer + D&D 5e adapter, with Quick NPC and Full PC depths
- [x] **Writer mode** layer with want/need, wound, and arc
- [x] Hybrid generation: rules engine for structure, template prose layer (AI providers plug into the same interface later)
- [x] Installable, offline-capable PWA shell
- [x] Mode switching on an existing character without losing the core
- [x] Lock-and-reroll per section
- [x] Genre/tone selector (start with 3: high fantasy, modern, sci-fi)
- [x] Save characters locally and export as Markdown / JSON

### Out of scope (for now)
- Artist, worldbuilding, and other modes
- Linked casts and relationship graphs
- Accounts, cloud sync, sharing
- Image generation

### Success criteria
- A D&D-mode NPC is usable at the table in under 30 seconds.
- A Writer-mode character gives a writer at least one idea they didn't have before.
- Switching a character between modes keeps it recognizably the same person.
- Ten rolls in a row don't feel repetitive.

---

## Proposed Data Model (draft)

```json
{
  "id": "uuid",
  "genre": "high-fantasy",
  "nature": "living | constructed",
  "core": {
    "identity": { "name": "", "age": 0, "pronouns": "", "origin": "", "occupation": "" },
    "appearance": { "build": "", "features": [], "signatureItem": "" },
    "personality": { "traits": [], "temperament": "", "quirks": [] },
    "background": { "upbringing": "", "formativeEvent": "", "turningPoint": "" },
    "motivation": { "want": "", "why": "" },
    "flaws": { "weaknesses": [], "fears": [] },
    "hook": "",
    "relationships": [{ "type": "", "name": "", "note": "" }],
    "voice": { "style": "", "habits": [], "sampleLine": "" }
  },
  "layers": {
    "tabletop": {
      "archetype": "", "strengths": { "might": 0, "agility": 0, "wits": 0, "presence": 0, "resolve": 0 },
      "combatStyle": "", "abilities": [], "partyHook": "", "gmNotes": "",
      "systems": {
        "dnd5e": { "ancestry": "", "class": "", "level": 1, "alignment": "", "abilityScores": {} }
      }
    },
    "writer": { "need": "", "lie": "", "wound": "", "arc": { "start": "", "turn": "", "end": "" }, "role": "" }
  },
  "locks": []
}
```

---

## Grades, Reveal & Moral Compass (v0.3 prototype)

### Grade: from background extra to hero of legend
Every character is rolled **grade first**. Six ability scores are rolled with real dice (4d6, drop the lowest), and their total sets the grade, so the odds are the exact odds of rolling that well:

| Grade | Story weight | Dice total | Chance |
|---|---|---|---|
| Common | Background character | up to 73 | 49.4% |
| Uncommon | Named NPC | 74–78 | 26.6% |
| Rare | Supporting character | 79–83 | 16.7% |
| Epic | Protagonist | 84–87 | 5.4% |
| Legendary | Hero of legend | 88+ | 1.8% (1 in 55) |

The grade then shapes the whole character:
- **Ability scores:** the rolled dice become the D&D 5e scores, and the system-agnostic strengths flatten for extras and peak for heroes.
- **Gift:** none for Common; a knack, a talent, a rare power, or (at Legendary) a destiny. In the modern genre, Legendary gifts are superpowers.
- **Stakes:** secrets, wants and defining events are steered toward the grade. Extras have small secrets; heroes carry world-shaking ones.
- **Story depth:** background characters get a role and a want; named NPCs add a lie and a wound; supporting characters and up get a full arc. Epic and Legendary characters are cast as protagonists, antagonists or rivals.
- **Moral extremes:** higher grades sit further toward the edges of the moral compass, so heroes and villains are paragons and monsters.

**Lock grade** keeps a hero and rerolls everything else. `node tools/rarity-sim.js` confirms simulated grades match the exact dice odds.

### The reveal
The name spins like a slot reel, the six dice tumble and land one by one, the grade stamps in, and then the sections flip in, with chimes for rare pieces. Legendary rolls get a shimmer and a burst of sparks. Click anywhere or roll again to skip; **Reveal → Fast** skips the animation, and reduced-motion settings skip it automatically.

### Moral compass
Every character sits on two axes: **Order ↔ Freedom** and **Mercy ↔ Ruthlessness**, built from their traits, history and wants. The nine regions are named (Guardian, Good Samaritan, Rebel with a cause, Rule keeper, Pragmatist, Free agent, Iron fist, Mercenary, Wildfire). Each character also has **a line they won't cross** and **what would push them over it**. Adapters translate the compass: D&D 5e gets one of the nine alignments.

### Real-world data
Modern occupations still come up in proportion to real U.S. job counts (Bureau of Labor Statistics, 2025, square-root damped), and the "How the grade works" panel shows each piece's tier and source. Name, culture, pronouns, ancestry and age are never rated.

### Guardrails
- Randomness is never tied to money: no paid rolls, rerolls or odds boosts.
- No streak penalties or pressure notifications.
- The reveal is optional and skippable.

### Next for gamification (not built yet)
- Collection log ("37 of 120 secrets discovered")
- Achievements (first Legendary, a full cast, every genre)
- Real statistics for modern life events

---

## Roadmap

| Phase | Goal |
|---|---|
| **v0.1** | Core + D&D + Writer modes, local save, export |
| **v0.2** | Grades, slot-style reveal and moral compass (prototype built), collection log, achievements, constructed beings (robots, androids, AIs) in the core, D&D 3.5e adapter, bring-your-own-key AI prose, Artist mode, more genres, larger curated tables |
| **v0.2.5** | **AI Persona mode**: persona briefs for real chatbots, assistants, and AI-driven NPCs |
| **v0.3** | Worldbuilding mode: linked casts and relationship maps |
| **v0.4** | Accounts, cloud library, sharing |
| **Later** | Additional modes, community content packs, integrations (VTTs, writing tools) |

---

## Key Decisions

### 1. Hybrid generation: rules for structure, AI for prose
- **Rules engine** (deterministic, seedable) picks every structured field from curated, linked tables: origin, traits, flaws, class, stats, arc beats. This guarantees coherence, respects locks, and makes rerolls predictable.
- **AI layer** turns the structured skeleton into prose: backstory narrative, voice sample lines, GM notes, arc descriptions. It may elaborate, but never contradicts or overrides a rule-chosen field.
- **Graceful fallback:** every prose field has a template-based version, so the app works fully offline or without an AI connection. AI is an enhancement, not a dependency.

**Zero-budget AI strategy.** The project has no money to spend on AI yet, so the prose layer is built as a pluggable interface (`ProseProvider`) with providers added in this order:

| Order | Provider | Cost to the project | Notes |
|---|---|---|---|
| 1 | **Template prose** (built in) | Free | Ships in v0.1. Rich, varied templates driven by the structured fields. The app is complete with this alone. |
| 2 | **Bring your own key** | Free | Optional setting: users paste their own AI provider key, stored only on their device; calls go straight from the browser. No backend. |
| 3 | **In-browser model** | Free | Experiment with a small open model running on-device (e.g. via WebGPU). Large first download and needs a capable device, so it stays optional. |
| Later | **Hosted proxy** | Paid | Only if the project gains funding or revenue. |

v0.1 needs **no server at all**.

```
 user settings + locks ─► Rules Engine ─► structured character (JSON)
                                                  │
                                                  ▼
                                   AI Prose Layer (optional)
                                                  │
                                                  ▼
                                   finished character + prose
```

### 2. Tabletop support via system adapters
The tabletop mode is itself layered, so any system can be supported:

```
 Character Core
      └─► Tabletop Layer (system-agnostic)
              ├─► 1. D&D 5e adapter              (v0.1)
              ├─► 2. D&D 3.5e adapter            (v0.2)
              ├─► 3. Generic / system-agnostic sheet export
              ├─► 4. Pathfinder 2e adapter
              ├─► 5. OSR / classic-style adapter
              └─► 6. Narrative systems (PbtA, FATE)
```

The agnostic layer itself ships in v0.1 as the base every adapter reads from; adapter #3 simply exports it as a standalone, rules-light character sheet for any game. Order after #3 is flexible and can follow user demand.

- **System-agnostic layer** describes the character in universal terms: archetype/role (warrior, caster, skulker, face…), relative strengths on a 1–5 scale, combat style, notable abilities, party hook, GM notes.
- **System adapters** translate the agnostic layer into a specific ruleset's stat block (5e ability scores, class, level, etc.). Adding a new system means writing one adapter, not touching the core.
- **v0.1 ships** the agnostic layer plus the **D&D 5e adapter**.

### 3. Platform: Progressive Web App
- Installable on desktop and mobile from the browser, one codebase.
- **Offline-first:** rules engine, tables, and template prose run entirely on-device; the AI prose layer is used when online.
- Characters stored locally (IndexedDB), with export to Markdown / JSON.

### 4. Content: locked tables for now
- All generation tables are curated and bundled with the app; users cannot add or edit tables in v0.1.
- Tables are still stored as versioned data files (not hard-coded), so user content packs can be opened up later without a rewrite.

### 5. Licensing: open game content only
Each adapter uses only material its publisher has released under an open license, and the app includes the required attribution notices.

| System | Source | License |
|---|---|---|
| D&D 5e | System Reference Document (SRD 5.1 / 5.2) | Creative Commons Attribution 4.0 |
| D&D 3.5e | d20 System Reference Document | Open Game License 1.0a |
| Pathfinder 2e | Pathfinder Reference Document | ORC License |
| Original Castmaker content | Tables, templates, prose | CC BY 4.0 (see decision 6) |

Rules:
- Never use non-SRD names, classes, subclasses, monsters, or setting content (e.g. product-identity names and characters).
- Keep each system's licensed content in its own data folder with its license and attribution file alongside it.
- Don't use publisher trademarks or logos in branding; state compatibility in plain text only.
- Re-check each license's current terms before shipping an adapter.

### 6. Project licensing and content sources

**Castmaker's own work is open.**
- **Code:** MIT License — simple and permissive, ideal while prototyping. It can be revisited before any commercial release.
- **Original content** (tables, templates, prose written for Castmaker): CC BY 4.0, so others can reuse it with credit.

**Content sources: go as deep as open licensing allows.** To make characters rich, Castmaker draws on every openly usable source it can, not just game SRDs:

| Category | Examples | Typical license |
|---|---|---|
| Game rules documents | 5e SRD, 3.5e d20 SRD, Pathfinder 2e reference | CC BY 4.0, OGL 1.0a, ORC |
| Public domain | Myths, folklore, fairy tales, classic literature, historical occupations and titles | Public domain |
| Name data | Government census and baby-name statistics, historical name records | Public domain / open data |
| Open datasets | Open dictionaries and thesauruses, word lists, color and fabric names | CC0, CC BY, similar |
| Original writing | Hand-written Castmaker tables and templates | CC BY 4.0 |

**Compatibility rules**
- Prefer **public domain, CC0, and CC BY** sources; they mix freely with MIT code and CC BY content.
- **Share-alike sources (CC BY-SA)** are allowed only in their own clearly separated data packs, since they'd otherwise require the whole content set to be share-alike.
- **OGL content** stays in its own pack with the OGL text and its Section 15 notice; it is never merged into Castmaker's original tables.
- **Non-commercial (NC) and unclear-license sources are excluded**, so the project never boxes itself out of a future release.
- Every data pack records its **source, license, and attribution** in a manifest, and the app generates a combined credits page from those manifests.

---

## Open Questions

- Which device and model size is realistic for the in-browser AI experiment.

---

## Getting Started

No build step and no dependencies. Serve the folder with any static web server, because browsers block JavaScript modules opened straight from disk:

```bash
python3 -m http.server 8080      # then open http://localhost:8080
node tools/smoke-test.js 300     # rolls 900 characters and checks every output
python3 tools/build-preview.py   # optional: single-page copy for hosts that wrap the HTML
```

Install it as an app from the browser's address bar (Chrome, Edge) or Share → Add to Home Screen (Safari). After the first visit it works offline.

## Project Structure

```
index.html, styles.css          app shell and design
manifest.webmanifest, sw.js     PWA install and offline cache
js/app.js                       interface
js/storage.js                   local cast library (IndexedDB, in-memory fallback)
js/export.js                    Markdown and JSON export
js/reveal.js                    slot-style reveal and synthesized sounds
js/engine/dice.js               real dice: 4d6-drop-lowest odds and grade bands
js/engine/rarity.js             grade summary and piece rarity
js/data/rarity.js               rarity tiers and real-world statistics
js/engine/rng.js                seeded random numbers (same seed, same character)
js/engine/generate.js           rules engine: sections, tag-weighted picks, locks, rerolls
js/engine/text.js               pronoun agreement and text tokens
js/engine/adapters/dnd5e.js     D&D 5e adapter (SRD 5.1 only)
js/prose/provider.js            ProseProvider interface (templates now, AI later)
js/prose/templates.js           built-in template prose
js/data/shared.js               genre-neutral tables
js/data/genres/*.js             fantasy, modern and sci-fi tables
tools/smoke-test.js             automated generation checks
tools/rarity-sim.js             grade, role and morality simulator
```

### How coherence works
Each section records the tags of what it picked (`loss`, `crime`, `faith`, …). Later picks are weighted toward entries that share those tags, so a thieves'-den upbringing makes a betrayal more likely, which makes a suspicious personality more likely, which shapes the flaws, the lie the character believes, and the class they end up with. Locked sections keep their content but still steer everything rolled around them.

## Status

**v0.3 prototype:** all v0.1 scope items are in place, plus grade-first rolling, the slot-style reveal and the moral compass. Name is still a working title.
