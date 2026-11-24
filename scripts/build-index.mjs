/**
 * Regenerate `distribution/index.json`, the plugin index this bundle publishes.
 *
 * The index lists one plugin — this package — at its current version, with the
 * icon inlined so the file is self-contained and can be served from any static
 * host. Run it after every version bump, then publish `distribution/`.
 *
 * The version source decides how others install it:
 *   --source=git  (default) GitHub commit — installable before the package is on npm.
 *   --source=npm            npm registry — use after `pnpm publish`.
 *
 *   node scripts/build-index.mjs            # git source at HEAD
 *   node scripts/build-index.mjs --source=npm
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const pkgDir = dirname(dirname(fileURLToPath(import.meta.url)))
const pkg = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'))
const en = JSON.parse(readFileSync(join(pkgDir, 'locale/en.json'), 'utf8'))
const zh = JSON.parse(readFileSync(join(pkgDir, 'locale/zh.json'), 'utf8'))
const icon = readFileSync(join(pkgDir, 'icon.svg')).toString('base64')

/**
 * Read the commit this checkout points at, without spawning git.
 * @returns {string | undefined} the 40-hex commit, or undefined outside a checkout.
 */
function gitHead() {
  try {
    const head = readFileSync(join(pkgDir, '.git/HEAD'), 'utf8').trim()
    if (!head.startsWith('ref:')) return /^[0-9a-f]{40}$/.test(head) ? head : undefined
    const ref = head.slice(4).trim()
    const loose = join(pkgDir, '.git', ref)
    if (existsSync(loose)) {
      const value = readFileSync(loose, 'utf8').trim()
      return /^[0-9a-f]{40}$/.test(value) ? value : undefined
    }
    const packedPath = join(pkgDir, '.git/packed-refs')
    if (!existsSync(packedPath)) return undefined
    const line = readFileSync(packedPath, 'utf8').split('\n').find(entry => entry.endsWith(` ${ref}`))
    const value = line?.split(' ')[0]
    return value !== undefined && /^[0-9a-f]{40}$/.test(value) ? value : undefined
  } catch {
    return undefined
  }
}

const requested = process.argv.slice(2).find(arg => arg.startsWith('--source='))?.slice('--source='.length)
const repoUrl = pkg.repository.url.replace(/^git\+/, '').replace(/\.git$/, '')
const head = gitHead()
const useNpm = requested === 'npm' || requested === 'registry' || (requested === undefined && head === undefined)
const source = useNpm ? { type: 'npm' } : { type: 'git', url: repoUrl, commit: head }

const index = {
  format: 1,
  title: { en: en.meta.title, zh: zh.meta.title },
  description: {
    en: 'A writing studio for DeepSeek Harness: manuscripts, reports, figures and reviewer responses.',
    zh: 'DeepSeek Harness 的科研写作台：论文、报告、图件与审稿回复。',
  },
  metadata: {
    categories: {
      writing: { title: { en: 'Scientific writing', zh: '科研写作' } },
    },
  },
  plugins: [
    {
      name: pkg.name,
      title: { en: en.meta.title, zh: zh.meta.title },
      description: { en: pkg.description, zh: zh.meta.description },
      icon: `data:image/svg+xml;base64,${icon}`,
      author: pkg.author,
      homepage: pkg.homepage,
      repository: { url: repoUrl },
      metadata: { category: 'writing' },
      versions: [
        {
          version: pkg.version,
          publishTimestamp: Math.floor(Date.now() / 1000),
          source,
          ...pkg.engines?.dsh === undefined ? {} : { engines: { dsh: pkg.engines.dsh } },
        },
      ],
    },
  ],
}

const target = join(pkgDir, 'distribution/index.json')
writeFileSync(target, `${JSON.stringify(index, null, 2)}\n`)
const spec = useNpm
  ? `${pkg.name}@${pkg.version}`
  : `git+${repoUrl}.git#${head}`
console.log(`wrote ${target}`)
console.log(`  ${pkg.name}@${pkg.version}, source ${source.type}, install spec ${spec}`)
console.log(`  icon ${(icon.length / 1024).toFixed(1)} KiB inlined`)
