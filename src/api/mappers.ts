import type {
  AccountReadiness,
  ActivityLabel,
  ApiUser,
  ContributionSummary,
  GroupSecureLinkDetail,
  GroupSecureLinkTier,
  KSNumberProfile,
  MoneyStateLabel,
  PaymentReadyReadiness,
  ReviewHoldStatus,
  SecureLinkDetail,
  SecureLinkKind,
  SecureLinkSummary,
  SecurePayTransaction,
  SecureLinkEvidenceItem,
  SecureLinkEvidenceList,
  SettlementReadinessStatus,
} from './types';
import { feeDoctrine } from '../doctrine/securepayDoctrine';

type UnknownRecord = Record<string, unknown>;

/** Pick first defined field using snake_case and camelCase aliases. */
export function pickField(record: UnknownRecord, ...keys: string[]): unknown {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null) {
      return record[key];
    }
  }
  return undefined;
}

/** Normalize backend record — unwrap nested collection_* wrappers when present. */
export function normalizeDtoRecord(raw: unknown): UnknownRecord {
  const record = asRecord(raw) ?? {};
  const nested =
    pickField(record, 'data', 'item', 'result', 'payload') ??
    record;
  const base = asRecord(nested) ?? record;
  return base;
}

/** Parse KES amount from major units or minor units (cents). */
export function parseAgreementAmount(record: UnknownRecord): number {
  const major = pickField(
    record,
    'agreement_controlled_amount',
    'agreementControlledAmount',
    'amount',
  );
  if (typeof major === 'number' && Number.isFinite(major)) return major;

  const minor = pickField(record, 'amount_minor', 'amountMinor', 'agreement_amount_minor');
  if (typeof minor === 'number' && Number.isFinite(minor)) {
    return minor / 100;
  }
  return 0;
}

export function resolvePaymentReadyReadinessSource(record: UnknownRecord): unknown {
  return (
    pickField(
      record,
      'payment_ready_readiness',
      'paymentReadyReadiness',
      'collection_payment_ready_readiness',
      'collectionPaymentReadyReadiness',
    ) ?? record
  );
}

export function resolveContributionSummarySource(record: UnknownRecord): UnknownRecord {
  const raw =
    pickField(
      record,
      'contribution_summary',
      'contributionSummary',
      'collection_contribution_summary',
      'collectionContributionSummary',
    ) ?? {};
  return asRecord(raw) ?? {};
}

function asRecord(value: unknown): UnknownRecord | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as UnknownRecord;
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

const MONEY_STATE_MAP: Record<string, MoneyStateLabel> = {
  draft: 'draft',
  awaiting_payment: 'awaiting_payment',
  provider_confirmed: 'provider_confirmed',
  review_hold: 'review_hold',
  payment_ready_readiness: 'payment_ready_readiness',
  settlement_readiness_pending: 'settlement_readiness_pending',
  agreement_controlled: 'agreement_controlled',
  not_ready: 'not_ready',
  ready_for_staging_review: 'ready_for_staging_review',
  pending: 'awaiting_payment',
  initiated: 'awaiting_payment',
  failed: 'not_ready',
  reversed: 'not_ready',
  paid: 'provider_confirmed',
  collected: 'provider_confirmed',
  unknown: 'not_ready',
};

const SETTLEMENT_MAP: Record<string, SettlementReadinessStatus> = {
  not_ready: 'not_ready',
  settlement_readiness_pending: 'settlement_readiness_pending',
  ready_for_staging_review: 'ready_for_staging_review',
  pending: 'settlement_readiness_pending',
  unknown: 'not_ready',
};

const REVIEW_HOLD_MAP: Record<string, ReviewHoldStatus> = {
  none: 'none',
  active: 'active',
  cleared_pending_backend: 'cleared_pending_backend',
  hold: 'active',
  unknown: 'none',
};

const ACTIVITY_MAP: Record<string, ActivityLabel> = {
  securelink_created: 'securelink_created',
  payment_initiated: 'payment_initiated',
  provider_confirmation_pending: 'provider_confirmation_pending',
  provider_confirmed: 'provider_confirmed',
  review_hold: 'review_hold',
  ledger_readiness_pending: 'ledger_readiness_pending',
  pending: 'provider_confirmation_pending',
  initiated: 'payment_initiated',
  failed: 'provider_confirmation_pending',
  reversed: 'review_hold',
};

