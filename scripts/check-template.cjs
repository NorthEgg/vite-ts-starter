#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

function getRoot() {
  return process.cwd();
}

const requiredFiles = [
  'README.md',
  'package.json',
  'vite.config.ts',
  'tsconfig.json',
  'src/main.ts',
  'src/store/index.ts',
  '.github/workflows/ci.yml',
];

const forbiddenPatterns = [/demo_test/i, /test-layout/i, /vuex/i];

const scanFiles = [
  'src',
  'README.md',
  'package.json',
  'vite.config.ts',
  'docs',
  '.github/workflows',
];

function collectFiles(targetPath) {
  const absolutePath = path.join(getRoot(), targetPath);

  if (!fs.existsSync(absolutePath)) {
    return [];
  }

  const stat = fs.statSync(absolutePath);

  if (stat.isFile()) {
    return [absolutePath];
  }

  return fs
    .readdirSync(absolutePath, {
      withFileTypes: true,
    })
    .flatMap((entry) => {
      const nextRelative = path.join(targetPath, entry.name);
      return entry.isDirectory()
        ? collectFiles(nextRelative)
        : [path.join(getRoot(), nextRelative)];
    });
}

function runTemplateCheck() {
  const failures = [];

  for (const relativePath of requiredFiles) {
    const absolutePath = path.join(getRoot(), relativePath);

    if (!fs.existsSync(absolutePath)) {
      failures.push(`Missing required file: ${relativePath}`);
    }
  }

  const filesToCheck = scanFiles.flatMap(collectFiles);

  for (const file of filesToCheck) {
    const content = fs.readFileSync(file, 'utf8');

    for (const pattern of forbiddenPatterns) {
      if (pattern.test(content)) {
        failures.push(
          `Forbidden placeholder found in ${path.relative(getRoot(), file)}: ${pattern}`,
        );
      }
    }
  }

  return failures;
}

function main() {
  const failures = runTemplateCheck();

  if (failures.length) {
    console.error('Template check failed:');
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log('Template check passed.');
}

if (require.main === module) {
  main();
}

module.exports = {
  collectFiles,
  forbiddenPatterns,
  main,
  requiredFiles,
  runTemplateCheck,
  scanFiles,
};
