# dsh-natsci-writing

一个 **DeepSeek Harness**（DSH）组合包：在侧栏放一个科研写作台，并把一套中英双语的科研写作体系
交给任意会话使用——完整论文、学术报告、投稿级图件、审稿回复与期刊格式。

[English](README.md) | 中文

## 提供什么

- **侧栏入口**：左栏面板列中的「写作台」图标（`sidebar.panellist`，id `natsci`），点开是主列的写作台页面。
- **写作台页面**：五张起手卡——完整论文 / 投稿级图件 / 学术报告 / 审稿回复 / 润色与期刊格式。
  「新建会话并填入」把一条可编辑的起始提示词写进新会话输入框，「复制提示词」直接复制。
  页面另有 Nature/Science 图件规格速查、模板库，以及全部内置规则的可点击索引。
- **`natsci_studio` 工具**（任何会话可用，只读）：
  - `{ action: "catalog" }`：列出 5 个模式与两套语言库的全部文档。
  - `{ action: "brief", mode }`：返回该模式的流程与验收清单。
  - `{ action: "read", kind, name, lang }`：读取 `template` / `code` / `reference` / `skill`（父级指南）；
    `lang` 取 `en`（默认）或 `zh`。

## 内置库

| 语言 | 规则文档 | 模板 | 起手代码 | 父级指南 |
|---|---|---|---|---|
| 英文 | 26 | 19 | Python、R | `library/SKILL.md` |
| 中文 | 27 | 19 | Python、R | `library/zh/SKILL.md` |

覆盖论证结构、章节写法、编辑契合度、信息架构、统计与报告诚信、文献检索、校对、AI 使用与
AI 图件诚信、图件合同与图注语法、期刊规格、审稿回复包等。全部文件随包提供，运行时不联网。

## 安装

**从 GitHub 安装**（纯 JavaScript，无需构建）：

```sh
npx @deepseek-ai/dsh plugin --profile <profile> add github:Travis13197/NatSci-Writing-DeepSeekHarness
```

**本地面板**：插件页 → 添加插件 → 选择本目录。

**tarball**：`pnpm pack`，再 `dsh plugin --profile <profile> add ./dsh-natsci-writing-1.1.1.tgz`。

**npm**（发布后）：`dsh plugin --profile <profile> add dsh-natsci-writing`。

安装后重启或重载该 profile 并刷新页面，侧栏出现「写作台」。

## 兼容性与安全

- `engines.dsh`：`>=0.2.2-rc.5 <0.3.0-0`，在 DSH 0.2.2-rc.5 上验证；0.3.0 会被兼容性检查拦下。
- 只读取本包内的文件：不联网、不写工作区、不追加会话事件。
- 面板按钮只做两件事：把提示词填进新会话输入框，或复制文本；不会自动发送。
- 停用组合包即同时移除侧栏入口与工具。

## 开发

```sh
node scripts/selftest.mjs     # 135 项自测：清单、展示资源、两套库、工具动作
node scripts/build-index.mjs  # 版本变更后重建 distribution/index.json
pnpm pack                     # 校验发布文件清单
```

Desktop 自带环境没有 `PATH` 上的 `node`，用应用自身的可执行文件并设置 `ELECTRON_RUN_AS_NODE=1` 运行同样的脚本。

## 曝光与分发

- 仓库建议加 topics：`dsh-plugin`、`deepseek-harness`、`deepseek`、`dsh`、`ai-agent`、`llm`、
  `scientific-writing`、`academic-writing`、`manuscript`、`research`、`figures`、`nature`、`science`、
  `peer-review`、`publishing`、`prompt-library`、`skills`、`sidebar`、`plugin-market`、`javascript`。
- `package.json` 的 `keywords` 与上面同一套词，供 npm 搜索使用。
- `distribution/index.json` 是可直接托管的插件索引：把 `distribution/` 发布到任意静态 HTTPS 主机，
  其他人把该 URL 加进「插件 → 发现 → 添加索引源」即可浏览安装。

## 许可证

Apache-2.0。内置规则库由作者的科研写作体系整理而成，采用同一许可证；见 `LICENSE` 与 `NOTICE.md`。