const MONEY_STATE_LABELS: Record<MoneyStateLabel, string> = {
  draft: 'Draft — not submitted for provider confirmation',
  awaiting_payment: 'Awaiting payment initiation on backend',
  provider_confirmed: 'Provider-confirmed',
  review_hold: 'Review hold',
  payment_ready_readiness: 'Payment Ready readiness',
  settlement_readiness_pending: 'Settlement readiness pending',
  agreement_controlled: 'Agreement-controlled amount',
  not_ready: 'Not ready',
  ready_for_staging_review: 'Ready for staging review only',
};

function mapMoneyState(raw: unknown): MoneyStateLabel {
  const key = asString(raw, 'unknown').toLowerCase();
  return MONEY_STATE_MAP[key] ?? 'not_ready';
}

function mapSettlementReadiness(raw: unknown): SettlementReadinessStatus {
  const key = asString(raw, 'unknown').toLowerCase();
  return SETTLEMENT_MAP[key] ?? 'not_ready';
}

function mapReviewHold(raw: unknown): ReviewHoldStatus {
  const key = asString(raw, 'unknown').toLowerCase();
  return REVIEW_HOLD_MAP[key] ?? 'none';
}

function mapActivityLabel(raw: unknown): ActivityLabel {
  const key = asString(raw, 'provider_confirmation_pending').toLowerCase();
  return ACTIVITY_MAP[key] ?? 'provider_confirmation_pending';
}

function mapGroupTier(raw: unknown): GroupSecureLinkTier | undefined {
  const key = asString(raw).toLowerCase();
  if (key === 'welfare') return 'welfare';
  if (key === 'general') return 'general';
  if (key === 'business_solution' || key === 'business') return 'business_solution';
  return undefined;
}

function feeForTier(tier?: GroupSecureLinkTier): number | undefined {
  if (!tier) return undefined;
  if (tier === 'welfare') return feeDoctrine.welfareGroupSecureLink.feeKes;
  return feeDoctrine.generalGroupSecureLink.feeKes;
}

function mapPaymentReadyReadiness(raw: unknown): PaymentReadyReadiness {
  const record = normalizeDtoRecord(raw);
  if (!record || Object.keys(record).length === 0) {
    return {
      status: 'not_ready',
      label: 'Payment Ready readiness',
      summary: 'Payment Ready readiness is not available from backend yet. Not payout-ready.',
      isReady: false,
      readyForStagingReviewOnly: false,
      updatedAt: new Date().toISOString(),
    };
  }

  const status = mapMoneyState(pickField(record, 'status', 'state'));
  const reviewHoldActive = mapReviewHold(pickField(record, 'review_hold', 'reviewHold')) === 'active';
  const settlement = mapSettlementReadiness(
    pickField(record, 'settlement_readiness', 'settlementReadiness'),
  );
  const providerConfirmed = status === 'provider_confirmed';
  const readyForStagingReviewOnly =
    status === 'ready_for_staging_review' ||
    asBoolean(pickField(record, 'ready_for_staging_review_only', 'readyForStagingReviewOnly'));

  const blockedByReviewHold = reviewHoldActive;
  const blockedBySettlement = settlement === 'not_ready';

  return {
    status: blockedByReviewHold ? 'review_hold' : status,
    label: 'Payment Ready readiness',
    summary: blockedByReviewHold
      ? 'Review hold is active. Payment Ready readiness is blocked until backend review clears.'
      : blockedBySettlement
        ? 'Settlement readiness is not ready. Payment Ready readiness remains pending on backend.'
        : providerConfirmed
          ? 'Provider-confirmed on backend. Payment Ready readiness is informational only — not payout.'
          : asString(
              pickField(record, 'summary'),
              'Payment Ready readiness is pending backend checks. Not payout-ready.',
            ),
    isReady: false,
    readyForStagingReviewOnly,
    updatedAt: asString(pickField(record, 'updated_at', 'updatedAt'), new Date().toISOString()),
  };
}

export function mapPaymentReadyReadinessDto(raw: unknown): PaymentReadyReadiness {
  return mapPaymentReadyReadiness(raw);
}

