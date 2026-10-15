# Contributing

Thanks for helping. Castmaker is a prototype, so expect things to move.

## Setup

```bash
nvm use            # Node 22.18 or newer
npm install
npx playwright install chromium   # once, for the browser tests
npm run dev
```

## Before you open a pull request

```bash
npm run typecheck && npm run lint && npm run format:check && npm test && npm run e2e
```

CI runs the same checks on every pull request.

## Adding content

Most contributions are new table entries in `src/engine/data/`.

- **Write original text.** Content is licensed CC BY 4.0. Don't copy from books, games or websites. Public domain, CC0 and CC BY sources are welcome if you add them to `CREDITS.md`. Share-alike, non-commercial and unclear-license sources can't go in the core tables (see "Licensing" in the README).
- **Use the tokens.** Write `{they}`, `{them}`, `{their}` and add `{s}` or `{es}` to verbs (`{they} keep{s} a list`) so the line agrees with every pronoun. Fantasy, modern and sci-fi words that differ go through the genre's `vocab`.
- **Tag it.** Give each entry one to three theme tags from `TAGS` in `types.ts`. Tags are what make characters hang together.
- **Mind the grade.** Events, wants and secrets can carry a `tier` from 0 (everyday) to 4 (world-shaking). Gifts need a tier from 1 to 4.
- **Run `npm test`.** The content sweep rolls over a thousand characters and fails on unfilled tokens or verbs that disagree with the pronoun.
- **Check variety.** `npm run variety` shows how often lines repeat. A new entry should bring that number down, not up.

## Changing generation

Generation is seeded, so the snapshot tests will fail when you change what a seed produces. That's expected: look over the diff, and if the new output is what you meant, update the snapshots with `npm test -- -u` and commit them with your change.

If you change the shape of a section, bump `version` in `generate.ts` and teach `upgradeCharacter()` to recognize the old shape, so saved characters keep working.

## Code style

- Strict TypeScript; Prettier formats everything (`npm run format`).
- The engine never touches the DOM, storage or the network. The UI goes through `src/engine/index.ts`.
- Escape any character text you put into HTML with `esc()`.
- Plain, short sentences in the interface and docs.

## Commits

Small commits with a clear subject line in the imperative ("Add a sci-fi upbringing table"). Note user-visible changes in `CHANGELOG.md` under "Unreleased".

## License

By contributing, you agree that your code is licensed under the MIT License and your content under CC BY 4.0, as described in `LICENSE` and `CREDITS.md`.
