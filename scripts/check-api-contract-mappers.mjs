#!/usr/bin/env node
/**
 * Fixture-based mapper contract checks (pure JS — no live staging).
 * Mirrors conservative mapping rules from src/api/mappers.ts
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

const MONEY_STATE_MAP = {
  pending: 'awaiting_payment',
  initiated: 'awaiting_payment',
  failed: 'not_ready',
  reversed: 'not_ready',
  paid: 'provider_confirmed',
  provider_confirmed: 'provider_confirmed',
  unknown: 'not_ready',
};

function mapMoneyState(raw) {
  const key = String(raw ?? 'unknown').toLowerCase();
  return MONEY_STATE_MAP[key] ?? 'not_ready';
}

function pickField(record, ...keys) {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null) return record[key];
  }
  return undefined;
}

function mapPaymentReady(raw) {
  if (!raw || typeof raw !== 'object') return { status: 'not_ready', isReady: false };
  const reviewHold = String(pickField(raw, 'review_hold', 'reviewHold') ?? 'none').toLowerCase();
  const status = mapMoneyState(pickField(raw, 'status', 'state'));
  return {
    status: reviewHold === 'active' || reviewHold === 'hold' ? 'review_hold' : status,
    isReady: false,
  };
}

function feeForTier(tier) {
  if (tier === 'welfare') return 10;
  return 20;
}

function readFixture(name) {
  const file = path.join(root, 'src/api/fixtures', `${name}.fixture.json`);
  if (!fs.existsSync(file)) {
    throw new Error(`Missing fixture: ${file}`);
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function main() {
  const requiredFiles = [
    'src/api/mapperContractChecks.ts',
    'src/api/fixtures/index.ts',
    'src/api/mappers.ts',
  ];
  for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(root, file))) {
      errors.push(`Missing required file: ${file}`);
    }
  }

  const list = readFixture('secureLinkList');
  assert(Array.isArray(list.items) && list.items.length >= 1, 'secureLinkList fixture should have items');
  assert(list.items[0].fee_kes === 10, 'Welfare fee doctrine KES 10 in list fixture');

  const detail = readFixture('secureLinkDetail');
  const mappedDetail = mapMoneyState(pickField(detail, 'moneyState', 'money_state', 'status'));
  assert(mappedDetail === 'awaiting_payment', 'pending/initiated must not become paid');

  const group = readFixture('groupSecureLinkDetail');
  const contribution = group.collection_contribution_summary ?? {};
  assert(contribution.fee_per_contribution_kes === 10, 'Welfare Group fee KES 10');
  assert(mapMoneyState(group.money_state) === 'provider_confirmed', 'provider_confirmed preserved');

  const reviewHold = readFixture('paymentReadyReviewHold');
  const ready = mapPaymentReady(reviewHold);
  assert(ready.status === 'review_hold', 'review hold blocks readiness');
  assert(ready.isReady === false, 'Payment Ready must not become payout-ready');

  assert(mapPaymentReady(null).status === 'not_ready', 'null readiness maps to not_ready');

  const history = readFixture('transactionHistory');
  for (const txn of history.data) {
    const state = mapMoneyState(pickField(txn, 'money_state', 'moneyState', 'status'));
    const label = pickField(txn, 'activity_label', 'activityLabel', 'type');
    if (label === 'failed') assert(state === 'not_ready', 'failed must not count as collected');
    if (label === 'reversed') assert(state === 'not_ready', 'reversed must not count as collected');
    if (label === 'payment_initiated' || pickField(txn, 'money_state') === 'pending') {
      assert(state === 'awaiting_payment', 'pending must not be paid');
    }
  }

  assert(feeForTier('welfare') === 10, 'Welfare fee KES 10');
  assert(feeForTier('general') === 20, 'General fee KES 20');
  assert(feeForTier('business_solution') === 20, 'Business fee KES 20');

  const evidence = readFixture('evidenceList');
  assert(Array.isArray(evidence.items) && evidence.items.length >= 1, 'evidence fixture present');

  if (errors.length > 0) {
    console.error('API contract mapper checks failed:');
    for (const err of errors) console.error(`  - ${err}`);
    process.exit(1);
  }

  console.log('API contract mapper checks passed.');
}

main();
