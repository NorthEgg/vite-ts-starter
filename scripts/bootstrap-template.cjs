#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')

const root = process.cwd()

function parseArgs(argv) {
  const args = {}

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index]

    if (!current.startsWith('--')) {
      continue
    }

    const [, rawKey, inlineValue] = current.match(/^--([^=]+)=?(.*)$/) || []
    const next = argv[index + 1]
    const hasInlineValue = inlineValue !== ''
    const value = hasInlineValue
      ? inlineValue
      : next && !next.startsWith('--')
        ? next
        : 'true'

    args[rawKey] = value

    if (!hasInlineValue && next && !next.startsWith('--')) {
      index += 1
    }
  }

  return args
}

function printUsage() {
  console.log(`
Usage:
  pnpm init:template -- --name my-app --title "My App" --repo https://github.com/you/my-app

Optional:
  --description "Template description"
  --author "Your Name <you@example.com>"
  --zh-title "中文系统标题"
  --help
`)
}

function readTextFile(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8')
}

function writeTextFile(relativePath, content) {
  fs.writeFileSync(path.join(root, relativePath), content, 'utf8')
}

function escapeSingleQuotes(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function normalizeRepoUrl(rawRepo) {
  const repoValue = String(rawRepo)
    .trim()
    .replace(/^git\+/, '')
    .replace(/\.git$/, '')
    .replace(/\/$/, '')

  if (/^git@github\.com:/i.test(repoValue)) {
    return `https://github.com/${ repoValue.replace(/^git@github\.com:/i, '') }`
      .replace(/\.git$/, '')
      .replace(/\/$/, '')
  }

  if (/^ssh:\/\/git@github\.com\//i.test(repoValue)) {
    return `https://github.com/${ repoValue.replace(/^ssh:\/\/git@github\.com\//i, '') }`
      .replace(/\.git$/, '')
      .replace(/\/$/, '')
  }

  return repoValue
}

function toGitRepoUrl(repoUrl) {
  return repoUrl.startsWith('git+') ? repoUrl : `git+${ repoUrl }`
}

function updatePackageJson(config) {
  const packagePath = path.join(root, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))

  packageJson.name = config.name
  packageJson.description = config.description || packageJson.description
  packageJson.author = config.author || packageJson.author
  packageJson.homepage = config.repoUrl
  packageJson.repository = {
    type: 'git',
    url: toGitRepoUrl(config.repoUrl)
  }
  packageJson.bugs = {
    url: `${ config.repoUrl }/issues`
  }

  fs.writeFileSync(
    packagePath,
    `${ JSON.stringify(packageJson, null, 2) }\n`,
    'utf8'
  )
}

function replaceOrThrow(relativePath, pattern, replacement, label) {
  const content = readTextFile(relativePath)

  if (!pattern.test(content)) {
    throw new Error(`Unable to update ${ label } in ${ relativePath }`)
  }

  writeTextFile(relativePath, content.replace(pattern, replacement))
}

function main() {
  const args = parseArgs(process.argv.slice(2))

  if (args.help === 'true' || args.h === 'true') {
    printUsage()
    return
  }

  if (!args.name || !args.title || !args.repo) {
    printUsage()
    process.exitCode = 1
    return
  }

  const config = {
    name: args.name,
    title: args.title,
    zhTitle: args['zh-title'] || args.title,
    repoUrl: normalizeRepoUrl(args.repo),
    author: args.author,
    description: args.description
  }

  updatePackageJson(config)

  replaceOrThrow(
    'src/locales/data/index.ts',
    /export const systemTitle = '.*'/,
    `export const systemTitle = '${ escapeSingleQuotes(config.title) }'`,
    'system title constant'
  )

  replaceOrThrow(
    'src/locales/lang/zh-hans.ts',
    /systemTitle: '.*'/,
    `systemTitle: '${ escapeSingleQuotes(config.zhTitle) }'`,
    'Chinese system title'
  )

  replaceOrThrow(
    'src/components/FooterCustom/index.vue',
    /const link = ref\('.*'\)/,
    `const link = ref('${ escapeSingleQuotes(config.repoUrl) }')`,
    'footer repository link'
  )

  replaceOrThrow(
    'src/components/FooterCustom/octocat.vue',
    /const link = ref\('.*'\)/,
    `const link = ref('${ escapeSingleQuotes(config.repoUrl) }')`,
    'octocat repository link'
  )

  replaceOrThrow('README.md', /^# .+$/m, `# ${ config.title }`, 'README title')

  console.log('Template bootstrap completed.')
  console.log(`- name: ${ config.name }`)
  console.log(`- title: ${ config.title }`)
  console.log(`- zh-title: ${ config.zhTitle }`)
  console.log(`- repo: ${ config.repoUrl }`)
}

main()
