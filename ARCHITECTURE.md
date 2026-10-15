# Architecture

Castmaker has two halves with a hard line between them:

- **`src/engine/`** decides everything about a character. It is plain TypeScript with no browser code, so it runs the same in the app, the tests, the command-line tools, and anywhere else (a server, a bot, another app). Its public API is `src/engine/index.ts`.
- **`src/ui/`** shows a character and lets people roll, lock, save and export. It only talks to the engine through that public API.

```
          settings, locks                    Character (plain JSON)
  src/ui ───────────────▶ src/engine ───────────────────────────▶ src/ui
                           │  generate.ts   rules: what is true
                           │  prose/        words: how it reads
                           │  adapters/     rules systems (D&D 5e)
                           │  export.ts     Markdown / JSON
```

## A character

A `Character` (see `types.ts`) is plain, serializable JSON:

- `seed`: every roll is reproducible. Each section gets its own random stream seeded with `seed:section:nonce`, so rerolling one section (which bumps its nonce) never disturbs the others.
- `core`: the sections shared by every mode, in roll order: grade, identity, love, background, personality, flaws, motivation, morality, gift, appearance, voice, hook, relationships.
- `layers`: what each mode adds on top of the core (`tabletop`, `writer`).
- `locks`: sections that keep their content on the next roll.
- `version`: the shape version. `upgradeCharacter()` brings older saved characters up to date by rerolling only the sections whose shape changed.

Characters hold facts, not finished sentences. Text with `{tokens}` such as `{they}` or `{s}` is filled in at display time by `fill()` in `text.ts`, which handles pronoun–verb agreement.

## How a roll works

1. **Grade first.** Six ability scores are rolled with real 4d6-drop-lowest dice (`dice.ts`); their total sets the grade from Common to Legendary. The grade then scales the stakes of everything after it: how many gifts and how strong, how dramatic the event and the secret, how extreme the moral profile.
2. **Sections in order, each steering the next.** Every table entry carries theme tags (`loss`, `crime`, `faith`, …). Each section adds its tags to a running bag, and later picks are weighted toward entries that share them. That is what makes a thieves'-den upbringing lead to a betrayal, a suspicious temperament, a matching flaw and a fitting class. Locked sections keep their content but still add their tags.
3. **Rerolls cascade.** Rerolling a section also rerolls the unlocked sections that depend on it (`DEPENDENTS` in `generate.ts`), so a new background brings new flaws and a new writer arc rather than leaving them stale.
4. **Variety memory.** With `avoidRepeats` on, recently seen lines are down-weighted so a sitting of 20 rolls stays fresh. It is off by default, so the same seed always gives the same character.

## Prose

Rules decide every fact; a `ProseProvider` (`prose/provider.ts`) only writes sentences about those facts. The built-in `TemplateProvider` works offline. Future AI providers (bring-your-own-key, on-device) plug into the same interface, start from the template result, and fall back to it if a call fails.

## Rules systems

The tabletop layer is system-agnostic (archetype, five strengths rated 1–5, combat style). Adapters in `adapters/` translate it into a specific game. The D&D 5e adapter uses the character's actual rolled scores and only SRD 5.1 material. A new system is a new adapter file plus an entry in the export and the sheet.

## Content

Tables live in `src/engine/data/`: genre-neutral tables in `shared.ts`, psychology tables (Big Five, flaws, fears, Moral Foundations, Schwartz values) in `psyche.ts`, real-world odds in `rarity.ts` and `orientation.ts`, and one file per genre in `genres/`. Every table is typed, so a missing field is a compile error, and the content sweep in `tests/unit/content.test.ts` rolls over a thousand characters to catch broken tokens and grammar. Sources and licenses are listed in `CREDITS.md`.

## The interface

No framework: modules that render HTML strings with every piece of character text escaped (`esc()` in `dom.ts`), and one delegated click handler in `main.ts` that routes `data-action` and `data-group` attributes to `actions.ts`. `state.ts` holds settings and the current character. The cast is stored in IndexedDB with an in-memory fallback (`storage.ts`). The reveal (`reveal.ts`) and synthesized sound (`audio.ts`, `sound.ts`) are presentation only and never affect what is rolled.

## Build and offline

Vite builds the app. `vite-plugin-pwa` generates the manifest and a Workbox service worker that precaches the app and caches web fonts, so the app works offline after the first visit. The service worker is not registered when the app is embedded in another page.

## Tests

| Layer | Where | What it guards |
|---|---|---|
| Unit | `tests/unit/*.test.ts` | Dice odds, seeded RNG, text tokens, locks, rerolls, grade distribution, upgrades, the 5e adapter, export |
| Content | `tests/unit/content.test.ts` | No unfilled tokens, missing values or pronoun disagreement across 1,200 characters; table integrity |
| Snapshot | `tests/unit/snapshot.test.ts` | Fixed seeds give fixed output, so any change to generation shows up in review |
| Browser | `tests/e2e/app.spec.ts` | Real user flows on desktop and phone, against the production build |
| Accessibility | `tests/e2e/a11y.spec.ts` | WCAG 2.1 AA checks with axe |
