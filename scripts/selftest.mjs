/**
 * Self-test for the NatSci writing studio bundle.
 *
 * Verifies the installed package (manifest, submission metadata, display
 * resources, artwork, both library sets, the market index), that the Client
 * half's embedded counts and rule index match the files on disk, and every Host
 * tool action in both languages, including its rejections. It needs only Node —
 * no Harness process — and exits non-zero when a check fails.
 *
 * Run from the bundle root:
 *   node scripts/selftest.mjs
 *   (Desktop: ELECTRON_RUN_AS_NODE=1 "<app executable>" scripts/selftest.mjs)
 */
import { existsSync, readFileSync, readdirSync, realpathSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const pkgDir = dirname(dirname(fileURLToPath(import.meta.url)))
const MODES = ['manuscript', 'figures', 'report', 'revision', 'polish']
const KINDS = ['template', 'code', 'reference']
const LANGS = ['en', 'zh']

let pass = 0
let fail = 0
const check = (label, ok, detail = '') => {
  if (ok) {
    pass++
    console.log(`PASS  ${label}${detail === '' ? '' : ` — ${detail}`}`)
  } else {
    fail++
    console.log(`FAIL  ${label}${detail === '' ? '' : ` — ${detail}`}`)
  }
}

// 1. A profile install links this directory into its node_modules.
const profileDir = process.env.DSH_PROFILE_DIR
if (profileDir !== undefined) {
  const link = join(profileDir, 'node_modules', 'dsh-natsci-writing')
  if (existsSync(link)) check('profile link → bundle', realpathSync(link) === realpathSync(pkgDir))
  else check('profile link → bundle', false, 'not installed in this profile')
}

// 2. Manifest and shipped files.
const pkg = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'))
check('manifest name', pkg.name === 'dsh-natsci-writing', pkg.name)
check('bundle patch declared', pkg.dsh?.bundle?.patch === './cordis.patch.yml')
check('client half declared', pkg.dsh?.client?.platform === 'web' && pkg.dsh?.client?.immediately === true)
for (const rel of [
  'index.js', 'client.js', 'cordis.patch.yml', 'icon.svg', 'README.md', 'README.zh.md', 'CHANGELOG.md',
  'LICENSE', 'NOTICE.md', 'docs/DETAIL.md', 'docs/DETAIL.zh.md', 'docs/preview.svg',
  'locale/en.json', 'locale/zh.json', 'distribution/index.json',
  'library/SKILL.md', 'library/zh/SKILL.md', ...MODES.map(mode => `library/briefs/${mode}.md`),
]) check(`exists ${rel}`, existsSync(join(pkgDir, rel)))

// 2b. Submission metadata: publishable, versioned, and index-consistent.
check('license declared', pkg.license === 'Apache-2.0', pkg.license)
check('publishable (not private)', pkg.private !== true)
check('author declared', typeof pkg.author === 'string' && pkg.author.length > 0, pkg.author)
check('repository and homepage declared', Boolean(pkg.repository?.url && pkg.homepage))
check('dsh discovery keywords', Array.isArray(pkg.keywords) && pkg.keywords.includes('dsh-plugin'))
check('engines.dsh declared', typeof pkg.engines?.dsh === 'string', pkg.engines?.dsh)
check('client and icon exports',
  pkg.exports?.['./client'] === './client.js' && pkg.exports?.['./icon'] === './icon.svg')
const shippedFiles = JSON.stringify(pkg.files ?? [])
check('files cover runtime and display resources',
  ['index.js', 'client.js', 'cordis.patch.yml', 'library', 'locale/*.json', 'docs', 'scripts', 'distribution',
    'LICENSE', 'NOTICE.md'].every(entry => shippedFiles.includes(entry)))
const marketIndex = JSON.parse(readFileSync(join(pkgDir, 'distribution/index.json'), 'utf8'))
check('market index format 1', marketIndex.format === 1)
check('market index lists this package at this version', marketIndex.plugins?.length === 1
  && marketIndex.plugins[0].name === pkg.name
  && marketIndex.plugins[0].versions?.[0]?.version === pkg.version,
  `${marketIndex.plugins?.[0]?.name}@${marketIndex.plugins?.[0]?.versions?.[0]?.version}`)
const inlineIcon = marketIndex.plugins[0].icon ?? ''
check('market icon inline and within 32 KiB',
  inlineIcon.startsWith('data:image/svg+xml;base64,') && inlineIcon.length <= 32768, `${inlineIcon.length} chars`)
check('market index engines match the manifest',
  marketIndex.plugins[0].versions?.[0]?.engines?.dsh === pkg.engines?.dsh)
check('market index timestamp is Unix seconds',
  Number.isInteger(marketIndex.plugins[0].versions?.[0]?.publishTimestamp))

// 3. Display metadata, detail documents and artwork.
const en = JSON.parse(readFileSync(join(pkgDir, 'locale/en.json'), 'utf8'))
const zh = JSON.parse(readFileSync(join(pkgDir, 'locale/zh.json'), 'utf8'))
check('en meta fields', Boolean(en.meta?.title && en.meta?.description && en.meta?.detail))
check('zh meta fields', Boolean(zh.meta?.title && zh.meta?.description && zh.meta?.detail))
check('zh title localized', zh.meta.title !== en.meta.title, zh.meta.title)
check('en detail document exists', existsSync(join(pkgDir, en.meta.detail)))
check('zh detail document exists', existsSync(join(pkgDir, zh.meta.detail)))
const icon = readFileSync(join(pkgDir, 'icon.svg'), 'utf8')
check('icon under 256 KiB', statSync(join(pkgDir, 'icon.svg')).size < 256 * 1024)
check('icon self-contained', !/<script|<style|<image|foreignObject|animate/i.test(icon))
check('icon 36x36 viewBox', /width="36" height="36" viewBox="0 0 36 36"/.test(icon))
const preview = readFileSync(join(pkgDir, 'docs/preview.svg'), 'utf8')
check('preview 640x300 and text-free', /width="640" height="300"/.test(preview) && !/<text/.test(preview))
check('detail documents hold one image line', [en.meta.detail, zh.meta.detail]
  .every(rel => readFileSync(join(pkgDir, rel), 'utf8').trim().split('\n').length === 1))

// 4. Library inventory, both language sets.
const listMd = dir => readdirSync(dir).filter(name => name.endsWith('.md'))
const inventory = {
  en: {
    references: listMd(join(pkgDir, 'library/references')),
    templates: listMd(join(pkgDir, 'library/assets/templates')),
    codes: readdirSync(join(pkgDir, 'library/assets/code')),
    guide: readFileSync(join(pkgDir, 'library/SKILL.md'), 'utf8'),
  },
  zh: {
    references: listMd(join(pkgDir, 'library/zh/references')),
    templates: listMd(join(pkgDir, 'library/zh/assets/templates')),
    codes: readdirSync(join(pkgDir, 'library/zh/assets/code')),
    guide: readFileSync(join(pkgDir, 'library/zh/SKILL.md'), 'utf8'),
  },
}
const briefs = listMd(join(pkgDir, 'library/briefs'))
check('English library 1.2.8.0', /version: "1\.2\.8\.0"/.test(inventory.en.guide))
check('Chinese library 1.2.8.0', /version: "1\.2\.8\.0"/.test(inventory.zh.guide))
for (const lang of LANGS) {
  const set = inventory[lang]
  check(`${lang} references present`, set.references.length >= 20, String(set.references.length))
  check(`${lang} templates present`, set.templates.length >= 19, String(set.templates.length))
  check(`${lang} starter scripts`, set.codes.length === 2, set.codes.join(','))
}
check('one brief per mode', MODES.every(mode => briefs.includes(`${mode}.md`)), briefs.join(','))
check('the two sets use their own file names',
  inventory.zh.references.some(name => !inventory.en.references.includes(name))
  && inventory.en.references.some(name => !inventory.zh.references.includes(name)))
// Both guides cite library-relative paths; each cited file must sit beside its guide.
for (const lang of LANGS) {
  const guideDir = join(pkgDir, lang === 'zh' ? 'library/zh' : 'library')
  const cited = [...new Set([...inventory[lang].guide.matchAll(
    /(?:references\/[A-Za-z0-9_-]+\.md|assets\/templates\/[A-Za-z0-9_-]+\.md|assets\/code\/[A-Za-z0-9_-]+\.(?:py|R))/g,
  )].map(match => match[0].replace(/[.,)]+$/, '')))]
  const missing = cited.filter(rel => !existsSync(join(guideDir, rel)))
  check(`${lang} guide links resolve inside the bundle`, missing.length === 0,
    `${cited.length} cited${missing.length === 0 ? '' : `, missing ${missing.join(', ')}`}`)
}

