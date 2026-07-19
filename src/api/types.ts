export type MoneyStateLabel =
  | 'draft'
  | 'awaiting_payment'
  | 'provider_confirmed'
  | 'review_hold'
  | 'payment_ready_readiness'
  | 'settlement_readiness_pending'
  | 'agreement_controlled'
  | 'not_ready'
  | 'ready_for_staging_review';

export type ReviewHoldStatus = 'none' | 'active' | 'cleared_pending_backend';

export type SettlementReadinessStatus =
  | 'not_ready'
  | 'settlement_readiness_pending'
  | 'ready_for_staging_review';

export type SecureLinkKind = 'securelink' | 'group_securelink';

export type GroupSecureLinkTier = 'welfare' | 'general' | 'business_solution';

export type ActivityLabel =
  | 'securelink_created'
  | 'payment_initiated'
  | 'provider_confirmation_pending'
  | 'provider_confirmed'
  | 'review_hold'
  | 'ledger_readiness_pending';

export type KSNumberProfile = {
  ksNumber: string;
  displayName: string;
  email: string;
  phone?: string;
  accountReadiness: AccountReadiness;
  isDemo?: boolean;
};

export type AccountReadiness = {
  status: MoneyStateLabel;
  label: string;
  summary: string;
  settlementReadiness: SettlementReadinessStatus;
  paymentReadyReadiness: PaymentReadyReadiness;
  updatedAt: string;
};

export type PaymentReadyReadiness = {
  status: MoneyStateLabel;
  label: string;
  summary: string;
  isReady: boolean;
  readyForStagingReviewOnly: boolean;
  updatedAt: string;
};

export type SecureLinkSummary = {
  id: string;
  slug: string;
  title: string;
  kind: SecureLinkKind;
  groupTier?: GroupSecureLinkTier;
  agreementControlledAmount: number;
  currency: 'KES';
  moneyState: MoneyStateLabel;
  moneyStateLabel: string;
  feeKes?: number;
  reviewHold: ReviewHoldStatus;
  updatedAt: string;
};

export type SecureLinkDetail = SecureLinkSummary & {
  description: string;
  releaseConditions: string[];
  providerConfirmedAt?: string;
  settlementReadiness: SettlementReadinessStatus;
  paymentReadyReadiness: PaymentReadyReadiness;
  isDemo?: boolean;
};

export type GroupSecureLinkDetail = SecureLinkDetail & {
  kind: 'group_securelink';
  groupTier: GroupSecureLinkTier;
  memberCount: number;
  contributionSummary: ContributionSummary;
};

export type ContributionSummary = {
  expectedContributions: number;
  recordedContributions: number;
  feePerContributionKes: number;
  currency: 'KES';
};

export type SecurePayTransaction = {
  id: string;
  secureLinkSlug?: string;
  title: string;
  agreementControlledAmount: number;
  currency: 'KES';
  activityLabel: ActivityLabel;
  activityDisplay: string;
  moneyState: MoneyStateLabel;
  createdAt: string;
  note?: string;
};

export type SecureLinkDraftInput = {
  title: string;
  description: string;
  agreementControlledAmount: number;
};

export type GroupSecureLinkDraftInput = SecureLinkDraftInput & {
  groupTier: GroupSecureLinkTier;
  memberCount: number;
};

export type ApiUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  ksNumber: string;
};

/** Backend DTO shapes — snake_case and camelCase variants (contract assumptions). */
export type BackendPaymentReadyReadinessDto = {
  status?: string;
  state?: string;
  summary?: string;
  is_ready?: boolean;
  isReady?: boolean;
  ready_for_staging_review_only?: boolean;
  readyForStagingReviewOnly?: boolean;
  review_hold?: string;
  reviewHold?: string;
  settlement_readiness?: string;
  settlementReadiness?: string;
  collection_payment_ready_readiness?: BackendPaymentReadyReadinessDto;
  collectionPaymentReadyReadiness?: BackendPaymentReadyReadinessDto;
  updated_at?: string;
  updatedAt?: string;
};

export type BackendContributionSummaryDto = {
  expected_contributions?: number;
  expectedContributions?: number;
  recorded_contributions?: number;
  recordedContributions?: number;
  fee_per_contribution_kes?: number;
  feePerContributionKes?: number;
  collection_contribution_summary?: BackendContributionSummaryDto;
  collectionContributionSummary?: BackendContributionSummaryDto;
};

export type BackendSecureLinkDto = {
  id?: string;
  slug?: string;
  title?: string;
  name?: string;
  kind?: string;
  type?: string;
  group_tier?: string;
  groupTier?: string;
  agreement_controlled_amount?: number;
  agreementControlledAmount?: number;
  amount?: number;
  amount_minor?: number;
  amountMinor?: number;
  money_state?: string;
  moneyState?: string;
  status?: string;
  money_state_label?: string;
  moneyStateLabel?: string;
  fee_kes?: number;
  feeKes?: number;
  review_hold?: string;
  reviewHold?: string;
  description?: string;
  release_conditions?: string[];
  releaseConditions?: string[];
  provider_confirmed_at?: string;
  providerConfirmedAt?: string;
  settlement_readiness?: string;
  settlementReadiness?: string;
  payment_ready_readiness?: BackendPaymentReadyReadinessDto;
  paymentReadyReadiness?: BackendPaymentReadyReadinessDto;
  member_count?: number;
  memberCount?: number;
  contribution_summary?: BackendContributionSummaryDto;
  contributionSummary?: BackendContributionSummaryDto;
  updated_at?: string;
  updatedAt?: string;
};
