# dsh-natsci-writing

A **DeepSeek Harness** bundle that puts a scientific-writing studio in the sidebar and
serves a bilingual writing system — English and Chinese — to any Session: manuscripts,
academic reports, submission-grade figure sets, reviewer responses and journal formatting.

[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](#license)
[![DeepSeek Harness](https://img.shields.io/badge/DeepSeek%20Harness-%E2%89%A5%200.2.2--rc.5-4B4B4B.svg)](https://github.com/deepseek-ai/deepseek-harness)
[![Read-only](https://img.shields.io/badge/data-read--only-2ea44f.svg)](#safety)
[![Topic: dsh-plugin](https://img.shields.io/badge/topic-dsh--plugin-8250df.svg)](https://github.com/topics/dsh-plugin)
[![selftest](https://github.com/Travis13197/NatSci-Writing-DeepSeekHarness/actions/workflows/selftest.yml/badge.svg)](https://github.com/Travis13197/NatSci-Writing-DeepSeekHarness/actions/workflows/selftest.yml)

## 中文速览

侧栏「写作台」把科研写作的五个交付场景（完整论文、投稿图件、学术报告、审稿回复、润色与期刊格式）
变成一键起手：点一下就把可编辑的提示词填进新会话。

- 内置规则库：英文 26 份、中文 27 份，每种语言 19 个模板，外加 Python / R 起手代码。
- `natsci_studio` 工具：任何会话都能按语言读取规则、模板与指南；只读、不联网、不写工作区。
- 安装：`dsh plugin --profile <profile> add github:Travis13197/NatSci-Writing-DeepSeekHarness`

完整中文说明见 [README.zh.md](README.zh.md)。

## What it adds

- **Sidebar entry** — a Studio icon in the left column opens the writing studio in the main column.
- **Studio panel** — five deliverable cards, each writing an editable starter prompt into a new
  Session (or copying it): complete manuscript, submission figure set, academic report, reviewer
  response, polish and journal format. It also carries a Nature/Science figure-specification
  quick reference, a template library, and a clickable index of every bundled rule.
- **`natsci_studio` tool** — one read-only Host tool for every Session:
  - `{ action: "catalog" }` lists the modes and both language sets.
  - `{ action: "brief", mode }` returns one mode's workflow and acceptance checklist
    (`manuscript`, `figures`, `report`, `revision`, `polish`).
  - `{ action: "read", kind, name, lang }` returns one `template`, `code`, `reference` or the
    parent `skill` guide; `lang` is `en` (default) or `zh`.

## Install

**From GitHub** (no build step; the bundle is plain JavaScript):

```sh
npx @deepseek-ai/dsh plugin --profile <profile> add github:Travis13197/NatSci-Writing-DeepSeekHarness
```

**From a local directory**: Plugins → Add plugin → select this directory.

**From a tarball**: `pnpm pack`, then `dsh plugin --profile <profile> add ./dsh-natsci-writing-1.1.1.tgz`.

**From npm** (once published): `dsh plugin --profile <profile> add dsh-natsci-writing`.

Then restart or reload that profile and refresh the page; the Studio icon appears in the sidebar.

## Library

| Set | Rule documents | Templates | Starter code | Parent guide |
|---|---|---|---|---|
| English | 26 | 19 | Python, R | `library/SKILL.md` |
| Chinese | 27 | 19 | Python, R | `library/zh/SKILL.md` |

Content covers argument architecture, section craft, editorial fit, information architecture,
statistics and reporting integrity, literature search, proofreading, AI-use and AI-figure
integrity, figure contracts and caption grammar, journal specifications, and reviewer-response
packages. Every file ships inside the package: no network access at runtime.

## Compatibility

`engines.dsh`: `>=0.2.2-rc.5 <0.3.0-0`. Verified against the running DSH 0.2.2-rc.5, and the
compatibility gate refuses 0.3.0 until it is tested.

## Safety

- Reads only files inside this package. No network calls, no workspace writes, no session events.
- Panel actions do two things only: fill a starter prompt into a new Session, or copy text.
- Nothing is sent automatically; disable the bundle to remove both the entry and the tool.

## Development

```sh
node scripts/selftest.mjs     # 135 checks: manifest, display, both libraries, tool actions
node scripts/build-index.mjs  # regenerate distribution/index.json after a version bump
pnpm pack                     # verify the published file list
```

Desktop ships no `node` on `PATH`; run the same scripts with the app's own executable and
`ELECTRON_RUN_AS_NODE=1`.

## Repository topics

Add these in the repository's **About** panel (or with `gh repo edit --add-topic`) so the
package is discoverable from GitHub search and community plugin indexes:

```text
dsh-plugin, deepseek-harness, deepseek, dsh, ai-agent, llm,
scientific-writing, academic-writing, manuscript, research, figures,
nature, science, peer-review, publishing, prompt-library, skills,
sidebar, plugin-market, javascript
```

`package.json` carries the same vocabulary as npm keywords. The bundle also ships
`distribution/index.json`, a ready-to-host plugin index: publish `distribution/` on any static
HTTPS host and others can add that URL under Plugins → Discover → Add index source.

## License

Apache-2.0. The bundled library derives from the author's NatSci-Writing-skills system and is
distributed under the same license; see `LICENSE` and `NOTICE.md`.
