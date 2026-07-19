import type { KSNumberProfile } from '../api/types';

export const MOCK_KS_NUMBER = 'KS-2026-0042';

export const mockProfile: KSNumberProfile = {
  ksNumber: MOCK_KS_NUMBER,
  displayName: 'Kimani K.',
  email: 'demo@securepay.app',
  phone: '+254 700 000 000',
  isDemo: true,
  accountReadiness: {
    status: 'ready_for_staging_review',
    label: 'Account readiness',
    summary: 'Demo account is ready for staging review only. No live money movement.',
    settlementReadiness: 'ready_for_staging_review',
    paymentReadyReadiness: {
      status: 'ready_for_staging_review',
      label: 'Payment Ready readiness',
      summary: 'Ready for staging review only. Provider confirmation still required for live use.',
      isReady: false,
      readyForStagingReviewOnly: true,
      updatedAt: new Date().toISOString(),
    },
    updatedAt: new Date().toISOString(),
  },
};

export const mockAccountReadinessNotReady: KSNumberProfile['accountReadiness'] = {
  status: 'not_ready',
  label: 'Account readiness',
  summary: 'Agreement details and provider checks are still pending on the backend.',
  settlementReadiness: 'not_ready',
  paymentReadyReadiness: {
    status: 'not_ready',
    label: 'Payment Ready readiness',
    summary: 'Payment Ready readiness is not ready. Backend review is required.',
    isReady: false,
    readyForStagingReviewOnly: false,
    updatedAt: new Date().toISOString(),
  },
  updatedAt: new Date().toISOString(),
};

export const mockPaymentReadyNotReady = {
  status: 'not_ready' as const,
  label: 'Payment Ready readiness',
  summary: 'Payment Ready readiness is not ready. Backend checks are still pending.',
  isReady: false,
  readyForStagingReviewOnly: false,
  updatedAt: new Date().toISOString(),
};

export const mockPaymentReadyStagingReview = {
  status: 'ready_for_staging_review' as const,
  label: 'Payment Ready readiness',
  summary: 'Ready for staging review only. Not live provider-confirmed.',
  isReady: false,
  readyForStagingReviewOnly: true,
  updatedAt: new Date().toISOString(),
};
