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
  SettlementReadinessStatus,
} from './types';
import { feeDoctrine } from '../doctrine/securepayDoctrine';

type UnknownRecord = Record<string, unknown>;

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
  const record = asRecord(raw) ?? {};
  const status = mapMoneyState(record.status ?? record.state);
  const reviewHoldActive = mapReviewHold(record.review_hold ?? record.reviewHold) === 'active';
  const settlement = mapSettlementReadiness(record.settlement_readiness ?? record.settlementReadiness);
  const providerConfirmed = status === 'provider_confirmed';
  const readyForStagingReviewOnly =
    status === 'ready_for_staging_review' ||
    asBoolean(record.ready_for_staging_review_only ?? record.readyForStagingReviewOnly);

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
              record.summary,
              'Payment Ready readiness is pending backend checks. Not payout-ready.',
            ),
    isReady: false,
    readyForStagingReviewOnly,
    updatedAt: asString(record.updated_at ?? record.updatedAt, new Date().toISOString()),
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
  const record = asRecord(raw) ?? {};
  const kindRaw = asString(record.kind ?? record.type, 'securelink').toLowerCase();
  const kind: SecureLinkKind =
    kindRaw.includes('group') ? 'group_securelink' : 'securelink';
  const groupTier = mapGroupTier(record.group_tier ?? record.groupTier);
  const moneyState = mapMoneyState(record.money_state ?? record.moneyState ?? record.status);
  const reviewHold = mapReviewHold(record.review_hold ?? record.reviewHold);

  return {
    id: asString(record.id ?? record.slug, 'unknown'),
    slug: asString(record.slug, asString(record.id, 'unknown')),
    title: asString(record.title ?? record.name, 'SecureLink'),
    kind,
    groupTier,
    agreementControlledAmount: asNumber(
      record.agreement_controlled_amount ?? record.agreementControlledAmount ?? record.amount,
    ),
    currency: 'KES',
    moneyState: reviewHold === 'active' ? 'review_hold' : moneyState,
    moneyStateLabel: asString(
      record.money_state_label ?? record.moneyStateLabel,
      MONEY_STATE_LABELS[reviewHold === 'active' ? 'review_hold' : moneyState],
    ),
    feeKes: asNumber(record.fee_kes ?? record.feeKes, feeForTier(groupTier) ?? 0) || feeForTier(groupTier),
    reviewHold,
    updatedAt: asString(record.updated_at ?? record.updatedAt, new Date().toISOString()),
  };
}

export function mapSecureLinkDetail(raw: unknown): SecureLinkDetail {
  const summary = mapSecureLinkSummary(raw);
  const record = asRecord(raw) ?? {};
  const settlementReadiness = mapSettlementReadiness(
    record.settlement_readiness ?? record.settlementReadiness,
  );

  const releaseRaw = record.release_conditions ?? record.releaseConditions;
  const releaseConditions = Array.isArray(releaseRaw)
    ? releaseRaw.map((item: unknown) => asString(item))
    : [];

  return {
    ...summary,
    description: asString(record.description, ''),
    releaseConditions,
    providerConfirmedAt:
      asString(record.provider_confirmed_at ?? record.providerConfirmedAt) || undefined,
    settlementReadiness,
    paymentReadyReadiness: mapPaymentReadyReadiness(
      record.payment_ready_readiness ?? record.paymentReadyReadiness ?? record,
    ),
    isDemo: false,
  };
}

export function mapGroupSecureLinkDetail(raw: unknown): GroupSecureLinkDetail {
  const detail = mapSecureLinkDetail(raw);
  const record = asRecord(raw) ?? {};
  const groupTier = mapGroupTier(record.group_tier ?? record.groupTier) ?? 'general';
  const contribution = asRecord(record.contribution_summary ?? record.contributionSummary) ?? {};
  const feePerContribution =
    asNumber(
      contribution.fee_per_contribution_kes ?? contribution.feePerContributionKes,
      feeForTier(groupTier) ?? 20,
    ) || (feeForTier(groupTier) ?? 20);

  const contributionSummary: ContributionSummary = {
    expectedContributions: asNumber(
      contribution.expected_contributions ?? contribution.expectedContributions,
    ),
    recordedContributions: asNumber(
      contribution.recorded_contributions ?? contribution.recordedContributions,
    ),
    feePerContributionKes: feePerContribution,
    currency: 'KES',
  };

  return {
    ...detail,
    kind: 'group_securelink',
    groupTier,
    memberCount: asNumber(record.member_count ?? record.memberCount),
    feeKes: feePerContribution,
    contributionSummary,
  };
}

export function mapTransaction(raw: unknown): SecurePayTransaction {
  const record = asRecord(raw) ?? {};
  const moneyState = mapMoneyState(record.money_state ?? record.moneyState ?? record.status);
  const activityLabel = mapActivityLabel(record.activity_label ?? record.activityLabel ?? record.type);

  return {
    id: asString(record.id, `txn_${Date.now()}`),
    secureLinkSlug: asString(record.secure_link_slug ?? record.secureLinkSlug) || undefined,
    title: asString(record.title ?? record.description, 'SecureLink activity'),
    agreementControlledAmount: asNumber(
      record.agreement_controlled_amount ?? record.agreementControlledAmount ?? record.amount,
    ),
    currency: 'KES',
    activityLabel,
    activityDisplay: asString(
      record.activity_display ?? record.activityDisplay,
      MONEY_STATE_LABELS[moneyState],
    ),
    moneyState,
    createdAt: asString(record.created_at ?? record.createdAt, new Date().toISOString()),
    note: asString(record.note) || undefined,
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
