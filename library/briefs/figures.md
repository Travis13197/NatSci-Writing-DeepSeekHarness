# 模式：投稿级图件（figure set）

目标：为一个论断产出一套可投稿的图件：图件合同、panel 地图、样式、统计呈现、导出和图注。

## 输入

- 一句话论断：这张图要读者记住的可测量关系。
- 数据与来源：每个 panel 对应哪份数据、哪个脚本、哪个统计。
- 统计口径：n 的定义、中心量、离散度、检验方法、是否双侧、多重比较校正。
- 目标期刊：Nature 或 Science（尺寸、字号、panel 字母规范不同）。
- 后端选择：Python 或 R，整套图只用一个后端。
- 项目图件门槛（若是 SEAL 或作者项目）：references/seal-supplementary-figure-standard.md、references/structural-figures-baker-standard.md。

## 流程（依据 references/figure-production.md 与 references/figure-standards-nature-science.md）

1. 先写图件合同：核心结论、archetype、panel 地图、证据层级、统计、源数据、审稿风险。写不出合同就不要开绘图程序。
2. 选 panel 顺序：按读者推理顺序（体系/设计 → 主要比较 → 机制或定位 → 定量 → 稳健性），不按实验时间顺序。
3. 定后端并锁死；预览与导出用同一后端。
4. 套期刊规格：宽度、字号、线宽、色彩角色、gutter、panel 字母、图注统计。
5. 导出 SVG 或 PDF 加 300–600 dpi 位图；需要逐 panel 交付时按项目门槛导出可编辑 SVG。
6. 交付图件、图注、源数据映射与发布审核记录。

## 期刊规格速查（已核对）

| 项目 | Nature | Science |
|---|---|---|
| 宽度 | 89 mm 单栏 / 120–136 mm 1.5 栏 / 183 mm 双栏 | 55 mm 单栏 / 120 mm 1.5 栏 / 183 mm 双栏 |
| panel 字母 | 8 pt 粗体、正体、小写 a b c | 大写粗体 A B C |
| 其他文字 | 5–7 pt | 5–7 pt 终尺寸 |
| 线宽 / 线稿 | 0.25–1 pt（终尺寸） | 线稿按 ≥600 dpi 栅格化（未规定线宽） |
| 字体 | Helvetica 或 Arial，全套一致 | Helvetica 或 Arial |
| 位图 | 300–600 dpi，RGB | 照片 ≥300 dpi，线画 ≥600 dpi |
| 矢量 | EPS / PDF / AI，保持可编辑 | PDF / EPS / AI，文字可编辑 |

## 验收

- 每张图只承载一个论断；需要「and」时拆图。
- 每个 panel 一条信息；panel 标题写比较，不写方法。
- 统计四件套齐全：n、n 的定义、中心量与离散度、检验与 P 值。
- 图注是五段式：标题句（claim）、panel 走读、统计、符号、致谢与比例尺。
- 不用红—绿编色；必要类别同时用形状或标签编码。
- 画布按毫米设定，不按英寸；Nature 双栏 183 mm 在 300 dpi 下为 2,161 px。

## 配套资源

库版本：NatSci-Writing-skills 1.2.6.2（中英双语）。图件规则两种语言都有，中文稿优先读 `lang: "zh"`。

- 规则：references/figure-production.md、figure-standards-nature-science.md、figure-design-and-audit.md、figure-craft-and-information-density.md（多 panel 证据架构与信息密度）、panel-layout-and-letter-placement.md、figure-colour-audit-contract.md、structural-figures-baker-standard.md、seal-supplementary-figure-standard.md、statistics-and-reporting-integrity.md（图件统计与图像诚信）、ai-figures-and-visual-integrity.md（AI 图件政策与来源）。
- 模板：templates/figure-contract.md、figure-caption.md、figure-evidence-map.md（panel—论断—数据映射）、conceptual-figure-brief.md（概念图）。
- 起手代码：code/figure_python.py、code/figure_r.R（`--demo --out` 可先出骨架）。
