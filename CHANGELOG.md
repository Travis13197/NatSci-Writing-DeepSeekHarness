# Changelog

## 1.1.0 — 2026-11-24

Library updated to NatSci-Writing-skills **1.2.6.2**, English and Chinese.

- Library: 31 English reference rules (was 17) and 33 Chinese ones, 19 templates
  (was 6) per language, and updated Python/R starter code. The Chinese set is new
  to this bundle; the parent `SKILL.md` ships for both languages.
- Tool: `natsci_studio` gains a `lang` parameter (`en` default, `zh`) for
  `read`; `skill` reads the guide of the chosen language; `catalog` lists both
  sets and the new documents.
- Panel: the rule index now carries both sets (64 rules) with language labels; the
  template list grew from 8 to 21 entries; chips show the real counts and the
  library version.
- Briefs: refreshed against 1.2.6.2 — each names the library version, the new
  references (editorial fit, statistics/reporting integrity, information
  architecture, AI-use and AI-figure integrity, proofreading, section craft) and
  the new templates (cover letter, editorial audit, evidence map, AI disclosure,
  change log, innovation canvas, literature plan).
- Submission readiness: `license`, `author`, `repository`, `homepage`, `bugs`,
  `keywords`, `engines.dsh`, `publishConfig`, npm scripts, `README.zh.md`,
  `.gitignore`, and a ready-to-host plugin index under `distribution/`
  (`scripts/build-index.mjs`); `scripts/selftest.mjs` extended to check
  publishability, package files and index consistency.

## 1.0.0 — 2026-11-24

First release.

- Sidebar entry (`sidebar.panellist`, id `natsci`, order 5) and the main-column
  studio page (`main`, key `natsci`).
- Five deliverable cards — complete manuscript, submission figure set, academic
  report, reviewer response, polish / journal format — each writing an editable
  starter prompt into a new Session, with copy-to-clipboard and a prompt preview.
- Nature/Science figure-specification quick reference.
- Template and starter-code library (6 templates, Python and R figure starters),
  opened through the Host tool so the page keeps no second copy.
- Clickable index of the 17 reference rules.
- `natsci_studio` Host tool: `catalog`, `brief` (5 modes), `read`
  (`template` / `code` / `reference` / `skill`), read-only inside the bundle.
- Bundled NatSci-Writing-skills v1.0.0 library (Apache-2.0): 17 reference rules,
  6 templates, 2 starter scripts, and the parent `SKILL.md`.
- Display resources: en/zh metadata, original icon, one-image detail page in both
  languages, `README.md` / `README.zh.md`, `LICENSE`, `NOTICE.md`.
- `scripts/selftest.mjs` (80 checks) and `scripts/build-index.mjs` with a
  ready-to-host plugin index under `distribution/`.
