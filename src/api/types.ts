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
