# Self-hosted plugin index

`index.json` in this directory lists this one plugin. Users add its URL under
**Plugins → Discover → Add index source** and install from there; nothing else is
needed.

## Host it

The included workflow `.github/workflows/pages.yml` publishes this directory to
GitHub Pages on every change. Enable it once:

**Settings → Pages → Build and deployment → Source: GitHub Actions**, then push a change
under `distribution/`. The index URL becomes:

```text
https://Travis13197.github.io/NatSci-Writing-DeepSeekHarness/index.json
```

Any static HTTPS host works as well: the file must be served as UTF-8 JSON, answer 2xx
without a redirect, and stay under 128 MiB. The icon is inlined as a base64 `data:` URL,
so a single file suffices.

## Version source

The `source` field decides how the listed version installs:

| Mode | Command | Result |
|---|---|---|
| Git (default) | `node scripts/build-index.mjs` | `git+https://github.com/Travis13197/NatSci-Writing-DeepSeekHarness.git#<commit>` — installable before the package is on npm |
| npm | `node scripts/build-index.mjs --source=npm` | `dsh-natsci-writing@<version>` — use after `pnpm publish` |

Git mode reads the checked-out commit from `.git` (no `git` subprocess), so build the
index **from the commit that contains the release**, then commit the regenerated file.
The workflow above republishes Pages from the newest commit automatically.

## Update the index

1. Bump `version` in `package.json` and update `CHANGELOG.md`.
2. `node scripts/build-index.mjs` (or `--source=npm`).
3. Commit; Pages redeploys.

`publishTimestamp` is written at build time; `engines.dsh` mirrors `package.json` and is
checked again at install.

## Notes

- Index content is a claim made by its publisher: DeepSeek Harness validates the format,
  not the plugin. Users should confirm the source in the install dialog.
- Add other plugins to the `plugins` array if this index ever lists more than one.
