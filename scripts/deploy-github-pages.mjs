import { copyFileSync, existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import process from 'node:process'

const root = process.cwd()
const clientBuildPath = join(root, 'build', 'client')
const indexPath = join(clientBuildPath, 'index.html')
const fallbackPath = join(clientBuildPath, '404.html')
const nojekyllPath = join(clientBuildPath, '.nojekyll')
const isDryRun = process.argv.includes('--dry-run')

function quote(value) {
  return `"${value.replaceAll('"', '\\"')}"`
}

function run(command, options = {}) {
  const result = spawnSync(command, {
    shell: true,
    stdio: 'inherit',
    ...options,
  })

  if (result.error) {
    throw result.error
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

run('pnpm exec react-router build', {
  env: {
    ...process.env,
    GITHUB_PAGES: 'true',
  },
})

if (!existsSync(indexPath)) {
  throw new Error(`Could not find ${indexPath}. Did the build fail?`)
}

copyFileSync(indexPath, fallbackPath)
writeFileSync(nojekyllPath, '')

if (isDryRun) {
  console.log('Dry run complete. Skipped publishing to GitHub Pages.')
  process.exit(0)
}

run(`pnpm exec gh-pages -d ${quote(clientBuildPath)}`)
