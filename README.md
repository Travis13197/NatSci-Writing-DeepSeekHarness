# dsh-natsci-writing

A DeepSeek Harness bundle that puts a scientific writing studio in the sidebar and
serves the [NatSci-Writing-skills](https://github.com/Travis13197/NatSci-Writing-skills)
1.2.6.2 library — English and Chinese — to any Session.

## What it adds

- **Sidebar entry** — the Studio icon in the left column opens the NatSci writing
  studio in the main column.
- **Studio panel** — five deliverable cards (complete manuscript, submission figure set,
  academic report, reviewer response, polish and journal format). Each card writes an
  editable starter prompt into a new Session's composer, or copies the prompt. The panel
  also shows the Nature/Science figure specification quick reference, the template and
  starter-code library (19 templates, 2 starter scripts), and a clickable index of all
  64 reference rules (31 English, 33 Chinese).
- **`natsci_studio` tool** — a read-only Host tool available to every Session of
  this profile:
  - `{ action: "catalog" }` lists the five modes and every document in both sets.
  - `{ action: "brief", mode }` returns one mode's workflow and acceptance
    checklist (`manuscript`, `figures`, `report`, `revision`, `polish`).
  - `{ action: "read", kind, name, lang }` returns one document (`template`, `code`,
    `reference`, or `skill` for the parent `SKILL.md`); `lang` is `en` (default) or
    `zh`, and the two sets use different file names. References are previewed to
    24,000 characters with the local path for the rest.

## Layout

```
dsh-natsci-writing/
├── index.js              Host half: registers natsci_studio
├── client.js             Client half: sidebar entry + studio panel
├── cordis.patch.yml      Bundle row
├── library/
│   ├── SKILL.md          Parent guide (en)
│   ├── briefs/           Five deliverable briefs this bundle adds (zh)
│   ├── references/       31 English reference rules
│   ├── assets/
│   │   ├── templates/    19 English templates
│   │   └── code/         Python and R figure starter scripts
│   └── zh/               Chinese set, same layout: SKILL.md, 33 references, 19 templates, 2 scripts
├── locale/en.json, zh.json
├── docs/                 Plugin detail document and one feature image
├── distribution/         Ready-to-host plugin index
├── scripts/              selftest.mjs, build-index.mjs
└── icon.svg
```

## Behaviour and limits

- Reads only files inside this package. No network calls, no workspace writes, no
  session events.
- The panel's actions only open a new Session with a prompt, or copy text; nothing
  is sent automatically.
- The library is NatSci-Writing-skills 1.2.6.2 (`skills/natsci-writing` and
  `skills/natsci-writing-zh`), Apache-2.0, copied unchanged; the five briefs are
  written for this bundle. See `LICENSE` and `NOTICE.md`.
- Disable the bundle to remove both the sidebar entry and the tool.

## Test

`scripts/selftest.mjs` checks the installed package without a Harness process: manifest
and submission metadata, display resources, artwork limits, both library inventories,
that the Client half's embedded counts and rule index still match the files on disk,
the market index, and every tool action including its rejections.

```
node scripts/selftest.mjs
```

Desktop ships no `node` on `PATH`; run it with the app's own executable:

```
$env:ELECTRON_RUN_AS_NODE=1; & "C:\Users\<you>\AppData\Local\Programs\DeepSeek Harness\DeepSeek Harness.exe" scripts\selftest.mjs
```

## Publish and share

- `node scripts/build-index.mjs` regenerates `distribution/index.json` after a version
  bump; host `distribution/` on any static HTTPS host and others can add that URL as an
  index source in **Plugins → Discover → Add index source**.
- Publish to npm (`pnpm publish`), then `dsh plugin --profile <profile> add dsh-natsci-writing`
  installs the built package for anyone.
- Add the `dsh-plugin` GitHub topic to the repository, and link the package from the
  NatSci-Writing-skills release notes, so the two projects point at each other.
- Repository and homepage fields point at `github.com/Travis13197/dsh-natsci-writing`;
  change them if the package lives elsewhere.

## Install

Profile → **Plugins** → **Add plugin** → this directory, or install the directory as
a bundle in the current profile.
