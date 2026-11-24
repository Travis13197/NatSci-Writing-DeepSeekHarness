# dsh-natsci-writing

一个 DeepSeek Harness（DSH）组合包：在侧栏放一个科研写作台，并把
[NatSci-Writing-skills](https://github.com/Travis13197/NatSci-Writing-skills)
**1.2.6.2** 的中英双语规则库交给任意会话使用。

## 增加了什么

- **侧栏入口**：左栏面板列中的「写作台」图标（`sidebar.panellist`，id `natsci`），点开是主列的写作台页面。
- **写作台页面**（`main`，key `natsci`）
  - 五张起手卡：完整论文 / 投稿级图件 / 学术报告 / 审稿回复 / 润色与期刊格式。
    「新建会话并填入」把一条可编辑的起始提示词写进新会话输入框，「复制提示词」直接复制，展开可看全文。
  - Nature / Science 图件规格速查（栏宽、panel 字母、字号、线宽、位图、矢量）。
  - 模板与起手代码库：19 个模板 + Python、R 两份起手代码。按钮让 Agent 通过工具读**原始文件**，页面不存副本。
  - 全部 64 条参考规则的可点击索引：英文 31 条、中文 33 条，点一条就让 Agent 读全文并对照当前稿件检查。
- **`natsci_studio` 工具**（任何会话可用，只读）
  - `{ action: "catalog" }`：列出 5 个模式与两套语言库的全部文档。
  - `{ action: "brief", mode }`：返回该模式的流程与验收清单（`manuscript` / `figures` / `report` / `revision` / `polish`）。
  - `{ action: "read", kind, name, lang }`：读取 `template` / `code` / `reference` / `skill`（父级 `SKILL.md`）；
    `lang` 取 `en`（默认）或 `zh`，两套文件名不同；规则文件预览 24,000 字符并给出完整路径。

## 安装

三种方式，任选其一：

1. **本地面板**：插件页 → 添加插件 → 选择本目录。
2. **npm**（发布后）：`npx @deepseek-ai/dsh plugin --profile <profile> add dsh-natsci-writing`
3. **GitHub**：`npx @deepseek-ai/dsh plugin --profile <profile> add github:Travis13197/dsh-natsci-writing`
4. **tarball**：`pnpm pack` 后执行 `npx @deepseek-ai/dsh plugin --profile <profile> add ./dsh-natsci-writing-1.1.0.tgz`

安装后刷新页面（新会话生效），侧栏出现「写作台」。停用组合包即同时移除入口与工具。

## 行为与边界

- 只读取本包内的文件：不联网、不写工作区、不追加会话事件。
- 页面的按钮只做两件事：把提示词填进新会话输入框，或复制文本；不会自动发送。
- 库内容为 NatSci-Writing-skills 1.2.6.2（`skills/natsci-writing` 与 `skills/natsci-writing-zh`，
  Apache-2.0）原样复制；5 份 brief 为本插件另写。见 `LICENSE`、`NOTICE.md`。
- 兼容性：`engines.dsh` 声明 `>=0.2.2-rc.5 <0.3.0-0`，在 DSH 0.2.2-rc.5 上验证。

## 目录

```
dsh-natsci-writing/
├── index.js              Host 半：注册 natsci_studio
├── client.js             Client 半：侧栏入口 + 写作台页面
├── cordis.patch.yml      组合包行
├── library/
│   ├── SKILL.md          英文总纲
│   ├── briefs/           5 份 brief
│   ├── references/       31 份英文规则
│   ├── assets/
│   │   ├── templates/    19 个英文模板
│   │   └── code/         Python / R 起手代码
│   └── zh/               中文套（同结构）：SKILL.md、33 份规则、19 个模板、2 份代码
├── locale/               en.json、zh.json（插件标题与描述）
├── docs/                 详情页文档与一张特性图
├── distribution/         可自托管的插件索引（index.json）
├── scripts/              selftest.mjs、build-index.mjs
└── icon.svg
```

## 测试

```sh
node scripts/selftest.mjs
```

Desktop 自带环境没有 `PATH` 上的 `node`，用应用自身的可执行文件跑：

```powershell
$env:ELECTRON_RUN_AS_NODE=1
& "C:\Users\<you>\AppData\Local\Programs\DeepSeek Harness\DeepSeek Harness.exe" scripts\selftest.mjs
```

覆盖：清单与投稿元数据、展示资源、图标限制、两套库清单、前端内嵌数字与磁盘一致性、
市场索引一致性、工具全部动作（含中文套与拒绝路径）。

## 发布

- 版本号改动后运行 `node scripts/build-index.mjs`，重新生成 `distribution/index.json`。
- 把 `distribution/` 发布到任意静态主机（GitHub Pages 即可），其他人把该 `index.json` 的 URL 加进「发现 → 添加索引源」即可浏览安装。
- 发布到 npm（`pnpm publish`）后，任何人用 `dsh plugin --profile <profile> add dsh-natsci-writing` 即可安装。
- 给仓库加上 GitHub topic `dsh-plugin`，并在 NatSci-Writing-skills 的 Release 里互相链接，两个项目互相导流。
- `package.json` 里的 `repository` / `homepage` 指向 `github.com/Travis13197/dsh-natsci-writing`，仓库地址不同就改掉。
- 许可证：本包为 Apache-2.0；随包分发的 NatSci-Writing-skills 内容同为 Apache-2.0。
