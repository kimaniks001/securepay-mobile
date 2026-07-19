#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const scanDirs = ['app', 'src/components', 'src/doctrine'];
const forbiddenButtonLabels = [/withdraw/i, /release/i, /payout/i, /cash out/i, /confirm payment/i];
const requiredSnippets = ['SecureLink', 'Group SecureLink', 'KES 10', 'KES 20', 'mock'];

const forbiddenPhrases = [
  'withdraw now',
  'cash out',
  'instant payout',
  'payment completed',
  'money released',
  'send money instantly',
  'ready to withdraw',
  'ready for payout',
];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (entry === 'node_modules') continue;
      walk(full, files);
    } else if (/\.(tsx|ts|md)$/.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

function readConfigMode() {
  const config = fs.readFileSync(path.join(root, 'src/api/config.ts'), 'utf8');
  if (!config.includes("return 'mock'")) {
    throw new Error('API config must default to mock mode');
  }
}

let failed = false;
const allFiles = scanDirs.flatMap((d) => walk(path.join(root, d)));
const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
const corpus = [readme, ...allFiles.map((f) => fs.readFileSync(f, 'utf8'))].join('\n');

for (const phrase of forbiddenPhrases) {
  const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf8');
    if (regex.test(content) && !file.includes('uiTextGuard') && !file.includes('securepayDoctrine')) {
      console.error(`Forbidden phrase "${phrase}" found in ${path.relative(root, file)}`);
      failed = true;
    }
  }
}

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  for (const pattern of forbiddenButtonLabels) {
    const buttonMatches =
      content.match(/<AppButton[^>]*label=["'`]([^"'`]+)["'`]/gi) ||
      content.match(/<Button[^>]*label=["'`]([^"'`]+)["'`]/gi) ||
      [];
    for (const match of buttonMatches) {
      const label = match.replace(/.*label=["'`]/i, '').replace(/["'`]$/, '');
      if (pattern.test(label)) {
        console.error(`Forbidden button label "${label}" in ${path.relative(root, file)}`);
        failed = true;
      }
    }
  }
}

for (const snippet of requiredSnippets) {
  if (!corpus.includes(snippet)) {
    console.error(`Missing required snippet: ${snippet}`);
    failed = true;
  }
}

try {
  readConfigMode();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  failed = true;
}

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const deps = { ...pkg.dependencies, ...pkg.devDependencies };
const bannedDeps = ['stripe', '@supabase/supabase-js', 'mpesa', 'pesalink'];
for (const dep of bannedDeps) {
  if (deps[dep]) {
    console.error(`Forbidden direct provider dependency: ${dep}`);
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}

console.log('Mobile UI safety checks passed.');
