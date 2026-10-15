# Changelog

All notable changes to Castmaker are listed here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## Unreleased

### Changed
- Rewritten in strict TypeScript and built with Vite. Generation is unchanged: the same seed gives the same character as before.
- The character engine is a standalone library (`src/engine/`) with a typed public API, separate from the interface.
- The interface is split into small modules.
- The offline service worker and manifest are generated at build time.
- GitHub Pages deploys the built app through GitHub Actions after CI passes.

### Added
- Unit, content-sweep and snapshot tests (Vitest), with coverage thresholds.
- Browser and accessibility tests on desktop and phone (Playwright and axe).
- Continuous integration, Dependabot, and contributor docs.

### Removed
- The `.nojekyll` file and single-page preview script, no longer needed.

## 0.1.0 - Prototype

### Added
- A shared character core with Tabletop (system-agnostic and D&D 5e) and Writer layers, in fantasy, modern and sci-fi genres.
- Grades from Common to Legendary, rolled with real 4d6-drop-lowest dice, scaling gifts, stakes and moral extremity.
- Big Five personality, layered flaws and fears, Moral Foundations and Schwartz values, orientation and love life.
- Slot-style reveal with synthesized sound, lock-and-reroll per section, and a no-repeat memory for variety.
- Local cast library, Markdown and JSON export, and an installable offline PWA.
