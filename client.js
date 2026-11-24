/**
 * Client half of the NatSci writing studio bundle.
 *
 * It adds one global sidebar entry (id `natsci`) and the main-column panel that
 * entry opens: starter scenarios for manuscripts, reports, figure sets, reviewer
 * responses and polishing, the figure specification quick reference, and the
 * template / starter-code / rule library. Every action either writes an editable
 * starter prompt into a new Session or copies text; the library itself stays in
 * the Host half, where the `natsci_studio` tool reads it.
 */
window.__ModuleLoader__.load({
  id: 'dsh-natsci-writing',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const NS = 'natsciStudio';
    const PANEL_ID = 'natsci';
    const NOTICE_MS = 4000;

    /** Chrome copy for the panel and the sidebar row. */
    const ZH = {
      panel: '写作台',
      title: 'NatSci 写作台',
      subtitle: '论文、学术报告、投稿图件与审稿回复，按 Nature/Science 标准交付。中英双语规则库 1.2.6.2。',
      chipRulesEn: '26 份英文规则',
      chipRulesZh: '27 份中文规则',
      chipTemplates: '19 个模板',
      chipCode: '2 份起手代码',
      chipLicense: 'NatSci-Writing-skills 1.2.6.2 · Apache-2.0',
      scenarios: '起手场景',
      scenariosHint: '每张卡会把一条可编辑的起始提示词填进新会话的输入框，发送前可以改。',
      newSession: '新建会话并填入',
      copyPrompt: '复制提示词',
      viewPrompt: '查看提示词',
      copied: '提示词已复制。',
      copyFailed: '浏览器拒绝了复制，请展开「查看提示词」手动选择。',
      examplesCopied: '示例调用已复制。',
      figureStandards: '图件规格速查',
      figureStandardsHint: '以库内 references/figure-standards-nature-science.md 为准；投稿前再核对目标期刊的最新说明。',
      colItem: '项目',
      colNature: 'Nature',
      colScience: 'Science',
      library: '模板与起手代码',
      libraryHint: '「读取并新建会话」让 Agent 读取库里的原始文件再动手，页面不另存副本。',
      apply: '读取并新建会话',
      rules: '规则索引',
      rulesHint: '点任意规则，会在新会话里让 Agent 读取全文并按它检查当前稿件；中英两套都在。',
      langEn: 'EN',
      langZh: '中文',
      agent: '与 Agent 配合',
      agentHint: '任何会话都能直接调用工具，不必打开这个面板。',
      copyExamples: '复制示例',
      footer: '库内容随插件离线提供：不联网，也不改写工作区文件。',
    };

    /** English fallback for every locale whose chain reaches English. */
    const EN = {
      panel: 'Studio',
      title: 'NatSci writing studio',
      subtitle: 'Manuscripts, academic reports, submission figures and reviewer responses at Nature/Science standard. Bilingual library 1.2.6.2.',
      chipRulesEn: '26 English rules',
      chipRulesZh: '27 Chinese rules',
      chipTemplates: '19 templates',
      chipCode: '2 starter scripts',
      chipLicense: 'NatSci-Writing-skills 1.2.6.2 · Apache-2.0',
      scenarios: 'Start a deliverable',
      scenariosHint: 'Each card fills an editable starter prompt into a new Session. Edit it before sending.',
      newSession: 'New Session, prompt ready',
      copyPrompt: 'Copy prompt',
      viewPrompt: 'Show prompt',
      copied: 'Prompt copied.',
      copyFailed: 'The browser refused the clipboard; expand Show prompt and select the text.',
      examplesCopied: 'Example calls copied.',
      figureStandards: 'Figure specifications',
      figureStandardsHint: 'The bundled references/figure-standards-nature-science.md is authoritative; re-check the target journal before submission.',
      colItem: 'Item',
      colNature: 'Nature',
      colScience: 'Science',
      library: 'Templates and starter code',
      libraryHint: 'Read and open Session makes the agent read the original file from the bundle, so the page keeps no second copy.',
      apply: 'Read and open Session',
      rules: 'Rule index',
      rulesHint: 'Click a rule to have the agent read it in a new Session and check the current draft against it; both sets are bundled.',
      langEn: 'EN',
      langZh: '中文',
      agent: 'Working with the agent',
      agentHint: 'Any Session can call the tool directly; this panel is optional.',
      copyExamples: 'Copy examples',
      footer: 'The library ships with the plugin: no network access, no workspace writes.',
    };

    /** The five deliverables, in workflow order. */
    const SCENARIOS = [
      {
        id: 'manuscript',
        title: { zh: '完整论文', en: 'Complete manuscript' },
        tag: { zh: 'claim → evidence → 稿件包', en: 'claim → evidence → manuscript package' },
        bullets: [
          { zh: '先回声一句话论断、文章类型、提纲与术语表', en: 'Echo the one-sentence claim, paper type, outline and terminology first' },
          { zh: '先写 Results，再写讨论与方法，摘要和标题最后写', en: 'Draft Results first, then discussion and methods; abstract and title come last' },
          { zh: '交付图注、声明、假设清单与 change log', en: 'Deliver legends, statements, an assumption list and a change log' },
        ],
        prompt: {
          zh: '先调用 natsci_studio({ action: "brief", mode: "manuscript" }) 读交付标准；若环境里已有 natsci-writing-zh 技能则一并加载。把我的论断、数据、图件和笔记写成一篇完整的 Nature 研究论文：标题、摘要、引言、结果、讨论、方法、参考文献、图注和声明。先回声一句话论断、文章类型、提纲和术语表再开写；缺失的输入用显式占位符标出，不要编造。',
          en: 'Call natsci_studio({ action: "brief", mode: "manuscript" }) for its acceptance checklist first, and load the natsci-writing skill if it is installed. Turn my claim, data, figures and notes into a complete Nature research Article: title, abstract, introduction, results, discussion, methods, references, legends and statements. Echo the one-sentence argument, paper type, outline and terminology before drafting; mark missing inputs with explicit placeholders instead of inventing them.',
        },
      },
      {
        id: 'figures',
        title: { zh: '投稿级图件', en: 'Submission figures' },
        tag: { zh: '合同 → panel 地图 → 导出', en: 'contract → panel map → export' },
        bullets: [
          { zh: '先写图件合同，写不出就不开绘图程序', en: 'Write the figure contract first; no plotting before it holds' },
          { zh: 'Python 或 R 二选一，整套图同一后端', en: 'Pick Python or R; one backend for the whole set' },
          { zh: '按 Nature/Science 尺寸、字号、panel 字母出图并审核', en: 'Follow Nature/Science widths, type sizes and panel letters, then audit' },
        ],
        prompt: {
          zh: '先调用 natsci_studio({ action: "brief", mode: "figures" }) 读图件标准；若环境里已有 natsci-writing-zh 技能则一并加载。为这个结论做一套投稿级图件：先给图件合同和 panel 地图，并问我用 Python 还是 R；然后按目标期刊规格产出 SVG 或 PDF、300–600 dpi 位图、图注和发布审核记录。统计口径（n、中心量与离散度、检验、校正）缺失时先问我。',
          en: 'Call natsci_studio({ action: "brief", mode: "figures" }) first, and load the natsci-writing skill if it is installed. Build a submission-grade figure set for this claim: give me the figure contract and panel map, and ask whether to use Python or R; then produce SVG or PDF, 300–600 dpi rasters, legends and the release audit to the target journal specifications. Ask me for any missing statistics (n, centre and dispersion, test, correction) rather than guessing.',
        },
      },
      {
        id: 'report',
        title: { zh: '学术报告', en: 'Academic report' },
        tag: { zh: '组会 / 进展 / 结题', en: 'group, progress or final report' },
        bullets: [
          { zh: '最多三条结论，每条配证据与缺口', en: 'At most three conclusions, each with evidence and its gap' },
          { zh: '结构：现状 → 做了什么 → 结果 → 差距 → 下一步（时间 + 判据）', en: 'Structure: status → work done → results → distance to goal → next step (time + criterion)' },
          { zh: '计划写成计划，绝不表述为已完成结果', en: 'Plans stay plans; never phrased as finished results' },
        ],
        prompt: {
          zh: '先调用 natsci_studio({ action: "brief", mode: "report" }) 读报告流程；若环境里已有 natsci-writing-zh 技能则一并加载。把这些结果整理成一份 12 分钟的组会进展报告：最多三条结论，每条配证据图和缺口；结构为现状与问题 → 本期做了什么 → 结果 → 离目标还差多少 → 下一步（时间 + 判据）。计划不许写成结果，失败与负结果保留。',
          en: 'Call natsci_studio({ action: "brief", mode: "report" }) first, and load the natsci-writing skill if it is installed. Turn these results into a 12-minute group progress report: at most three conclusions, each with its evidence figure and its gap; structure as status and problem → work this period → results → distance to the goal → next step with a date and a decision criterion. Keep plans as plans and keep negative results.',
        },
      },
      {
        id: 'revision',
        title: { zh: '审稿回复', en: 'Reviewer response' },
        tag: { zh: '逐点 → 跟踪表 → 回复信', en: 'point by point → tracker → letter' },
        bullets: [
          { zh: '审稿意见逐字保留，每条一个去向', en: 'Keep every comment verbatim; each gets one disposition' },
          { zh: '先修推理再修文字，只改被标出的段落', en: 'Repair reasoning before wording; edit only flagged passages' },
          { zh: '缺失事实标 AUTHOR_INPUT_NEEDED，不替作者编', en: 'Mark missing facts AUTHOR_INPUT_NEEDED instead of inventing them' },
        ],
        prompt: {
          zh: '先调用 natsci_studio({ action: "brief", mode: "revision" }) 读回复流程；若环境里已有 natsci-writing-zh 技能则一并加载。逐条处理这些审稿意见：保留原文、分类、建跟踪表、给出动作和稿件位置；缺失事实标 AUTHOR_INPUT_NEEDED。最后交付逐点回复信、修改清单和风险提示，语气合作、证据优先、不防御。',
          en: 'Call natsci_studio({ action: "brief", mode: "revision" }) first, and load the natsci-writing skill if it is installed. Work through these reviewer comments: keep them verbatim, classify each, build a tracker with the action and the manuscript location, and mark missing facts AUTHOR_INPUT_NEEDED. Deliver the point-by-point letter, the change checklist and risk flags, in a cooperative, evidence-forward, non-defensive tone.',
        },
      },
      {
        id: 'polish',
        title: { zh: '润色与期刊格式', en: 'Polish and journal format' },
        tag: { zh: '推理修复 → 格式 → 双语', en: 'reasoning repair → format → bilingual' },
        bullets: [
          { zh: '先修推理再修文字，只改被标出的段落', en: 'Repair the reasoning before the wording; edit only flagged passages' },
          { zh: '格式逐条对照目标期刊，交合规清单', en: 'Check every format rule against the target journal and return a compliance list' },
          { zh: '中英对照时两种语言同时加粗改动', en: 'For bilingual work, bold the changes in both languages' },
        ],
        prompt: {
          zh: '先调用 natsci_studio({ action: "brief", mode: "polish" }) 读润色与格式流程；若环境里已有 natsci-writing-zh 技能则一并加载。按目标期刊修订这篇稿件：先修推理再修文字，只改被标出的段落，保留我的术语、数字和统计口径；然后做格式合规检查（结构、摘要长度、参考文献、图注、声明、行号），并给出改动清单。需要中英对照时两种语言同时加粗改动。',
          en: 'Call natsci_studio({ action: "brief", mode: "polish" }) first, and load the natsci-writing skill if it is installed. Revise this manuscript for the target journal: repair the reasoning before the wording, edit only flagged passages, and preserve my terminology, numbers and statistics; then run the format compliance check (structure, abstract length, references, legends, statements, line numbers) and return a change log. When bilingual output is needed, bold the changes in both languages.',
        },
      },
    ];

    /** Figure specification quick reference, transcribed from the bundled standard. */
    const FIGURE_ROWS = [
      {
        id: 'width',
        label: { zh: '宽度', en: 'Widths' },
        nature: '89 / 120–136 / 183 mm',
        science: '55 / 120 / 183 mm',
      },
      {
        id: 'letters',
        label: { zh: 'panel 字母', en: 'Panel letters' },
        nature: { zh: '8 pt 粗体、正体、小写 a b c', en: '8 pt bold, upright, lowercase a, b, c' },
        science: { zh: '大写粗体 A B C', en: 'uppercase bold A, B, C' },
      },
      {
        id: 'type',
        label: { zh: '其他文字', en: 'Other text' },
        nature: '5–7 pt',
        science: '5–7 pt',
      },
      {
        id: 'lines',
        label: { zh: '线宽 / 线稿', en: 'Line width / line art' },
        nature: '0.25–1 pt',
        science: { zh: '线稿按 ≥600 dpi 栅格化（未规定线宽）', en: 'line art at ≥600 dpi (no line width specified)' },
      },
      {
        id: 'font',
        label: { zh: '字体', en: 'Typeface' },
        nature: 'Helvetica / Arial',
        science: 'Helvetica / Arial',
      },
      {
        id: 'raster',
        label: { zh: '位图', en: 'Raster' },
        nature: '300–600 dpi, RGB',
        science: { zh: '照片 ≥300 dpi，线画 ≥600 dpi', en: 'photos ≥300 dpi, line art ≥600 dpi' },
      },
      {
        id: 'vector',
        label: { zh: '矢量', en: 'Vector' },
        nature: 'EPS / PDF / AI',
        science: 'PDF / EPS / AI',
      },
    ];

    /** Templates and starter scripts the Host tool can serve (English set). */
    const LIBRARY = [
      {
        name: 'manuscript-outline.md',
        kind: 'template',
        title: { zh: '稿件骨架', en: 'Manuscript outline' },
        note: { zh: '论断、章节、panel 引用与待补输入', en: 'Claim, sections, panel references and missing inputs' },
      },
      {
        name: 'perspective-manuscript-outline.md',
        kind: 'template',
        title: { zh: 'Perspective 骨架', en: 'Perspective outline' },
        note: { zh: '观点文的结构与推测标注', en: 'Opinion-piece structure and labelled speculation' },
      },
      {
        name: 'figure-contract.md',
        kind: 'template',
        title: { zh: '图件合同', en: 'Figure contract' },
        note: { zh: '核心结论、archetype、panel 地图、统计与审稿风险', en: 'Core conclusion, archetype, panel map, statistics and reviewer risks' },
      },
      {
        name: 'figure-caption.md',
        kind: 'template',
        title: { zh: '图注', en: 'Figure caption' },
        note: { zh: '标题句、panel 走读、统计、符号、致谢与比例尺', en: 'Title sentence, panel walkthrough, statistics, symbols, credits' },
      },
      {
        name: 'figure-evidence-map.md',
        kind: 'template',
        title: { zh: '图件—证据映射', en: 'Figure evidence map' },
        note: { zh: '每个 panel 对应哪条论断与哪份数据', en: 'Which claim and which data each panel carries' },
      },
      {
        name: 'conceptual-figure-brief.md',
        kind: 'template',
        title: { zh: '概念图 brief', en: 'Conceptual figure brief' },
        note: { zh: '机制表达与形式选择', en: 'Mechanism message and form choice' },
      },
      {
        name: 'data-and-code-statements.md',
        kind: 'template',
        title: { zh: '数据与代码声明', en: 'Data and code statements' },
        note: { zh: '可用性声明的固定写法', en: 'Availability statement wording' },
      },
      {
        name: 'data-code-materials-checklist.md',
        kind: 'template',
        title: { zh: '数据/代码/材料清单', en: 'Data, code and materials checklist' },
        note: { zh: '交付前的完整性清单', en: 'Completeness list before delivery' },
      },
      {
        name: 'reporting-and-statistics-checklist.md',
        kind: 'template',
        title: { zh: '报告与统计清单', en: 'Reporting and statistics checklist' },
        note: { zh: 'n、离散度、检验、校正逐项核对', en: 'n, dispersion, test and correction, item by item' },
      },
      {
        name: 'response-letter.md',
        kind: 'template',
        title: { zh: '逐点回复信', en: 'Point-by-point letter' },
        note: { zh: '意见、动作、位置与跟踪表字段', en: 'Comment, action, location and tracker fields' },
      },
      {
        name: 'terminology-and-decisions.md',
        kind: 'template',
        title: { zh: '术语与决策台账', en: 'Terminology and decisions' },
        note: { zh: '不可改动项与已定判断', en: 'Fixed terms and settled decisions' },
      },
      {
        name: 'cover-letter-and-submission.md',
        kind: 'template',
        title: { zh: '投稿信与投稿包', en: 'Cover letter and submission package' },
        note: { zh: 'cover letter 与交付矩阵', en: 'Cover letter and deliverable matrix' },
      },
      {
        name: 'editorial-audit.md',
        kind: 'template',
        title: { zh: '编辑契合度审核', en: 'Editorial audit' },
        note: { zh: '期刊定位、篇幅、结论强度', en: 'Journal fit, length limits, claim strength' },
      },
      {
        name: 'innovation-canvas.md',
        kind: 'template',
        title: { zh: '创新画布', en: 'Innovation canvas' },
        note: { zh: '贡献类型与贡献阶梯', en: 'Contribution type and ladder' },
      },
      {
        name: 'literature-search-plan.md',
        kind: 'template',
        title: { zh: '文献检索计划', en: 'Literature search plan' },
        note: { zh: '来源层级与筛选标准', en: 'Source hierarchy and screening rules' },
      },
      {
        name: 'editing-scope-and-change-log.md',
        kind: 'template',
        title: { zh: '修订范围与 change log', en: 'Editing scope and change log' },
        note: { zh: '改了哪里、为什么改', en: 'What changed and why' },
      },
      {
        name: 'ai-disclosure.md',
        kind: 'template',
        title: { zh: 'AI 使用声明', en: 'AI disclosure' },
        note: { zh: '披露格式与范围', en: 'Disclosure format and scope' },
      },
      {
        name: 'ai-image-provenance-record.md',
        kind: 'template',
        title: { zh: 'AI 图像记录', en: 'AI image provenance record' },
        note: { zh: '工具、版本、提示词与人工编辑', en: 'Tool, version, prompt and manual edits' },
      },
      {
        name: 'ai-negative-checklist.md',
        kind: 'template',
        title: { zh: 'AI 负面清单', en: 'AI negative checklist' },
        note: { zh: '不能做的几件事，逐条打勾', en: 'What must not be done, item by item' },
      },
      {
        name: 'figure_python.py',
        kind: 'code',
        title: { zh: 'Python 起手代码', en: 'Python starter' },
        note: { zh: '出版级图件的 Python 骨架', en: 'Python skeleton for publication figures' },
      },
      {
        name: 'figure_r.R',
        kind: 'code',
        title: { zh: 'R 起手代码', en: 'R starter' },
        note: { zh: '出版级图件的 R 骨架', en: 'R skeleton for publication figures' },
      },
    ];

    /** English reference documents, in catalog order; the rule index browses these. */
    const REFERENCE_NAMES = [
      'manuscript-production.md',
      'revision-and-response.md',
      'journal-style-evidence.md',
      'writing-diagnostics.md',
      'editorial-and-submission.md',
      'innovation-and-broad-interest.md',
      'main-text-and-information-architecture.md',
      'statistics-and-reporting-integrity.md',
      'language-and-taste.md',
      'ai-use-and-writing-integrity.md',
      'ai-figures-and-visual-integrity.md',
      'literature-search-and-citation.md',
      'proofreading-and-polish.md',
      'perspective-and-insight.md',
      'nature-section-craft.md',
      'nature-perspective-production.md',
      'figure-craft-and-information-density.md',
      'figure-production.md',
      'figure-standards-nature-science.md',
      'figure-design-and-audit.md',
      'panel-layout-and-letter-placement.md',
      'figure-colour-audit-contract.md',
      'structural-figures-baker-standard.md',
      'research-and-language.md',
      'html-and-data-verification.md',
      'academic-prompt-zh.md',
    ];

    /** Chinese reference documents, in catalog order (names differ from the English set). */
    const ZH_REFERENCE_NAMES = [
      'academic-prompt-zh.md',
      'ai-figures-and-visual-integrity-zh.md',
      'ai-use-and-writing-integrity-zh.md',
      'biological-semantic-clarity-zh.md',
      'editorial-and-submission-zh.md',
      'figure-colour-audit-contract.md',
      'figure-craft-and-information-density-zh.md',
      'figure-design-and-audit.md',
      'figure-production-zh.md',
      'figure-standards-nature-science-zh.md',
      'html-and-data-verification.md',
      'innovation-and-broad-interest-zh.md',
      'journal-style-evidence-zh.md',
      'language-and-taste-zh.md',
      'literature-search-and-citation-zh.md',
      'main-text-and-information-architecture-zh.md',
      'manuscript-production-zh.md',
      'nature-perspective-production-zh.md',
      'nature-section-craft-zh.md',
      'panel-layout-and-letter-placement.md',
      'perspective-and-insight-zh.md',
      'proofreading-and-polish-zh.md',
      'research-and-language.md',
      'revision-and-response-zh.md',
      'statistics-and-reporting-integrity-zh.md',
      'structural-figures-baker-standard.md',
      'writing-diagnostics-zh.md',
    ];

    /** Example tool calls shown in the page. */
    const EXAMPLES = [
      'natsci_studio({ action: "catalog" })',
      'natsci_studio({ action: "brief", mode: "figures" })',
      'natsci_studio({ action: "read", kind: "template", name: "figure-contract.md" })',
      'natsci_studio({ action: "read", kind: "reference", name: "statistics-and-reporting-integrity-zh.md", lang: "zh" })',
      'natsci_studio({ action: "read", kind: "skill", name: "SKILL.md" })',
    ];

    /** Panel styles; every colour comes from a `--dsw-alias-*` theme token. */
    const CSS = `
.nsc-root { position: relative; box-sizing: border-box; height: 100%; overflow: auto; background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-primary); }
.nsc-page { max-width: 960px; margin: 0 auto; padding: 32px 36px 72px; font-size: 13px; line-height: 1.6; }
.nsc-hero { display: flex; align-items: flex-start; gap: 16px; padding-bottom: 20px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.nsc-mark { flex: none; display: grid; place-items: center; width: 44px; height: 44px; border-radius: 12px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-brand-primary); }
.nsc-h1 { margin: 0; font-size: 19px; line-height: 1.3; font-weight: 600; }
.nsc-sub { margin: 4px 0 0; font-size: 13px; color: var(--dsw-alias-label-secondary); }
.nsc-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
.nsc-chip { padding: 2px 8px; border-radius: 999px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-1); font-size: 12px; color: var(--dsw-alias-label-secondary); }
.nsc-section { margin-top: 28px; }
.nsc-h2 { margin: 0 0 4px; font-size: 13px; font-weight: 600; color: var(--dsw-alias-label-primary); }
.nsc-hint { margin: 0 0 12px; font-size: 12.5px; color: var(--dsw-alias-label-secondary); }
.nsc-toastwrap { position: sticky; bottom: 14px; z-index: 2; display: flex; justify-content: flex-end; margin-top: 18px; pointer-events: none; }
.nsc-toast { pointer-events: auto; max-width: 100%; padding: 7px 14px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 10px; background: var(--dsw-alias-bg-overlay); font-size: 12.5px; }
.nsc-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 12px; }
.nsc-card { display: flex; flex-direction: column; gap: 10px; padding: 14px 16px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 12px; background: var(--dsw-alias-bg-layer-1); }
.nsc-card-head { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 8px; }
.nsc-card-title { font-size: 14.5px; font-weight: 600; }
.nsc-card-tag { font-size: 12px; color: var(--dsw-alias-label-secondary); }
.nsc-bullets { display: flex; flex-direction: column; gap: 3px; margin: 0; padding-left: 16px; font-size: 12.5px; color: var(--dsw-alias-label-secondary); }
.nsc-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: auto; padding-top: 4px; }
.nsc-btn { font: inherit; font-size: 12.5px; line-height: 1.4; padding: 6px 12px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 8px; background: transparent; color: var(--dsw-alias-label-primary); cursor: pointer; }
.nsc-btn:hover { background: var(--dsw-alias-bg-layer-2); }
.nsc-btn:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 2px; }
.nsc-btn-primary { border-color: var(--dsw-alias-brand-primary); color: var(--dsw-alias-brand-primary); font-weight: 600; }
.nsc-btn-quiet { padding: 2px 9px; font-size: 12px; }
.nsc-details { margin-top: 8px; font-size: 12.5px; color: var(--dsw-alias-label-secondary); }
.nsc-details > summary { padding: 2px 0; cursor: pointer; }
.nsc-pre { margin: 6px 0 0; padding: 10px 12px; max-height: 220px; overflow: auto; border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px; background: var(--dsw-alias-bg-layer-2); font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 12px; line-height: 1.5; white-space: pre-wrap; word-break: break-word; color: var(--dsw-alias-label-primary); }
.nsc-tablewrap { overflow-x: auto; border: 1px solid var(--dsw-alias-border-l1); border-radius: 12px; }
.nsc-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
.nsc-th { padding: 8px 12px; border-bottom: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-2); font-size: 12px; font-weight: 600; color: var(--dsw-alias-label-secondary); text-align: left; white-space: nowrap; }
.nsc-td { padding: 8px 12px; border-bottom: 1px solid var(--dsw-alias-border-l1); vertical-align: top; text-align: left; font-weight: 400; }
.nsc-td-key { color: var(--dsw-alias-label-secondary); font-weight: 400; white-space: nowrap; }
.nsc-rows { display: flex; flex-direction: column; border: 1px solid var(--dsw-alias-border-l1); border-radius: 12px; overflow: hidden; }
.nsc-row { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 12px; padding: 9px 14px; border-bottom: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-1); }
.nsc-row:last-child { border-bottom: none; }
.nsc-row-main { flex: 1 1 220px; min-width: 0; }
.nsc-row-name { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 12px; }
.nsc-row-note { font-size: 12px; color: var(--dsw-alias-label-secondary); }
.nsc-chiprow { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: 6px; }
.nsc-chipbtn { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 11.5px; padding: 3px 9px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 999px; background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-secondary); cursor: pointer; }
.nsc-chipbtn:hover { color: var(--dsw-alias-label-primary); border-color: var(--dsw-alias-border-l2); }
.nsc-chipbtn:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 2px; }
.nsc-footer { margin-top: 28px; font-size: 12px; color: var(--dsw-alias-label-secondary); }
@media (max-width: 640px) { .nsc-page { padding: 20px 16px 56px; } .nsc-hero { gap: 12px; } }
`;

    /**
     * Render one localized value against the active locale chain.
     * @param {object} ctx - client context owning the locale service.
     * @param {string | { zh?: string, en: string }} text - plain or localized text.
     * @returns {string} resolved text.
     */
    const localize = (ctx, text) => (typeof text === 'string' ? text : ctx.locale.resolveText(text));

    /** The sidebar glyph: a manuscript page whose lower half carries a rising bar chart. */
    function StudioIcon({ size }) {
      const edge = typeof size === 'number' ? size : 20;
      return h('svg', {
        width: edge, height: edge, viewBox: '0 0 36 36', fill: 'none',
        'aria-hidden': 'true', focusable: 'false', style: { display: 'block' },
      },
      h('path', {
        d: 'M10 6H20.5L26 11.5V30H10Z',
        stroke: 'currentColor', strokeWidth: 1.8, strokeLinejoin: 'round',
      }),
      h('path', {
        d: 'M20.5 6V11.5H26',
        stroke: 'currentColor', strokeWidth: 1.4, strokeLinejoin: 'round', opacity: 0.6,
      }),
      h('path', { d: 'M13.5 15.5H22.5', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round' }),
      h('path', { d: 'M13.5 19H19', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', opacity: 0.6 }),
      h('rect', { x: 13.5, y: 25.5, width: 3, height: 3, rx: 0.7, fill: 'currentColor', opacity: 0.5 }),
      h('rect', { x: 17.2, y: 23.5, width: 3, height: 5, rx: 0.7, fill: 'currentColor', opacity: 0.75 }),
      h('rect', { x: 20.9, y: 21.5, width: 3, height: 7, rx: 0.7, fill: 'currentColor' }));
    }

    return {
      inject: ['slots', 'locale', 'uiWorkspace'],

      /**
       * Register the copy, the studio panel and the sidebar entry.
       * @param {object} ctx - client plugin context.
       */
      apply(ctx) {
        const t = ctx.locale.bind(NS);
        ctx.effect(() => ctx.locale.register(NS, { zh: ZH, en: EN }), 'natsci-writing: copy');

        /**
         * Write a starter prompt into a fresh Session's composer. The workspace
         * shell owns failure reporting; this only guards a synchronous throw or a
         * future promise-returning signature.
         * @param {string} prompt - starter prompt.
         */
        const startWithPrompt = (prompt) => {
          try {
            const settled = ctx.uiWorkspace.startSession(undefined, { prompt, whenDraftExists: 'append' });
            if (settled !== undefined && typeof settled.then === 'function') {
              settled.then(undefined, (error) => { console.error('[natsci-writing] startSession rejected', error) });
            }
          } catch (error) {
            console.error('[natsci-writing] startSession failed', error);
          }
        };

        /** The main-column page. */
        function StudioPanel() {
          const [notice, setNotice] = React.useState(null);
          const [, setLocaleRevision] = React.useState(0);
          React.useEffect(() => ctx.locale.subscribe(() => setLocaleRevision(node => node + 1)), []);
          React.useEffect(() => {
            if (notice === null) return undefined;
            const timer = setTimeout(() => setNotice(null), NOTICE_MS);
            return () => clearTimeout(timer);
          }, [notice]);
          const l = (text) => localize(ctx, text);
          const notify = (text, kind) => setNotice({ text, kind, at: Date.now() });

          const copy = (text, done) => {
            const clipboard = typeof navigator !== 'undefined' ? navigator.clipboard : undefined;
            if (clipboard === undefined || typeof clipboard.writeText !== 'function') {
              notify(t('copyFailed'), 'error');
              return;
            }
            clipboard.writeText(text).then(
              () => notify(done ?? t('copied'), 'ok'),
              () => notify(t('copyFailed'), 'error'),
            );
          };

          const openSession = (prompt) => startWithPrompt(prompt);

          const scenarioCards = SCENARIOS.map(scenario => h('div', { className: 'nsc-card', key: scenario.id },
            h('div', { className: 'nsc-card-head' },
              h('span', { className: 'nsc-card-title' }, l(scenario.title)),
              h('span', { className: 'nsc-card-tag' }, l(scenario.tag))),
            h('ul', { className: 'nsc-bullets' },
              scenario.bullets.map((bullet, index) => h('li', { key: `${scenario.id}-${index}` }, l(bullet)))),
            h('div', { className: 'nsc-actions' },
              h('button', {
                type: 'button', className: 'nsc-btn nsc-btn-primary',
                onClick: () => openSession(l(scenario.prompt)),
              }, t('newSession')),
              h('button', {
                type: 'button', className: 'nsc-btn',
                onClick: () => copy(l(scenario.prompt)),
              }, t('copyPrompt'))),
            h('details', { className: 'nsc-details' },
              h('summary', null, t('viewPrompt')),
              h('pre', { className: 'nsc-pre' }, l(scenario.prompt)))));

          const figureTable = h('div', { className: 'nsc-tablewrap' },
            h('table', { className: 'nsc-table' },
              h('thead', null, h('tr', null,
                h('th', { className: 'nsc-th', scope: 'col' }, t('colItem')),
                h('th', { className: 'nsc-th', scope: 'col' }, t('colNature')),
                h('th', { className: 'nsc-th', scope: 'col' }, t('colScience')))),
              h('tbody', null, FIGURE_ROWS.map(row => h('tr', { key: row.id },
                h('th', { className: 'nsc-td nsc-td-key', scope: 'row' }, l(row.label)),
                h('td', { className: 'nsc-td' }, l(row.nature)),
                h('td', { className: 'nsc-td' }, l(row.science)))))));

          const libraryRows = LIBRARY.map(entry => {
            const label = l(entry.title);
            const applyPrompt = entry.kind === 'code'
              ? {
                zh: `先调用 natsci_studio({ action: "read", kind: "code", name: "${entry.name}" }) 读取起手代码，再按它为本图件搭建绘图代码；整套图只用一个后端，尺寸和字号按目标期刊规格设定。`,
                en: `Call natsci_studio({ action: "read", kind: "code", name: "${entry.name}" }) for the starter code, then build this figure's plotting code from it; one backend for the whole set, with widths and type sizes set to the target journal's specifications.`,
              }
              : {
                zh: `先调用 natsci_studio({ action: "read", kind: "template", name: "${entry.name}" }) 读取模板，再按它的结构为本项目填写${label}；缺失的输入用显式占位符标出。`,
                en: `Call natsci_studio({ action: "read", kind: "template", name: "${entry.name}" }) for the template, then fill it in for this project as ${label}; mark missing inputs with explicit placeholders.`,
              };
            return h('div', { className: 'nsc-row', key: entry.name },
              h('div', { className: 'nsc-row-main' },
                h('div', { className: 'nsc-row-name' }, entry.name),
                h('div', { className: 'nsc-row-note' }, `${label} · ${l(entry.note)}`)),
              h('button', {
                type: 'button', className: 'nsc-btn',
                onClick: () => openSession(l(applyPrompt)),
              }, t('apply')));
          });

          const chipGroup = (lang, names) => names.map(name => h('button', {
            type: 'button', key: `${lang}-${name}`, className: 'nsc-chipbtn',
            title: `${lang}: ${name}`,
            onClick: () => openSession(l({
              zh: `先调用 natsci_studio({ action: "read", kind: "reference", name: "${name}", lang: "${lang}" }) 读取这条规则，再按它检查当前稿件的对应部分，并列出不符合的条目。`,
              en: `Call natsci_studio({ action: "read", kind: "reference", name: "${name}", lang: "${lang}" }) for this rule, then check the matching part of the current draft against it and list the violations.`,
            })),
          }, name));

          const ruleChips = h('div', null,
            h('div', { className: 'nsc-chiprow' },
              h('span', { className: 'nsc-row-note' }, `${t('langEn')} · ${REFERENCE_NAMES.length}`),
              chipGroup('en', REFERENCE_NAMES)),
            h('div', { className: 'nsc-chiprow' },
              h('span', { className: 'nsc-row-note' }, `${t('langZh')} · ${ZH_REFERENCE_NAMES.length}`),
              chipGroup('zh', ZH_REFERENCE_NAMES)));

          const toast = h('div', { className: 'nsc-toastwrap', 'aria-live': 'polite' },
            notice === null ? null : h('div', {
              className: 'nsc-toast',
              style: {
                color: notice.kind === 'error'
                  ? 'var(--dsw-alias-state-error-primary)'
                  : 'var(--dsw-alias-label-primary)',
              },
            }, notice.text));

          return h('div', { className: 'nsc-root' },
            h('style', null, CSS),
            h('div', { className: 'nsc-page' },
              h('header', { className: 'nsc-hero' },
                h('div', { className: 'nsc-mark' }, h(StudioIcon, { size: 26 })),
                h('div', null,
                  h('h1', { className: 'nsc-h1' }, t('title')),
                  h('p', { className: 'nsc-sub' }, t('subtitle')),
                  h('div', { className: 'nsc-chips' },
                    h('span', { className: 'nsc-chip' }, t('chipRulesEn')),
                    h('span', { className: 'nsc-chip' }, t('chipRulesZh')),
                    h('span', { className: 'nsc-chip' }, t('chipTemplates')),
                    h('span', { className: 'nsc-chip' }, t('chipCode')),
                    h('span', { className: 'nsc-chip' }, t('chipLicense'))))),
              h('section', { className: 'nsc-section' },
                h('h2', { className: 'nsc-h2' }, t('scenarios')),
                h('p', { className: 'nsc-hint' }, t('scenariosHint')),
                h('div', { className: 'nsc-grid' }, scenarioCards)),
              h('section', { className: 'nsc-section' },
                h('h2', { className: 'nsc-h2' }, t('figureStandards')),
                h('p', { className: 'nsc-hint' }, t('figureStandardsHint')),
                figureTable),
              h('section', { className: 'nsc-section' },
                h('h2', { className: 'nsc-h2' }, t('library')),
                h('p', { className: 'nsc-hint' }, t('libraryHint')),
                h('div', { className: 'nsc-rows' }, libraryRows)),
              h('section', { className: 'nsc-section' },
                h('details', { className: 'nsc-details' },
                  h('summary', null, `${t('rules')} · ${REFERENCE_NAMES.length + ZH_REFERENCE_NAMES.length}`),
                  h('p', { className: 'nsc-hint', style: { marginTop: '6px' } }, t('rulesHint')),
                  ruleChips)),
              h('section', { className: 'nsc-section' },
                h('h2', { className: 'nsc-h2' }, t('agent')),
                h('p', { className: 'nsc-hint' }, t('agentHint')),
                h('pre', { className: 'nsc-pre' }, EXAMPLES.join('\n')),
                h('div', { className: 'nsc-actions' },
                  h('button', {
                    type: 'button', className: 'nsc-btn nsc-btn-quiet',
                    onClick: () => copy(EXAMPLES.join('\n'), t('examplesCopied')),
                  }, t('copyExamples')))),
              h('p', { className: 'nsc-footer' }, t('footer')),
              toast));
        }

        ctx.effect(() => ctx.slots.inject('main', () => ctx.slots.register({
          name: 'main', key: PANEL_ID, locale: NS,
        }, StudioPanel)), 'natsci-writing: studio panel');

        ctx.effect(() => ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
          name: 'sidebar.panellist', id: PANEL_ID, order: 5, locale: NS,
          label: () => t('panel'),
        }, StudioIcon)), 'natsci-writing: sidebar entry');
      },
    };
  },
});
