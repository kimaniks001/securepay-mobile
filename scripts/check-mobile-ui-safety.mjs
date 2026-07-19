#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const scanDirs = ['app', 'src/components', 'src/doctrine', 'src/api'];
const forbiddenButtonLabels = [/withdraw/i, /release/i, /payout/i, /cash out/i, /confirm payment/i, /ledger posting/i, /provider confirmation/i];
const requiredSnippets = ['SecureLink', 'Group SecureLink', 'KES 10', 'KES 20', 'mock', 'staging'];

const forbiddenPhrases = [
  'withdraw now',
  'cash out',
  'instant payout',
  'payment completed',
  'money released',
  'funds released',
  'send money instantly',
  'ready to withdraw',
  'ready for payout',
  'fake payment complete',
  'escrow',
  'frozen',
  'custody',
  'guaranteed payout',
  'settlement complete',
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
  if (!config.includes('production_disabled')) {
    throw new Error('API config must disable production in Phase 3');
  }
  if (!config.includes('EXPO_PUBLIC_SECUREPAY_ENABLE_API_WRITES')) {
    throw new Error('API config must reject API writes in Phase 3');
  }
  if (!config.includes('securepay.ke')) {
    throw new Error('API config must reject production securepay.ke URLs by default');
  }
}

function readApiSafetyFiles() {
  const guards = fs.readFileSync(path.join(root, 'src/api/mobileActionGuards.ts'), 'utf8');
  const requiredGuardActions = [
    'release',
    'withdrawal',
    'payout',
    'provider_confirmation',
    'ledger_posting',
    'create_payment_success',
    'internal_webhook_complete',
    'internal_ledger_posting',
  ];
  for (const action of requiredGuardActions) {
    if (!guards.includes(`'${action}'`)) {
      throw new Error(`mobileActionGuards must block ${action}`);
    }
  }

  const endpoints = fs.readFileSync(path.join(root, 'src/api/endpoints.ts'), 'utf8');
  if (!endpoints.includes('forbiddenMoneyActionEndpoints')) {
    throw new Error('endpoints.ts must define forbiddenMoneyActionEndpoints');
  }
  if (!endpoints.includes('webhook-complete') || !endpoints.includes('auto-payout')) {
    throw new Error('forbiddenMoneyActionEndpoints must block webhook-complete and auto-payout');
  }
  if (!endpoints.includes('authEndpoints')) {
    throw new Error('endpoints.ts must define authEndpoints');
  }

  const sessionStorage = fs.readFileSync(path.join(root, 'src/api/sessionStorage.ts'), 'utf8');
  if (!sessionStorage.includes('INTERNAL_TOKEN') || !sessionStorage.includes('webhook_secret')) {
    throw new Error('sessionStorage must reject INTERNAL_TOKEN and webhook secrets');
  }

  const authApi = path.join(root, 'src/api/authApi.ts');
  if (!fs.existsSync(authApi)) {
    throw new Error('authApi.ts is required for Phase 4');
  }

  const contractSelfCheck = path.join(root, 'src/api/contractSelfCheck.ts');
  if (!fs.existsSync(contractSelfCheck)) {
    throw new Error('contractSelfCheck.ts is required for Phase 4');
  }

  const httpClient = fs.readFileSync(path.join(root, 'src/api/httpClient.ts'), 'utf8');
  if (!httpClient.includes('isAuthEndpoint')) {
    throw new Error('httpClient must allow auth POST endpoints only');
  }

  const accountScreen = fs.readFileSync(path.join(root, 'app/(tabs)/account.tsx'), 'utf8');
  if (!accountScreen.includes('API contract status')) {
    throw new Error('Account screen must show API contract status');
  }

  const loginScreen = fs.readFileSync(path.join(root, 'app/login.tsx'), 'utf8');
  if (!loginScreen.includes('demo mode') && !loginScreen.includes('staging credentials')) {
    throw new Error('Login screen must support demo and staging modes');
  }

  for (const file of ['src/api/endpoints.ts', 'src/api/config.ts', 'src/api/httpClient.ts']) {
    const content = fs.readFileSync(path.join(root, file), 'utf8');
    if (/https?:\/\/[^\s'"]*securepay\.ke/i.test(content)) {
      throw new Error(`Production URL must not be hardcoded in ${file}`);
    }
  }

  const secureLinksScreen = fs.readFileSync(path.join(root, 'app/(tabs)/securelinks.tsx'), 'utf8');
  if (!secureLinksScreen.includes('ApiStatePanel')) {
    throw new Error('SecureLinks screen must handle loading/error/empty states');
  }

  const paymentReadyScreen = fs.readFileSync(path.join(root, 'app/readiness/payment-ready.tsx'), 'utf8');
  if (!paymentReadyScreen.includes('not payout')) {
    throw new Error('Payment Ready screen must not show payout-ready language');
  }

  const stagingApi = path.join(root, 'src/api/stagingSecurepayApi.ts');
  if (!fs.existsSync(stagingApi)) {
    throw new Error('stagingSecurepayApi.ts is required for Phase 3+');
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
    if (
      regex.test(content) &&
      !file.includes('uiTextGuard') &&
      !file.includes('securepayDoctrine') &&
      !file.includes('mobileActionGuards') &&
      !file.includes('endpoints.ts') &&
      !file.includes('sessionStorage.ts') &&
      !file.includes('authApi.ts') &&
      !file.includes('contractSelfCheck.ts')
    ) {
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
  readApiSafetyFiles();
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

console.log('Mobile UI and API safety checks passed.');
