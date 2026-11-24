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

> 仓库地址：<https://github.com/Travis13197/NatSci-Writing-DeepSeekHarness>
> 需要 DeepSeek Harness `>= 0.2.2-rc.5`（在 0.2.2-rc.5 上验证）。无需构建、无需 API Key、运行时不联网。

### 先确认

- 已安装 DeepSeek Harness **桌面端**，或命令行里有 `dsh`。
- 准备一个 profile。桌面端默认用 `desktop`，命令行一般用 `web`；下面命令里的 `<profile>` 换成你的。
- 从 GitHub 安装需要 `npx`（Node.js ≥ 20）；从本地文件夹安装则两者都不需要。

### 方式 A — 从 GitHub 安装（推荐，无需构建）

```sh
npx @deepseek-ai/dsh plugin --profile <profile> add github:Travis13197/NatSci-Writing-DeepSeekHarness
```

直接读取仓库即可安装：本插件是纯 JavaScript，没有 `prepare`/构建步骤，安装时不会在你的机器上执行额外代码。

### 方式 B — 在应用内从文件夹安装

1. 下载或克隆 <https://github.com/Travis13197/NatSci-Writing-DeepSeekHarness>。
2. 打开 DeepSeek Harness 左侧的 **插件** → **添加插件**。
3. 选择刚下载的文件夹并确认。
4. 刷新页面。

### 方式 C — 用 tarball 安装

```sh
pnpm pack                     # 生成 dsh-natsci-writing-<version>.tgz
dsh plugin --profile <profile> add ./dsh-natsci-writing-<version>.tgz
```

### 方式 D — 从 npm 安装（发布之后）

```sh
dsh plugin --profile <profile> add dsh-natsci-writing
```

### 安装完成后

1. **重启该 profile**：桌面端退出后重开；命令行停止后重新执行 `dsh web`。
2. **刷新页面**：左侧栏会出现 **写作台** 图标（位于「插件」与「定时任务」之间）。
3. **确认可用**：插件页里能看到 *NatSci writing studio* `1.1.3` 已启用；点「写作台」能看到五张起手卡和规则索引；
   在任意会话里让 Agent 调用 `natsci_studio`，参数 `{ "action": "catalog" }`。

### 更新与卸载

- **更新**：重新执行 `add github:...` 安装新版本，或在 **插件** 页面用该组合包的更新操作。
- **卸载**：`dsh plugin --profile <profile> remove dsh-natsci-writing`，或在 **插件** 页面卸载。
  停用该组合包会同时移除侧栏入口与工具。

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
  其他人把该 URL 加进「插件 → 发现 → 添加索引源」即可浏览安装。仓库自带 Pages 工作流，在
  **Settings → Pages → Source: GitHub Actions** 打开后会自动发布到
  `https://Travis13197.github.io/NatSci-Writing-DeepSeekHarness/index.json`。
  版本变更后运行 `node scripts/build-index.mjs` 重建；发布到 npm 之后改用 `--source=npm`。

## 许可证

Apache-2.0。作者：**Chuanyang Liu**（<https://github.com/Travis13197>）。
内置规则库由作者的科研写作体系整理而成，采用同一许可证；见 `LICENSE` 与 `NOTICE.md`。
