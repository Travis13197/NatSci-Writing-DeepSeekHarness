/**
 * Host half of the NatSci writing studio bundle.
 *
 * It serves the bundled NatSci-Writing-skills 1.2.7.0 library to the model
 * through one read-only tool: deliverable briefs, document templates, figure
 * starter code and the reference rules behind them, in English and Chinese.
 * Nothing is written, fetched or executed; every answer comes from the files
 * shipped beside this module.
 *
 * @module dsh-natsci-writing
 */
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageDir = fileURLToPath(new URL('.', import.meta.url))
const libraryDir = join(packageDir, 'library')

/** Library version this bundle ships, kept in sync with the bundled SKILL.md. */
const LIBRARY_VERSION = '1.2.7.0'

/** Deliverable modes the studio recognises, in workflow order. */
const MODES = [
  { id: 'manuscript', title: '完整论文 / complete manuscript' },
  { id: 'figures', title: '投稿级图件 / figure set' },
  { id: 'report', title: '学术报告 / progress, group or final report' },
  { id: 'revision', title: '修订与审稿回复 / revision and response' },
  { id: 'polish', title: '润色、期刊格式与双语 / polish, journal format, bilingual' },
]

/**
 * Readable folders per language set, matching the upstream skill layout so the
 * paths a guide cites (`references/…`, `assets/templates/…`) resolve on disk.
 */
const KINDS = {
  template: { folder: 'assets/templates', limit: Number.POSITIVE_INFINITY },
  code: { folder: 'assets/code', limit: Number.POSITIVE_INFINITY },
  reference: { folder: 'references', limit: 24000 },
}

/** The guide file at each language set's root. */
const GUIDE = 'SKILL.md'

/** One-line purpose per template file, so `catalog` explains what each one is for. */
const TEMPLATE_NOTES = {
  'manuscript-outline.md': '稿件骨架：论断、章节、panel 引用与待补输入。',
  'perspective-manuscript-outline.md': 'Perspective 稿件骨架。',
  'figure-contract.md': '图件合同：核心结论、archetype、panel 地图、统计与审稿风险。',
  'figure-caption.md': '图注五段式：标题句、panel 走读、统计、符号、致谢与比例尺。',
  'figure-evidence-map.md': '图件—证据映射表：每个 panel 对应哪条论断与哪份数据。',
  'conceptual-figure-brief.md': '概念图 brief：要传达的机制与形式选择。',
  'data-and-code-statements.md': '数据与代码可用性声明。',
  'data-code-materials-checklist.md': '数据、代码、材料交付清单。',
  'reporting-and-statistics-checklist.md': '报告与统计清单：n、离散度、检验、校正。',
  'response-letter.md': '审稿意见逐点回复信骨架，含跟踪表字段。',
  'terminology-and-decisions.md': '术语与决策台账：不可改动项、已定判断与日期。',
  'cover-letter-and-submission.md': 'cover letter 与投稿包清单。',
  'editorial-audit.md': '编辑契合度审核表：期刊定位、篇幅、结论强度。',
  'innovation-canvas.md': '创新点画布：贡献类型与贡献阶梯。',
  'literature-search-plan.md': '文献检索计划：来源层级与筛选标准。',
  'editing-scope-and-change-log.md': '修订范围与 change log。',
  'ai-disclosure.md': 'AI 使用声明模板。',
  'ai-image-provenance-record.md': 'AI 图像来源与人工编辑记录。',
  'ai-negative-checklist.md': 'AI 使用负面清单：不能做的十件事。',
}

/** One-line purpose per starter script. */
const CODE_NOTES = {
  'figure_python.py': 'Python 出版级图件起手代码（Python 后端）。',
  'figure_r.R': 'R 出版级图件起手代码（R 后端）。',
}

