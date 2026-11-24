/**
 * Regenerate `distribution/index.json`, the plugin index this bundle publishes.
 *
 * The index lists one plugin — this package — at its current version, with the
 * icon inlined so the file is self-contained and can be served from any static
 * host. Run it after every version bump, then publish `distribution/`.
 *
 *   node scripts/build-index.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const pkgDir = dirname(dirname(fileURLToPath(import.meta.url)))
const pkg = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'))
const en = JSON.parse(readFileSync(join(pkgDir, 'locale/en.json'), 'utf8'))
const zh = JSON.parse(readFileSync(join(pkgDir, 'locale/zh.json'), 'utf8'))
const icon = readFileSync(join(pkgDir, 'icon.svg')).toString('base64')

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
      repository: { url: pkg.repository.url.replace(/^git\+/, '').replace(/\.git$/, '') },
      metadata: { category: 'writing' },
      versions: [
        {
          version: pkg.version,
          publishTimestamp: Math.floor(Date.now() / 1000),
          source: { type: 'npm' },
          ...pkg.engines?.dsh === undefined ? {} : { engines: { dsh: pkg.engines.dsh } },
        },
      ],
    },
  ],
}

const target = join(pkgDir, 'distribution/index.json')
writeFileSync(target, `${JSON.stringify(index, null, 2)}\n`)
console.log(`wrote ${target}`)
console.log(`  ${pkg.name}@${pkg.version}, icon ${(icon.length / 1024).toFixed(1)} KiB inlined`)