export function mapApiUser(raw: unknown): ApiUser {
  const record = asRecord(raw) ?? {};
  return {
    id: asString(record.id ?? record.user_id, 'unknown_user'),
    name: asString(record.name ?? record.display_name ?? record.displayName, 'SecurePay user'),
    email: asString(record.email, 'unknown@securepay.app'),
    phone: asString(record.phone ?? record.phone_number) || undefined,
    ksNumber: asString(record.ks_number ?? record.ksNumber, 'KS-PENDING'),
  };
}

export function mapKSNumberProfile(raw: unknown): KSNumberProfile {
  const record = asRecord(raw) ?? {};
  const accountReadiness = mapAccountReadiness(record.account_readiness ?? record.accountReadiness ?? record);
  return {
    ksNumber: asString(record.ks_number ?? record.ksNumber, 'KS-PENDING'),
    displayName: asString(record.display_name ?? record.displayName ?? record.name, 'SecurePay user'),
    email: asString(record.email, 'unknown@securepay.app'),
    phone: asString(record.phone ?? record.phone_number) || undefined,
    accountReadiness,
    isDemo: false,
  };
}

export function mapAccountReadiness(raw: unknown): AccountReadiness {
  const record = asRecord(raw) ?? {};
  const settlementReadiness = mapSettlementReadiness(
    record.settlement_readiness ?? record.settlementReadiness,
  );
  const status = mapMoneyState(record.status ?? record.state);
  const paymentReadyReadiness = mapPaymentReadyReadiness(
    record.payment_ready_readiness ?? record.paymentReadyReadiness ?? record,
  );

  return {
    status,
    label: asString(record.label, 'Account readiness'),
    summary: asString(
      record.summary,
      'Account readiness is controlled by SecurePay backend. Mobile shows read-only status.',
    ),
    settlementReadiness,
    paymentReadyReadiness,
    updatedAt: asString(record.updated_at ?? record.updatedAt, new Date().toISOString()),
  };
}

export function mapSecureLinkSummary(raw: unknown): SecureLinkSummary {
  const record = normalizeDtoRecord(raw);
  const kindRaw = asString(pickField(record, 'kind', 'type'), 'securelink').toLowerCase();
  const kind: SecureLinkKind =
    kindRaw.includes('group') ? 'group_securelink' : 'securelink';
  const groupTier = mapGroupTier(pickField(record, 'group_tier', 'groupTier'));
  const moneyState = mapMoneyState(
    pickField(record, 'money_state', 'moneyState', 'status'),
  );
  const reviewHold = mapReviewHold(pickField(record, 'review_hold', 'reviewHold'));

  return {
    id: asString(pickField(record, 'id', 'slug'), 'unknown'),
    slug: asString(pickField(record, 'slug', 'id'), 'unknown'),
    title: asString(pickField(record, 'title', 'name'), 'SecureLink'),
    kind,
    groupTier,
    agreementControlledAmount: parseAgreementAmount(record),
    currency: 'KES',
    moneyState: reviewHold === 'active' ? 'review_hold' : moneyState,
    moneyStateLabel: asString(
      pickField(record, 'money_state_label', 'moneyStateLabel'),
      MONEY_STATE_LABELS[reviewHold === 'active' ? 'review_hold' : moneyState],
    ),
    feeKes: asNumber(pickField(record, 'fee_kes', 'feeKes'), feeForTier(groupTier) ?? 0) || feeForTier(groupTier),
    reviewHold,
    updatedAt: asString(pickField(record, 'updated_at', 'updatedAt'), new Date().toISOString()),
  };
}

export function mapSecureLinkDetail(raw: unknown): SecureLinkDetail {
  const record = normalizeDtoRecord(raw);
  const summary = mapSecureLinkSummary(record);
  const settlementReadiness = mapSettlementReadiness(
    pickField(record, 'settlement_readiness', 'settlementReadiness'),
  );

  const releaseRaw = pickField(record, 'release_conditions', 'releaseConditions');
  const releaseConditions = Array.isArray(releaseRaw)
    ? releaseRaw.map((item: unknown) => asString(item))
    : [];

  return {
    ...summary,
    description: asString(pickField(record, 'description'), ''),
    releaseConditions,
    providerConfirmedAt:
      asString(pickField(record, 'provider_confirmed_at', 'providerConfirmedAt')) || undefined,
    settlementReadiness,
    paymentReadyReadiness: mapPaymentReadyReadiness(
      resolvePaymentReadyReadinessSource(record),
    ),
    isDemo: false,
  };
}

