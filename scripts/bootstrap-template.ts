#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { URL } from 'node:url';

function getRoot() {
  return process.cwd();
}

export function parseArgs(argv: string[]) {
  const args: Record<string, string> = {};

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];

    if (!current.startsWith('--')) {
      continue;
    }

    const [, rawKey, inlineValue] = current.match(/^--([^=]+)=?(.*)$/) || [];
    if (!rawKey) {
      continue;
    }

    const next = argv[index + 1];
    const hasInlineValue = inlineValue !== '';
    const value = hasInlineValue
      ? inlineValue
      : next && !next.startsWith('--')
        ? next
        : 'true';

    args[rawKey] = value;

    if (!hasInlineValue && next && !next.startsWith('--')) {
      index += 1;
    }
  }

  return args;
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
`);
}

function readTextFile(relativePath: string) {
  return fs.readFileSync(path.join(getRoot(), relativePath), 'utf8');
}

function writeTextFile(relativePath: string, content: string) {
  fs.writeFileSync(path.join(getRoot(), relativePath), content, 'utf8');
}

export function escapeSingleQuotes(value: string) {
  return String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

export function normalizeRepoUrl(rawRepo: string) {
  const repoValue = String(rawRepo)
    .trim()
    .replace(/^git\+/, '')
    .replace(/\.git$/, '')
    .replace(/\/$/, '');

  const sshMatch = repoValue.match(/^git@([^:]+):(.+)$/i);
  if (sshMatch) {
    const [, host, repoPath] = sshMatch;
    return `https://${host}/${repoPath}`
      .replace(/\.git$/, '')
      .replace(/\/$/, '');
  }

  if (/^git@github\.com:/i.test(repoValue)) {
    return `https://github.com/${repoValue.replace(/^git@github\.com:/i, '')}`
      .replace(/\.git$/, '')
      .replace(/\/$/, '');
  }

  if (/^ssh:\/\/git@github\.com\//i.test(repoValue)) {
    return `https://github.com/${repoValue.replace(/^ssh:\/\/git@github\.com\//i, '')}`
      .replace(/\.git$/, '')
      .replace(/\/$/, '');
  }

  if (/^ssh:\/\/git@/i.test(repoValue)) {
    const sshUrl = new URL(repoValue);
    return `https://${sshUrl.hostname}${sshUrl.pathname}`
      .replace(/\.git$/, '')
      .replace(/\/$/, '');
  }

  return repoValue;
}

export function toGitRepoUrl(repoUrl: string) {
  return repoUrl.startsWith('git+') ? repoUrl : `git+${repoUrl}`;
}

type TemplateConfig = {
  name: string;
  title: string;
  zhTitle: string;
  repoUrl: string;
  author?: string;
  description?: string;
};

export function updatePackageJson(config: TemplateConfig) {
  const packagePath = path.join(getRoot(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8')) as {
    name: string;
    description?: string;
    author?: string;
    homepage?: string;
    repository?: {
      type: string;
      url: string;
    };
    bugs?: {
      url: string;
    };
  };

  packageJson.name = config.name;
  packageJson.description = config.description || packageJson.description;
  packageJson.author = config.author || packageJson.author;
  packageJson.homepage = config.repoUrl;
  packageJson.repository = {
    type: 'git',
    url: toGitRepoUrl(config.repoUrl),
  };
  packageJson.bugs = {
    url: `${config.repoUrl}/issues`,
  };

  fs.writeFileSync(
    packagePath,
    `${JSON.stringify(packageJson, null, 2)}\n`,
    'utf8',
  );
}

export function replaceOrThrow(
  relativePath: string,
  pattern: RegExp,
  replacement: string,
  label: string,
) {
  const content = readTextFile(relativePath);

  if (!pattern.test(content)) {
    throw new Error(`Unable to update ${label} in ${relativePath}`);
  }

  writeTextFile(relativePath, content.replace(pattern, replacement));
}

export function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help === 'true' || args.h === 'true') {
    printUsage();
    return;
  }

  if (!args.name || !args.title || !args.repo) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const config: TemplateConfig = {
    name: args.name,
    title: args.title,
    zhTitle: args['zh-title'] || args.title,
    repoUrl: normalizeRepoUrl(args.repo),
    author: args.author,
    description: args.description,
  };

  updatePackageJson(config);

  replaceOrThrow(
    'src/locales/data/index.ts',
    /export const systemTitle = '.*'/,
    `export const systemTitle = '${escapeSingleQuotes(config.title)}'`,
    'system title constant',
  );

  replaceOrThrow(
    'src/locales/lang/zh-hans.ts',
    /systemTitle: '.*'/,
    `systemTitle: '${escapeSingleQuotes(config.zhTitle)}'`,
    'Chinese system title',
  );

  replaceOrThrow(
    'src/components/FooterCustom/index.vue',
    /const link = ref\('.*'\)/,
    `const link = ref('${escapeSingleQuotes(config.repoUrl)}')`,
    'footer repository link',
  );

  replaceOrThrow(
    'src/components/FooterCustom/octocat.vue',
    /const link = ref\('.*'\)/,
    `const link = ref('${escapeSingleQuotes(config.repoUrl)}')`,
    'octocat repository link',
  );

  replaceOrThrow('README.md', /^# .+$/m, `# ${config.title}`, 'README title');

  console.log('Template bootstrap completed.');
  console.log(`- name: ${config.name}`);
  console.log(`- title: ${config.title}`);
  console.log(`- zh-title: ${config.zhTitle}`);
  console.log(`- repo: ${config.repoUrl}`);
}

if (import.meta.url === new URL(process.argv[1], 'file:').href) {
  main();
}
