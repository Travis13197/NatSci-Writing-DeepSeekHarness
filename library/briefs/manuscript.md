# 模式：完整论文（complete manuscript）

目标：从想法、数据、图件或中文草稿产出一篇可投稿的完整稿件，而不是段落拼贴。

## 输入（缺一项就在交付中标为缺失，不要补写）

- 一句话论断（claim）：哪个对象、哪种能力、什么条件下成立。
- 证据：图件、表格、分析、统计、数据集。
- 边界：论断止步之处，以及能推翻它的实验。
- 目标期刊与文章类型：Nature Article、Science Research Article、Nature Communications 等。
- 不可改动的术语表（基因、蛋白、数据集、模型名、指标名）。
- 语言：英文、中文或双语。

## 流程（依据 SKILL.md §0 与 references/manuscript-production.md）

1. 确认闸门：回声一句话论断、文章类型、提纲、术语表、读者首要问题、假设清单。只有框架含糊时才问 2–3 个高杠杆问题；输入完整时直接开写。
2. 论断—证据映射：每个结论对应哪张图、哪个统计、哪个对照；缺口单列。
3. 先写 Results（每个小节按「问题 → 设计 → 观察与统计 → 推论」），再写 Introduction 与 Conclusion、Discussion、Methods，最后写 Abstract 与 Title。
4. 一致性检查：数字、单位、图与 panel 引用、引用顺序、时态、论断强度。
5. 对抗式自审：站在审稿人立场写出最强反驳，并决定补证据还是收窄论断。
5b. 防御性审计：全文只保留一段局限（≤3 句，条件→范围→后果），摘要与结论不留 caveat；每处限定过删除测试——删掉后读者会不会被误导，会则保留并写具体，不会则删。
6. 交付稿件包：title page、abstract、main text、methods、references、legends、extended data 清单、statements、假设清单、change log。

## 验收（任一不满足即未完成）

- 每个小节开头是论断，不是方法目录。
- 每个数字带单位、比较对象与分母。
- 图注与正文的 panel 引用一一对应，无悬空引用。
- 摘要 ≤200 词（Nature）或约 125 词（Science），末句给出能力或后果，而不是承诺。
- 缺失输入以显式占位符呈现，而不是被平滑掉。
- 结论强度与证据类型匹配：直接证据用 show / demonstrate / reveal，推断用 indicate / suggest / consistent with，推测用 may / could。
- 风格门禁通过：`python tools/check_prose_style.py <稿件> --gate` 无 ERROR、无防御性/AI 标记命中、无节奏度量越界（提案类用 `--genre perspective`）。
- 投稿前跑两项审核并把结果单列：统计与报告诚信（n、独立单元、检验、图像诚信）、编辑契合度（期刊定位、篇幅、结论强度）。

## 配套资源

库版本：NatSci-Writing-skills 1.2.7.0（中英双语）。中文稿件优先读中文套（`lang: "zh"`），英文稿件读英文套。

- 规则：references/manuscript-production.md、journal-style-evidence.md、writing-diagnostics.md、defensive-writing-and-argument-selection.md（发布会原则、三问测试、实验职责、局限只留一段）、main-text-and-information-architecture.md（正文/图注/SI 分工、篇幅预算）、nature-section-craft.md（章节 move 序列）、statistics-and-reporting-integrity.md、editorial-and-submission.md、innovation-and-broad-interest.md、literature-search-and-citation.md。
- 模板：templates/manuscript-outline.md、terminology-and-decisions.md、innovation-canvas.md、editorial-audit.md、reporting-and-statistics-checklist.md、cover-letter-and-submission.md、data-and-code-statements.md、data-code-materials-checklist.md；Perspective 用 perspective-manuscript-outline.md。
- 语言：中文成稿用中文套的 language-and-taste-zh.md 与 writing-diagnostics-zh.md，不要把英文脚手架直译成中文。