export function mapGroupSecureLinkDetail(raw: unknown): GroupSecureLinkDetail {
  const record = normalizeDtoRecord(raw);
  const detail = mapSecureLinkDetail(record);
  const groupTier = mapGroupTier(pickField(record, 'group_tier', 'groupTier')) ?? 'general';
  const contribution = resolveContributionSummarySource(record);
  const feePerContribution =
    asNumber(
      pickField(contribution, 'fee_per_contribution_kes', 'feePerContributionKes'),
      feeForTier(groupTier) ?? 20,
    ) || (feeForTier(groupTier) ?? 20);

  const contributionSummary: ContributionSummary = {
    expectedContributions: asNumber(
      pickField(contribution, 'expected_contributions', 'expectedContributions'),
    ),
    recordedContributions: asNumber(
      pickField(contribution, 'recorded_contributions', 'recordedContributions'),
    ),
    feePerContributionKes: feePerContribution,
    currency: 'KES',
  };

  return {
    ...detail,
    kind: 'group_securelink',
    groupTier,
    memberCount: asNumber(pickField(record, 'member_count', 'memberCount')),
    feeKes: feePerContribution,
    contributionSummary,
  };
}

export function mapTransaction(raw: unknown): SecurePayTransaction {
  const record = normalizeDtoRecord(raw);
  const moneyState = mapMoneyState(pickField(record, 'money_state', 'moneyState', 'status'));
  const activityLabel = mapActivityLabel(
    pickField(record, 'activity_label', 'activityLabel', 'type'),
  );

  return {
    id: asString(pickField(record, 'id'), `txn_${Date.now()}`),
    secureLinkSlug: asString(pickField(record, 'secure_link_slug', 'secureLinkSlug')) || undefined,
    title: asString(pickField(record, 'title', 'description'), 'SecureLink activity'),
    agreementControlledAmount: parseAgreementAmount(record),
    currency: 'KES',
    activityLabel,
    activityDisplay: asString(
      pickField(record, 'activity_display', 'activityDisplay'),
      MONEY_STATE_LABELS[moneyState],
    ),
    moneyState,
    createdAt: asString(pickField(record, 'created_at', 'createdAt'), new Date().toISOString()),
    note: asString(pickField(record, 'note')) || undefined,
  };
}

export function mapSecureLinkList(raw: unknown): SecureLinkSummary[] {
  if (Array.isArray(raw)) {
    return raw.map(mapSecureLinkSummary);
  }
  const record = asRecord(raw);
  const items = record?.items ?? record?.data ?? record?.secure_links ?? record?.secureLinks;
  if (Array.isArray(items)) {
    return items.map(mapSecureLinkSummary);
  }
  return [];
}

export function mapTransactionHistory(raw: unknown): SecurePayTransaction[] {
  if (Array.isArray(raw)) {
    return raw.map(mapTransaction);
  }
  const record = asRecord(raw);
  const items = record?.items ?? record?.data ?? record?.transactions;
  if (Array.isArray(items)) {
    return items.map(mapTransaction);
  }
  return [];
}

export function mapEvidenceItem(raw: unknown): SecureLinkEvidenceItem {
  const record = normalizeDtoRecord(raw);
  return {
    id: asString(pickField(record, 'id'), `ev_${Date.now()}`),
    label: asString(pickField(record, 'label', 'title', 'name'), 'Evidence item'),
    kind: asString(pickField(record, 'kind', 'type'), 'document'),
    status: asString(pickField(record, 'status', 'state'), 'unknown'),
    submittedAt: asString(pickField(record, 'submitted_at', 'submittedAt')) || undefined,
    note: asString(pickField(record, 'note', 'description')) || undefined,
  };
}

export function mapEvidenceList(raw: unknown, secureLinkSlug?: string): SecureLinkEvidenceList {
  if (Array.isArray(raw)) {
    return { items: raw.map(mapEvidenceItem), secureLinkSlug };
  }
  const record = asRecord(raw);
  const items = record?.items ?? record?.data ?? record?.evidence;
  if (Array.isArray(items)) {
    return { items: items.map(mapEvidenceItem), secureLinkSlug };
  }
  return { items: [], secureLinkSlug };
}