// 5. The Client half must not drift from the files on disk.
const client = readFileSync(join(pkgDir, 'client.js'), 'utf8')
const section = (start, end) => client.slice(client.indexOf(start), client.indexOf(end, client.indexOf(start)))
const quoted = block => [...block.matchAll(/'([^']+\.(?:md|py|r))'/g)].map(match => match[1])
const clientEnReferences = quoted(section('const REFERENCE_NAMES = [', '];'))
const clientZhReferences = quoted(section('const ZH_REFERENCE_NAMES = [', '];'))
check('client English rule index matches disk',
  clientEnReferences.length === inventory.en.references.length
  && inventory.en.references.every(name => clientEnReferences.includes(name)),
  `${clientEnReferences.length} listed`)
check('client Chinese rule index matches disk',
  clientZhReferences.length === inventory.zh.references.length
  && inventory.zh.references.every(name => clientZhReferences.includes(name)),
  `${clientZhReferences.length} listed`)
const clientLibrary = [...section('const LIBRARY = [', '\n    ];').matchAll(/name: '([^']+)'/g)].map(match => match[1])
check('client library matches disk',
  clientLibrary.length === inventory.en.templates.length + inventory.en.codes.length
  && [...inventory.en.templates, ...inventory.en.codes].every(name => clientLibrary.includes(name)),
  `${clientLibrary.length} listed`)
