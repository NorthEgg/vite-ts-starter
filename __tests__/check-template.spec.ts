import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

const tempDirs: string[] = [];

function createFixtureDir() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'template-check-'));
  tempDirs.push(tempDir);
  return tempDir;
}

function writeBaseFixture(rootDir: string) {
  fs.mkdirSync(path.join(rootDir, 'src/store'), { recursive: true });
  fs.mkdirSync(path.join(rootDir, '.github/workflows'), { recursive: true });

  fs.writeFileSync(path.join(rootDir, 'README.md'), '# Template\n');
  fs.writeFileSync(path.join(rootDir, 'package.json'), '{"name":"starter"}\n');
  fs.writeFileSync(
    path.join(rootDir, 'vite.config.ts'),
    'export default {};\n',
  );
  fs.writeFileSync(path.join(rootDir, 'tsconfig.json'), '{}\n');
  fs.writeFileSync(path.join(rootDir, 'src/main.ts'), 'export {};\n');
  fs.writeFileSync(path.join(rootDir, 'src/store/index.ts'), 'export {};\n');
  fs.writeFileSync(
    path.join(rootDir, '.github/workflows/ci.yml'),
    'name: ci\n',
  );
}

afterEach(() => {
  while (tempDirs.length) {
    fs.rmSync(tempDirs.pop()!, {
      recursive: true,
      force: true,
    });
  }
});

describe('check-template script', () => {
  it('flags forbidden placeholders in root config files such as vite.config.ts', () => {
    const fixtureDir = createFixtureDir();
    writeBaseFixture(fixtureDir);
    fs.writeFileSync(
      path.join(fixtureDir, 'vite.config.ts'),
      "const vendorChunkGroups = { 'vendor-core': ['vue', 'vue-router', 'vuex'] };\n",
    );
    const originalCwd = process.cwd();

    try {
      process.chdir(fixtureDir);
      const templateCheck = require('../scripts/check-template.cjs');
      const failures = templateCheck.runTemplateCheck();

      expect(failures).toEqual(
        expect.arrayContaining([
          expect.stringContaining('vite.config.ts'),
          expect.stringContaining('/vuex/i'),
        ]),
      );
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('passes when required files exist and forbidden placeholders are absent', () => {
    const fixtureDir = createFixtureDir();
    writeBaseFixture(fixtureDir);
    const originalCwd = process.cwd();

    try {
      process.chdir(fixtureDir);
      const templateCheck = require('../scripts/check-template.cjs');

      expect(templateCheck.runTemplateCheck()).toEqual([]);
    } finally {
      process.chdir(originalCwd);
    }
  });
});