/** One-line purpose per English reference document. */
const REFERENCE_NOTES = {
  'manuscript-production.md': '完整稿件生产、章节 playbook、文章类型、期刊格式、投稿包、自审。',
  'revision-and-response.md': '修订润色流程、证据强度短语库、风格护栏、回复信、审稿人模拟。',
  'journal-style-evidence.md': '语料覆盖、实测统计口径、体裁定义、范例与局限。',
  'writing-diagnostics.md': 'AI 腔词表、失败模式、改写训练。',
  'editorial-and-submission.md': 'Nature/Science 编辑标准、期刊契合、篇幅限制、cover letter 与投稿包。',
  'innovation-and-broad-interest.md': '贡献类型与阶梯、gap 设计、可区分预测、broad-interest 三问检验。',
  'main-text-and-information-architecture.md': '结果分级、最短证据链、正文/图注/SI 分工、修订膨胀控制。',
  'statistics-and-reporting-integrity.md': '独立单元与重复、Nature 统计要求、图像诚信、数据/代码/材料报告。',
  'language-and-taste.md': '句法节奏、声音、house style、品味诊断、中文专属检查。',
  'ai-use-and-writing-integrity.md': 'AI 署名禁令、披露、允许与禁止用途、AI 腔负面清单、保密。',
  'ai-figures-and-visual-integrity.md': 'AI 生成与辅助图件政策、数据图 vs 概念图、来源与 QC。',
  'literature-search-and-citation.md': '检索策略、来源层级、筛选、证据综合、引用核验。',
  'proofreading-and-polish.md': '五遍校对、句子润色、数字与引用一致性。',
  'perspective-and-insight.md': 'Perspective 的思想内核、发现序列、推测与责任、形式要素。',
  'nature-section-craft.md': 'Nature 摘要/引言/结果/讨论的 move 序列、论断升级、章节审核。',
  'nature-perspective-production.md': 'Nature Perspective/理论文生产：六段结构、整段规则、概念图、双语流程。',
  'figure-craft-and-information-density.md': '多 panel 证据架构、推理角色、图序升级、信息密度、graphical abstract。',
  'figure-production.md': '图件合同、archetype、Python/R 后端、设计系统、图表选择、QA。',
  'figure-standards-nature-science.md': 'Nature/Science 期刊规格、图注语法、统计呈现。',
  'figure-design-and-audit.md': '作者项目几何、色彩层级、结构渲染与发布审核。',
  'panel-layout-and-letter-placement.md': 'panel 排布与字母位置。',
  'figure-colour-audit-contract.md': '图件配色审核契约。',
  'structural-figures-baker-standard.md': '结构图标准（Baker 体系）。',
  'research-and-language.md': '课题设计、假设发展、文献综合、概念修订。',
  'html-and-data-verification.md': '完整 HTML 修订、数据真实性与计算核验。',
  'academic-prompt-zh.md': '可复用的中文任务提示词。',
  'defensive-writing-and-argument-selection.md': '防御性写作控制：发布会原则、论证取舍、实验职责、修辞减弱与校准的边界、度量门。',
  'mirror-world-case-study.md': '镜像世界假说 Perspective 的完整范例与编辑过程。',
  'seal-project.md': 'SEAL 项目专用约定与风格。',
  'seal-supplementary-figure-standard.md': 'SEAL 补充图标准与 28 图发布审核。',
  'translation-validation.md': '中英对照与译文校验。',
  'dimension-annotation.md': '维度标注约定。',
  'figure-r50-regression-checklist.md': 'R 图件 50 项回归检查清单（中文套）。',
}

/**
 * Folder holding one language set.
 * @param {'en' | 'zh'} lang - language of the set.
 * @returns {string} absolute folder path.
 */
const setDir = lang => (lang === 'zh' ? join(libraryDir, 'zh') : libraryDir)

/**
 * Read one folder of a language set, keeping only regular markdown or script files.
 * @param {string} dir - absolute folder path.
 * @returns {Promise<string[]>} sorted file names.
 */
async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  return entries
    .filter(entry => entry.isFile() && /\.(md|py|r)$/i.test(entry.name))
    .map(entry => entry.name)
    .sort()
}

/**
 * Build the catalog text: modes, both language sets, and the local path.
 * @returns {Promise<string>} catalog answer.
 */
async function catalog() {
  const en = setDir('en')
  const zh = setDir('zh')
  const [enTemplates, enCodes, enReferences, zhTemplates, zhCodes, zhReferences] = await Promise.all([
    listFiles(join(en, KINDS.template.folder)), listFiles(join(en, KINDS.code.folder)), listFiles(join(en, KINDS.reference.folder)),
    listFiles(join(zh, KINDS.template.folder)), listFiles(join(zh, KINDS.code.folder)), listFiles(join(zh, KINDS.reference.folder)),
  ])
  const lines = [
    `NatSci writing studio library — NatSci-Writing-skills ${LIBRARY_VERSION} (English and Chinese sets)`,
    `Library directory (readable directly with the read tool): ${libraryDir}`,
    'Both sets are complete; pass lang "zh" for the Chinese files, omit it (or "en") for English.',
    '',
    'Deliverable modes for action "brief":',
    ...MODES.map(mode => `- ${mode.id}: ${mode.title}`),
    '',
    `Parent guide, English: read { kind: "skill", name: "${GUIDE}" } — 模式路由、论证结构、语言诊断、章节 playbook。`,
    `Parent guide, Chinese: read { kind: "skill", name: "${GUIDE}", lang: "zh" } — 中文生产体系总纲。`,
    '',
    'English templates for read { kind: "template", name }:',
    ...enTemplates.map(name => `- ${name}: ${TEMPLATE_NOTES[name] ?? '模板。'}`),
    '',
    'English starter code for read { kind: "code", name }:',
    ...enCodes.map(name => `- ${name}: ${CODE_NOTES[name] ?? '起手代码。'}`),
    '',
    `English references for read { kind: "reference", name } (${KINDS.reference.limit} character preview, then the local path):`,
    ...enReferences.map(name => `- ${name}: ${REFERENCE_NOTES[name] ?? '参考规则。'}`),
    '',
    `Chinese set (lang: "zh") — ${zhReferences.length} references, ${zhTemplates.length} templates, ${zhCodes.length} starter scripts.`,
    'Chinese names differ from the English ones: some carry a -zh suffix, and a few exist only in Chinese.',
    `- references: ${zhReferences.join(', ')}`,
    `- templates: ${zhTemplates.join(', ')}`,
    `- code: ${zhCodes.join(', ')}`,
  ]
  return lines.join('\n')
}