const chips = [
  client.match(/chipRulesEn: '(\d+)/)?.[1],
  client.match(/chipRulesZh: '(\d+)/)?.[1],
  client.match(/chipTemplates: '(\d+)/)?.[1],
  client.match(/chipCode: '(\d+)/)?.[1],
].join('/')
check('client chips match disk', chips === [
  inventory.en.references.length, inventory.zh.references.length,
  inventory.en.templates.length, inventory.en.codes.length,
].join('/'), chips)
check('client carries every mode', MODES.every(mode => client.includes(`id: '${mode}'`)))
check('client sends lang for the Chinese index', client.includes('lang: "${lang}"'))
// Every string the panel asks the locale service for must exist in both dictionaries.
const dictBlock = name => client.slice(client.indexOf(`const ${name} = {`), client.indexOf('\n    };', client.indexOf(`const ${name} = {`)))
const usedKeys = [...new Set([...client.matchAll(/\bt\('([a-zA-Z0-9]+)'\)/g)].map(match => match[1]))]
const hasKey = (block, key) => new RegExp(`\\n\\s{6}${key}:`).test(block)
const missingZh = usedKeys.filter(key => !hasKey(dictBlock('ZH'), key))
const missingEn = usedKeys.filter(key => !hasKey(dictBlock('EN'), key))
check('every panel string exists in both dictionaries', missingZh.length === 0 && missingEn.length === 0,
  `used ${usedKeys.length}`
  + (missingZh.length === 0 ? '' : `, zh missing ${missingZh.join(',')}`)
  + (missingEn.length === 0 ? '' : `, en missing ${missingEn.join(',')}`))

// 6. The Host tool, exercised through a stand-in tools registry.
const { apply } = await import(pathToFileURL(join(pkgDir, 'index.js')).href)
const registered = []
apply({
  effect(fn) { const dispose = fn(); return () => { if (typeof dispose === 'function') dispose() } },
  tools: { register(definition) { registered.push(definition); return () => {} } },
})
check('exactly one tool registered', registered.length === 1, registered[0]?.name)
const tool = registered[0]
check('tool takes an action parameter', tool.parameters?.required?.includes('action') === true)
check('tool exposes a lang parameter', JSON.stringify(tool.parameters?.properties?.lang?.enum) === '["en","zh"]')
const catalog = await tool.execute({ action: 'catalog' })
check('catalog lists every English file',
  [...inventory.en.references, ...inventory.en.templates, ...inventory.en.codes, 'SKILL.md']
    .every(name => catalog.text.includes(name)))
check('catalog lists every Chinese reference',
  inventory.zh.references.every(name => catalog.text.includes(name)))
for (const mode of MODES) {
  const answer = await tool.execute({ action: 'brief', mode })
  check(`brief ${mode}`, answer.ok === true && answer.text.length > 800, `${answer.text.length} chars`)
}
for (const lang of LANGS) {
  const set = inventory[lang]
  for (const kind of KINDS) {
    const names = kind === 'template'
      ? set.templates
      : kind === 'code' ? set.codes : set.references.slice(0, 3)
    for (const name of names) {
      const answer = await tool.execute({ action: 'read', kind, name, lang })
      const bounded = kind !== 'reference' || answer.truncated === true || answer.text.length <= 24000
      check(`read ${lang} ${kind}/${name}`,
        answer.ok === true && answer.text.length > 100 && bounded, `${answer.text.length} chars`)
    }
  }
  const guide = await tool.execute({ action: 'read', kind: 'skill', name: 'SKILL.md', lang })
  check(`read ${lang} parent guide`, guide.ok === true && guide.text.startsWith('---'), `${guide.text.length} chars`)
}
for (const bad of [
  { action: 'read', kind: 'template', name: '../library/SKILL.md' },
  { action: 'read', kind: 'reference', name: 'package.json' },
  { action: 'read', kind: 'skill', name: 'other.md' },
  { action: 'read', kind: 'reference', name: 'writing-diagnostics.md', lang: 'zh' },
  { action: 'brief', mode: 'format' },
  { action: 'nope' },
]) {
  let rejected = false
  try { await tool.execute(bad) } catch { rejected = true }
  check(`rejects ${JSON.stringify(bad)}`, rejected)
}
check('host half performs no filesystem writes',
  !/writeFile|appendFile|mkdir\(|unlink|rename\(|rm\(/.test(readFileSync(join(pkgDir, 'index.js'), 'utf8')))

console.log(`\nRESULT: ${pass} passed, ${fail} failed`)
process.exit(fail === 0 ? 0 : 1)
