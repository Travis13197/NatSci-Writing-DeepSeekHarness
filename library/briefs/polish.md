# 模式：润色、期刊格式与双语（polish, format, bilingual）

目标：在不改变科学含义的前提下，把已经写成的稿件修好、转成目标期刊格式、或做成中英对照；只改该改的地方。

## 输入

- 稿件全文或指定段落，以及作者的标注（【】、行内批注按“对前一句的指令”理解）。
- 不可改动的术语、已定标题、已批准摘要。
- 目标期刊与文章类型；要转换的格式（结构、参考文献风格、图注、声明、行号）。
- 语言方向：单语、英文加中文对照、或中文成稿（中文用 natsci-writing-zh 技能，不用英文脚手架直译）。
- 若是 HTML 修订：原文件与要求保留的渲染结构。

## 流程（依据 references/revision-and-response.md 与 references/manuscript-production.md）

1. 推理修复优先：先看每节的任务、claim → evidence → boundary、主题句与段落衔接，再动语法与语域。
2. 只改被标出的段落；要做结构性改动时先说明理由并确认，不擅自重排全文。
3. 语言诊断：AI 腔词表、模板式对比（不是……而是……）、评价性形容词、防御性表述、连接词膨胀；按 references/writing-diagnostics.md 逐项检查。
4. 期刊格式：结构、摘要长度、参考文献风格、图注、声明、行号逐条对照目标期刊；合规检查清单随交付。
5. 双语：英文与中文逐段对应，两种语言同时加粗改动；证据强度在两种语言里保持一致（candidate / associated / predicted / demonstrated）。
6. 交付：修订稿、改动清单（change log）、格式合规清单；双语时给对照表。

## 验收

- 数字、单位、阈值、图与 panel 引用、统计方向未被改动；被更正的地方单独说明。
- 每处改动都能回答“为什么改”，没有为改而改的同义替换。
- 加粗或标注的改动范围与实际改动一致。
- 术语表零漂移：同名对象全文同名。
- 格式清单逐项有结论（符合 / 已改 / 需作者决定），不留“大概符合”。

## 配套资源

库版本：NatSci-Writing-skills 1.2.6.2（中英双语）。中文润色读中文套（`lang: "zh"`），英文润色读英文套。

- 规则：references/revision-and-response.md（§1 推理修复、§5 风格护栏、§8 期刊格式检查）、proofreading-and-polish.md（五遍校对）、language-and-taste.md（节奏与 house style）、writing-diagnostics.md、translation-validation.md（中英对照）、html-and-data-verification.md（HTML 修订与数据核验）、ai-use-and-writing-integrity.md（AI 使用披露与 AI 腔控制）、manuscript-production.md（投稿包与声明）。
- 模板：templates/terminology-and-decisions.md、editing-scope-and-change-log.md、ai-disclosure.md、ai-negative-checklist.md。