/**
 * Resolve one requested library file against the allowlist of its folder.
 * @param {string} kind - `template`, `code`, `reference` or `skill`.
 * @param {string} name - file name from the catalog.
 * @param {'en' | 'zh'} lang - language set to read from.
 * @returns {Promise<{ path: string, limit: number }>} resolved absolute path and preview cap.
 */
async function resolveFile(kind, name, lang) {
  const root = setDir(lang)
  if (kind === 'skill') {
    if (name !== GUIDE) throw new Error(`unknown skill "${name}"; only ${GUIDE} is available`)
    return { path: join(root, GUIDE), limit: 24000 }
  }
  const spec = KINDS[kind]
  if (spec === undefined) throw new Error(`unknown kind "${kind}"; use template, code, reference or skill`)
  const files = await listFiles(join(root, spec.folder))
  if (!files.includes(name)) {
    throw new Error(`unknown ${kind} "${name}" in the ${lang} set; available: ${files.join(', ')}`)
  }
  return { path: join(root, spec.folder, name), limit: spec.limit }
}

/**
 * Read a text file, truncating at the folder's preview cap with an explicit notice.
 * @param {string} path - absolute file path inside the library.
 * @param {number} limit - maximum characters to return.
 * @returns {Promise<{ text: string, truncated: boolean }>} content and truncation flag.
 */
async function readBounded(path, limit) {
  const text = await readFile(path, 'utf8')
  if (text.length <= limit) return { text, truncated: false }
  return {
    text: `${text.slice(0, limit)}\n\n[truncated at ${limit} characters of ${text.length}; read ${path} directly for the rest]`,
    truncated: true,
  }
}

/** The tool definition registered on `ctx.tools`. */
const definition = {
  name: 'natsci_studio',
  description:
    `Read the bundled NatSci-Writing-skills ${LIBRARY_VERSION} library for scientific writing: deliverable `
    + 'briefs, document templates, figure starter code and the reference rules behind them, in English '
    + 'and Chinese, covering manuscripts, academic reports, submission-grade figure sets, reviewer '
    + 'responses, polishing or journal formatting, editorial fit, statistics and AI-use integrity. '
    + 'Use "catalog" to see every mode and document name, "brief" for one mode\'s workflow and '
    + 'acceptance checklist before drafting, and "read" to load one template, starter script, '
    + 'reference rule or the parent guide in full.',
  parameters: {
    type: 'object',
    additionalProperties: false,
    required: ['action'],
    properties: {
      action: {
        type: 'string',
        enum: ['catalog', 'brief', 'read'],
        description: 'catalog lists what exists; brief returns one mode\'s workflow; read returns one document.',
      },
      mode: {
        type: 'string',
        enum: MODES.map(mode => mode.id),
        description: 'Deliverable mode for action "brief": manuscript, figures, report, revision or polish.',
      },
      kind: {
        type: 'string',
        enum: ['template', 'code', 'reference', 'skill'],
        description: 'Library folder for action "read": template, code, reference, or the parent guide (skill).',
      },
      name: {
        type: 'string',
        description: 'File name from the catalog, for action "read".',
      },
      lang: {
        type: 'string',
        enum: ['en', 'zh'],
        description: 'Language set for action "read": "en" (default) or "zh". The two sets use different file names.',
      },
    },
  },
  output: {
    schema: {
      type: 'object',
      additionalProperties: false,
      required: ['ok', 'text'],
      properties: {
        ok: { type: 'boolean' },
        text: { type: 'string' },
        truncated: { type: 'boolean' },
      },
    },
    render(_args, value) {
      return [{ type: 'text', text: value.text }]
    },
  },
  async execute(args) {
    const action = args?.action
    if (action === 'catalog') return { ok: true, text: await catalog() }
    if (action === 'brief') {
      const mode = args?.mode
      if (!MODES.some(entry => entry.id === mode)) {
        throw new Error(`unknown mode "${mode}"; use ${MODES.map(entry => entry.id).join(', ')}`)
      }
      const { text } = await readBounded(join(libraryDir, 'briefs', `${mode}.md`), Number.POSITIVE_INFINITY)
      return { ok: true, text }
    }
    if (action === 'read') {
      const lang = args?.lang === 'zh' ? 'zh' : 'en'
      const resolved = await resolveFile(args?.kind, args?.name, lang)
      const { text, truncated } = await readBounded(resolved.path, resolved.limit)
      return { ok: true, text, truncated }
    }
    throw new Error(`unknown action "${action}"; use catalog, brief or read`)
  },
}

/** The tools registry is the only Host service this plugin needs. */
export const inject = ['tools']

/**
 * Register the library tool for the profile's agents.
 * @param {import('@deepseek-ai/cordis').Context} ctx - Host plugin context.
 */
export function apply(ctx) {
  ctx.effect(() => ctx.tools.register(definition), 'natsci-writing: library tool')
}
