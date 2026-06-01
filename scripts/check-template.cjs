#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')

const root = process.cwd()

const requiredFiles = [
  'README.md',
  'package.json',
  'vite.config.ts',
  'tsconfig.json',
  'src/main.ts',
  'src/store/index.ts',
  '.github/workflows/ci.yml'
]

const forbiddenPatterns = [/demo_test/i, /test-layout/i, /vuex/i]

const failures = []

for (const relativePath of requiredFiles) {
  const absolutePath = path.join(root, relativePath)

  if (!fs.existsSync(absolutePath)) {
    failures.push(`Missing required file: ${ relativePath }`)
  }
}

const scanFiles = ['src', 'README.md', 'package.json']

function collectFiles(targetPath) {
  const absolutePath = path.join(root, targetPath)

  if (!fs.existsSync(absolutePath)) {
    return []
  }

  const stat = fs.statSync(absolutePath)

  if (stat.isFile()) {
    return [absolutePath]
  }

  return fs
    .readdirSync(absolutePath, {
      withFileTypes: true
    })
    .flatMap((entry) => {
      const nextRelative = path.join(targetPath, entry.name)
      return entry.isDirectory()
        ? collectFiles(nextRelative)
        : [path.join(root, nextRelative)]
    })
}

const filesToCheck = scanFiles.flatMap(collectFiles)

for (const file of filesToCheck) {
  const content = fs.readFileSync(file, 'utf8')

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(content)) {
      failures.push(
        `Forbidden placeholder found in ${ path.relative(root, file) }: ${ pattern }`
      )
    }
  }
}

if (failures.length) {
  console.error('Template check failed:')
  for (const failure of failures) {
    console.error(`- ${ failure }`)
  }
  process.exit(1)
}

console.log('Template check passed.')
