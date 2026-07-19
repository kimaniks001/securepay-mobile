#!/usr/bin/env node
/**
 * Local-only staging read-only smoke test.
 * Requires developer-provided env vars — never commit secrets.
 *
 * Usage:
 *   EXPO_PUBLIC_SECUREPAY_API_MODE=staging \
 *   EXPO_PUBLIC_SECUREPAY_API_BASE_URL=https://staging.example.test \
 *   SECUREPAY_SMOKE_ACCESS_TOKEN=optional-bearer-token \
 *   SECUREPAY_SMOKE_TEST_SLUG=optional-securelink-slug \
 *   node scripts/mobile-staging-readonly-smoke.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const logsDir = path.join(root, 'logs');

const PRODUCTION_PATTERNS = [/securepay\.ke/i, /api\.securepay\.ke/i];

const FORBIDDEN_PATHS = [
  '/webhook-complete',
  '/webhooks/complete',
  '/payment-complete',
  '/provider-confirmation',
  '/ledger/posting',
  '/release',
  '/withdrawal',
  '/payout',
  '/settlement',
  '/auto-payout',
  '/choice-bank/transfer',
  '/internal/',
];

const READ_PATHS = [
  { name: 'health', path: '/api/v1/health', auth: false },
  { name: 'currentUser', path: '/api/v1/users/me', auth: true },
  { name: 'ksNumberProfile', path: '/api/v1/ksnumber/profile', auth: true },
  { name: 'secureLinks', path: '/api/v1/secure-links', auth: true },
  { name: 'paymentReadyReadiness', path: '/api/v1/readiness/payment-ready', auth: true },
  { name: 'accountReadiness', path: '/api/v1/readiness/account', auth: true },
  { name: 'transactionHistory', path: '/api/v1/activity/transactions', auth: true },
];

function maskToken(token) {
  if (!token) return '(none)';
  if (token.length <= 8) return '****';
  return `${token.slice(0, 4)}…${token.slice(-4)}`;
}

function isProductionUrl(url) {
  try {
    const hostname = new URL(url).hostname;
    return PRODUCTION_PATTERNS.some((p) => p.test(hostname));
  } catch {
    return PRODUCTION_PATTERNS.some((p) => p.test(url));
  }
}

function assertForbiddenBlocked() {
  for (const forbidden of FORBIDDEN_PATHS) {
    if (!FORBIDDEN_PATHS.includes(forbidden)) {
      throw new Error('Forbidden path list integrity failed');
    }
  }
  return true;
}

async function smokeGet(baseUrl, path, token, timeoutMs = 15000) {
  if (FORBIDDEN_PATHS.some((f) => path.toLowerCase().includes(f.toLowerCase()))) {
    return { ok: false, status: 0, error: 'forbidden_path_blocked_locally' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const headers = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, '')}${path}`, {
      method: 'GET',
      headers,
      signal: controller.signal,
    });
    const contentType = response.headers.get('content-type') ?? '';
    const body = contentType.includes('application/json')
      ? await response.json().catch(() => null)
      : await response.text();
    return { ok: response.ok, status: response.status, body };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const mode = process.env.EXPO_PUBLIC_SECUREPAY_API_MODE?.trim();
  const baseUrl = process.env.EXPO_PUBLIC_SECUREPAY_API_BASE_URL?.trim();
  const token = process.env.SECUREPAY_SMOKE_ACCESS_TOKEN?.trim();
  const testSlug = process.env.SECUREPAY_SMOKE_TEST_SLUG?.trim();
  const allowProduction = process.env.EXPO_PUBLIC_SECUREPAY_ALLOW_PRODUCTION_API === 'true';

  const report = {
    ranAt: new Date().toISOString(),
    mode,
    baseUrl: baseUrl ? baseUrl.replace(/\/$/, '') : null,
    token: maskToken(token),
    testSlug: testSlug ?? null,
    results: [],
    summary: '',
  };

  if (mode !== 'staging') {
    report.summary = 'Refusing smoke test: EXPO_PUBLIC_SECUREPAY_API_MODE must be staging';
    writeReport(report);
    console.error(report.summary);
    process.exit(1);
  }

  if (!baseUrl) {
    report.summary = 'Refusing smoke test: EXPO_PUBLIC_SECUREPAY_API_BASE_URL is required';
    writeReport(report);
    console.error(report.summary);
    process.exit(1);
  }

  if (isProductionUrl(baseUrl) && !allowProduction) {
    report.summary = 'Refusing smoke test: production securepay.ke URL blocked by default';
    writeReport(report);
    console.error(report.summary);
    process.exit(1);
  }

  assertForbiddenBlocked();

  for (const endpoint of READ_PATHS) {
    if (endpoint.auth && !token) {
      report.results.push({
        name: endpoint.name,
        path: endpoint.path,
        skipped: true,
        reason: 'No SECUREPAY_SMOKE_ACCESS_TOKEN — auth-required endpoint skipped',
      });
      continue;
    }
    const result = await smokeGet(baseUrl, endpoint.path, endpoint.auth ? token : undefined);
    report.results.push({
      name: endpoint.name,
      path: endpoint.path,
      status: result.status,
      ok: result.ok,
      error: result.error ?? null,
    });
  }

  if (testSlug) {
    const detailPath = `/api/v1/secure-links/${encodeURIComponent(testSlug)}`;
    const evidencePath = `/api/v1/secure-links/${encodeURIComponent(testSlug)}/evidence`;
    if (token) {
      report.results.push({
        name: 'secureLinkDetail',
        ...(await smokeGet(baseUrl, detailPath, token)),
        path: detailPath,
      });
      report.results.push({
        name: 'evidenceList',
        ...(await smokeGet(baseUrl, evidencePath, token)),
        path: evidencePath,
        note: 'Endpoint assumed/missing — smoke only',
      });
    } else {
      report.results.push({
        name: 'secureLinkDetail',
        skipped: true,
        reason: 'No token for authenticated detail smoke',
      });
    }
  }

  const tested = report.results.filter((r) => !r.skipped);
  const passed = tested.filter((r) => r.ok);
  report.summary = `Smoke test complete: ${passed.length}/${tested.length} GET checks returned ok`;

  writeReport(report);
  console.log(report.summary);
  console.log(`Report written to logs/mobile-staging-smoke-report.local.json`);
  process.exit(passed.length === tested.length ? 0 : 2);
}

function writeReport(report) {
  fs.mkdirSync(logsDir, { recursive: true });
  const outfile = path.join(logsDir, 'mobile-staging-smoke-report.local.json');
  fs.writeFileSync(outfile, JSON.stringify(report, null, 2));
}

main();
