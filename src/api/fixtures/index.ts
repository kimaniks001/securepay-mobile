import type { AccountReadiness, PaymentReadyReadiness, SecureLinkDetail, SecureLinkSummary, SecurePayTransaction } from '../types';

/** Assumed backend list response (snake_case). */
export const secureLinkListFixture = {
  items: [
    {
      id: 'sl_fixture_001',
      slug: 'fixture-welfare-group',
      title: 'Fixture Welfare Group',
      kind: 'group_securelink',
      group_tier: 'welfare',
      agreement_controlled_amount: 5000,
      money_state: 'awaiting_payment',
      money_state_label: 'Awaiting payment initiation on backend',
      fee_kes: 10,
      review_hold: 'none',
      updated_at: '2026-07-19T10:00:00.000Z',
    },
    {
      id: 'sl_fixture_002',
      slug: 'fixture-provider-pending',
      title: 'Fixture Provider Pending',
      kind: 'securelink',
      agreement_controlled_amount: 12000,
      money_state: 'pending',
      review_hold: 'none',
      updated_at: '2026-07-19T11:00:00.000Z',
    },
  ],
} as const;

/** Assumed SecureLink detail (camelCase variant). */
export const secureLinkDetailFixture = {
  id: 'sl_fixture_002',
  slug: 'fixture-provider-pending',
  title: 'Fixture Provider Pending',
  kind: 'securelink',
  agreementControlledAmount: 12000,
  moneyState: 'initiated',
  moneyStateLabel: 'Provider confirmation pending',
  reviewHold: 'none',
  description: 'Fixture agreement description',
  releaseConditions: ['Agreement terms recorded on backend'],
  settlementReadiness: 'not_ready',
  paymentReadyReadiness: {
    status: 'not_ready',
    summary: 'Payment Ready readiness is pending backend checks. Not payout-ready.',
    readyForStagingReviewOnly: false,
    updatedAt: '2026-07-19T11:00:00.000Z',
  },
  updatedAt: '2026-07-19T11:00:00.000Z',
} as const;

/** Assumed Group SecureLink with collection_contribution_summary (snake_case). */
export const groupSecureLinkDetailFixture = {
  slug: 'fixture-welfare-group',
  title: 'Fixture Welfare Group',
  kind: 'group_securelink',
  group_tier: 'welfare',
  agreement_controlled_amount: 5000,
  money_state: 'provider_confirmed',
  member_count: 8,
  collection_contribution_summary: {
    expected_contributions: 8,
    recorded_contributions: 3,
    fee_per_contribution_kes: 10,
  },
  collection_payment_ready_readiness: {
    status: 'ready_for_staging_review',
    summary: 'Ready for staging review only. Not payout.',
    ready_for_staging_review_only: true,
    review_hold: 'none',
    settlement_readiness: 'settlement_readiness_pending',
  },
  settlement_readiness: 'settlement_readiness_pending',
  review_hold: 'none',
  updated_at: '2026-07-19T10:00:00.000Z',
} as const;

export const paymentReadyReadinessFixture = {
  status: 'ready_for_staging_review',
  summary: 'Ready for staging review only. Not payout-ready.',
  ready_for_staging_review_only: true,
  review_hold: 'none',
  settlement_readiness: 'settlement_readiness_pending',
  updated_at: '2026-07-19T10:00:00.000Z',
} as const;

export const paymentReadyReviewHoldFixture = {
  status: 'payment_ready_readiness',
  review_hold: 'active',
  settlement_readiness: 'ready_for_staging_review',
  summary: 'Should be blocked by review hold',
} as const;

export const accountReadinessFixture = {
  status: 'not_ready',
  label: 'Account readiness',
  summary: 'Agreement details pending on backend.',
  settlement_readiness: 'not_ready',
  payment_ready_readiness: paymentReadyReadinessFixture,
  updated_at: '2026-07-19T10:00:00.000Z',
} as const;

export const transactionHistoryFixture = {
  data: [
    {
      id: 'txn_fixture_001',
      title: 'Fixture payment initiated',
      agreement_controlled_amount: 12000,
      activity_label: 'payment_initiated',
      money_state: 'pending',
      created_at: '2026-07-19T09:00:00.000Z',
    },
    {
      id: 'txn_fixture_002',
      title: 'Fixture failed attempt',
      agreement_controlled_amount: 500,
      activity_label: 'failed',
      money_state: 'failed',
      created_at: '2026-07-19T08:00:00.000Z',
    },
    {
      id: 'txn_fixture_003',
      title: 'Fixture reversed',
      agreementControlledAmount: 1000,
      activityLabel: 'reversed',
      moneyState: 'reversed',
      createdAt: '2026-07-19T07:00:00.000Z',
    },
  ],
} as const;

/** Assumed evidence list — endpoint not confirmed; fixture for mapper tests only. */
export const evidenceListFixture = {
  items: [
    {
      id: 'ev_fixture_001',
      label: 'Agreement document',
      kind: 'document',
      status: 'submitted',
      submitted_at: '2026-07-19T08:00:00.000Z',
    },
  ],
} as const;

export type EvidenceItem = {
  id: string;
  label: string;
  kind: string;
  status: string;
  submittedAt?: string;
  note?: string;
};

export const fixtureCatalog = {
  secureLinkListFixture,
  secureLinkDetailFixture,
  groupSecureLinkDetailFixture,
  paymentReadyReadinessFixture,
  accountReadinessFixture,
  transactionHistoryFixture,
  evidenceListFixture,
} as const;
