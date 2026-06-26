import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import * as bootstrapTemplate from '../scripts/bootstrap-template';

const tempDirs: string[] = [];

function createFixtureDir() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bootstrap-template-'));
  tempDirs.push(tempDir);
  return tempDir;
}

function writeFixtureFiles(rootDir: string) {
  fs.mkdirSync(path.join(rootDir, 'src/locales/data'), { recursive: true });
  fs.mkdirSync(path.join(rootDir, 'src/locales/lang'), { recursive: true });
  fs.mkdirSync(path.join(rootDir, 'src/components/FooterCustom'), {
    recursive: true,
  });

  fs.writeFileSync(
    path.join(rootDir, 'package.json'),
    JSON.stringify(
      {
        name: 'starter',
        description: 'starter description',
        author: 'Starter Author <starter@example.com>',
      },
      null,
      2,
    ),
  );
  fs.writeFileSync(path.join(rootDir, 'README.md'), '# Starter Title\n');
  fs.writeFileSync(
    path.join(rootDir, 'src/locales/data/index.ts'),
    "export const systemTitle = 'Starter';\n",
  );
  fs.writeFileSync(
    path.join(rootDir, 'src/locales/lang/zh-hans.ts'),
    "export default {\n  base: {\n    systemTitle: '启动项目',\n  },\n};\n",
  );
  fs.writeFileSync(
    path.join(rootDir, 'src/components/FooterCustom/index.vue'),
    "const link = ref('https://github.com/original/repo');\n",
  );
  fs.writeFileSync(
    path.join(rootDir, 'src/components/FooterCustom/octocat.vue'),
    "const link = ref('https://github.com/original/repo');\n",
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

describe('bootstrap-template script helpers', () => {
  it('normalizes generic ssh repo urls into https urls', () => {
    expect(
      bootstrapTemplate.normalizeRepoUrl('git@gitlab.com:group/project.git'),
    ).toBe('https://gitlab.com/group/project');

    expect(
      bootstrapTemplate.normalizeRepoUrl(
        'ssh://git@bitbucket.org/team/project.git',
      ),
    ).toBe('https://bitbucket.org/team/project');
  });

  it('updates template metadata using normalized repo urls', () => {
    const fixtureDir = createFixtureDir();
    writeFixtureFiles(fixtureDir);
    const originalCwd = process.cwd();

    try {
      process.chdir(fixtureDir);
      bootstrapTemplate.updatePackageJson({
        name: 'my-admin-app',
        title: 'My Admin App',
        zhTitle: '我的后台系统',
        repoUrl: bootstrapTemplate.normalizeRepoUrl(
          'git@gitlab.com:group/project.git',
        ),
        author: 'Your Name <you@example.com>',
        description: 'My personal admin starter',
      });
    } finally {
      process.chdir(originalCwd);
    }

    const packageJson = JSON.parse(
      fs.readFileSync(path.join(fixtureDir, 'package.json'), 'utf8'),
    );

    expect(packageJson.homepage).toBe('https://gitlab.com/group/project');
    expect(packageJson.repository).toEqual({
      type: 'git',
      url: 'git+https://gitlab.com/group/project',
    });
    expect(packageJson.bugs).toEqual({
      url: 'https://gitlab.com/group/project/issues',
    });
  });
});
