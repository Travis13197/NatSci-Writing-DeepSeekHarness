# Changelog

## 1.1.5 — 2026-11-26

- Bundled library upgraded to NatSci-Writing-skills **1.2.8.0**: the English set now carries 33 reference rules and the Chinese set 35, including `journal-templates-and-assembly.md` / `-zh`.
- The library now ships `assets/journal-templates/` (Nature and Science specs, generated .docx/.tex templates, source registry), so the studio can point a session at a journal format and its assembly rules.
- `index.js` `LIBRARY_VERSION` 1.2.8.0; client rule index and chip counts follow the library (33/35); locale strings updated.


## 1.1.4 — 2026-11-25

- Bundled library upgraded from NatSci-Writing-skills **1.2.6.2** to **1.2.7.0**:
  the English set now carries 32 reference rules and the Chinese set 34 (66 total),
  including the new `defensive-writing-and-argument-selection.md` / `-zh` and the six
  rules that were previously excluded from the bundle.
- `SKILL.md` in both language sets is now the released 1.2.7.0 guide verbatim, so every
  `references/…` path cited by the guide resolves on disk.
- The manuscript and polish briefs gained the defensive-argument gate: one limitation
  paragraph only, a deletion test for every hedge, and
  `python tools/check_prose_style.py <file> --gate` in acceptance.
- `index.js`: `LIBRARY_VERSION` 1.2.7.0; reference notes cover the newly bundled rules.
- Locales report 66 rules (32 English, 34 Chinese) instead of 53.


## 1.1.3 — 2026-11-24

- `distribution/index.json` can now list a **Git source** (`git+…github…git#<commit>`), so
  the self-hosted index is installable before the package reaches npm; `--source=npm`
  switches to the registry after `pnpm publish`. `scripts/build-index.mjs` reads the
  commit from `.git` without spawning git.
- New `.github/workflows/pages.yml` publishes `distribution/` to GitHub Pages, giving the
  plugin index a stable URL.
- READMEs document both index source modes and the Pages one-time setup.
- Selftest 135 checks unchanged.

## 1.1.2 — 2026-11-24

- README gains a step-by-step install guide for both languages: prerequisites, four
  install routes (GitHub, in-app folder, tarball, npm), post-install verification,
  update and removal — with the repository URL and the tested DSH version.
- Author metadata is **Chuanyang Liu**: `package.json` `author`, the NOTICE copyright
  line, and the LICENSE section of both READMEs.
- `distribution/index.json` regenerated for 1.1.2.

## 1.1.1 — 2026-11-24

Project-agnostic content and a publishable repository.

- Removed the project-specific documents from both language sets (worked case study,
  project conventions, project figure gates, dimension annotation, translation log),
  and rewrote the prose in the parent guides, `figure-production`, the Perspective
  production rule, the figure-contract template and the figure brief so nothing names
  a particular project. Rule counts are now 26 English and 27 Chinese.
- Repository metadata points at `NatSci-Writing-DeepSeekHarness`; npm keywords expanded
  to the discovery vocabulary; `engines.dsh` unchanged.
- README is English-first with a short Chinese overview; `README.zh.md` is the full
  Chinese version. Both list the recommended GitHub topics for exposure.
- `distribution/index.json` regenerated for 1.1.1.

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
