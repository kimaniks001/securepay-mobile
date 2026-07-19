import type {
  GroupSecureLinkDetail,
  SecureLinkDetail,
  SecureLinkSummary,
} from '../api/types';
import { feeDoctrine } from '../doctrine/securepayDoctrine';
import {
  mockPaymentReadyNotReady,
  mockPaymentReadyStagingReview,
} from './mockProfile';

const now = Date.now();
const hours = (n: number) => new Date(now - n * 60 * 60 * 1000).toISOString();
const days = (n: number) => new Date(now - n * 24 * 60 * 60 * 1000).toISOString();

export const mockSecureLinkSummaries: SecureLinkSummary[] = [
  {
    id: 'sl_001',
    slug: 'landlord-agreement-jan',
    title: 'Landlord agreement — January rent',
    kind: 'securelink',
    agreementControlledAmount: 25000,
    currency: 'KES',
    moneyState: 'awaiting_payment',
    moneyStateLabel: 'Provider confirmation pending',
    reviewHold: 'none',
    updatedAt: hours(4),
  },
  {
    id: 'sl_002',
    slug: 'photography-deposit',
    title: 'Photography package deposit',
    kind: 'securelink',
    agreementControlledAmount: 8000,
    currency: 'KES',
    moneyState: 'provider_confirmed',
    moneyStateLabel: 'Provider-confirmed',
    reviewHold: 'none',
    updatedAt: days(1),
  },
  {
    id: 'gsl_001',
    slug: 'welfare-chama-march',
    title: 'Welfare chama — March circle',
    kind: 'group_securelink',
    groupTier: 'welfare',
    agreementControlledAmount: 5000,
    currency: 'KES',
    moneyState: 'agreement_controlled',
    moneyStateLabel: 'Agreement-controlled amount',
    feeKes: feeDoctrine.welfareGroupSecureLink.feeKes,
    reviewHold: 'none',
    updatedAt: hours(10),
  },
  {
    id: 'gsl_002',
    slug: 'estate-general-fund',
    title: 'Estate general fund',
    kind: 'group_securelink',
    groupTier: 'general',
    agreementControlledAmount: 12000,
    currency: 'KES',
    moneyState: 'payment_ready_readiness',
    moneyStateLabel: 'Payment Ready readiness',
    feeKes: feeDoctrine.generalGroupSecureLink.feeKes,
    reviewHold: 'none',
    updatedAt: days(2),
  },
  {
    id: 'gsl_003',
    slug: 'sme-supplier-pool',
    title: 'SME supplier pool',
    kind: 'group_securelink',
    groupTier: 'business_solution',
    agreementControlledAmount: 45000,
    currency: 'KES',
    moneyState: 'settlement_readiness_pending',
    moneyStateLabel: 'Settlement readiness pending',
    feeKes: feeDoctrine.businessSolutionContribution.feeKes,
    reviewHold: 'none',
    updatedAt: days(3),
  },
  {
    id: 'gsl_004',
    slug: 'community-review-case',
    title: 'Community contribution — review case',
    kind: 'group_securelink',
    groupTier: 'general',
    agreementControlledAmount: 15000,
    currency: 'KES',
    moneyState: 'review_hold',
    moneyStateLabel: 'Review hold',
    feeKes: feeDoctrine.generalGroupSecureLink.feeKes,
    reviewHold: 'active',
    updatedAt: hours(30),
  },
  {
    id: 'sl_003',
    slug: 'settlement-missing-demo',
    title: 'Supplier agreement — settlement check',
    kind: 'securelink',
    agreementControlledAmount: 18000,
    currency: 'KES',
    moneyState: 'settlement_readiness_pending',
    moneyStateLabel: 'Settlement readiness missing',
    reviewHold: 'none',
    updatedAt: days(4),
  },
  {
    id: 'sl_004',
    slug: 'payment-ready-not-ready',
    title: 'School fees SecureLink',
    kind: 'securelink',
    agreementControlledAmount: 32000,
    currency: 'KES',
    moneyState: 'not_ready',
    moneyStateLabel: 'Payment Ready readiness not ready',
    reviewHold: 'none',
    updatedAt: hours(6),
  },
  {
    id: 'sl_005',
    slug: 'payment-ready-staging',
    title: 'Staging review SecureLink',
    kind: 'securelink',
    agreementControlledAmount: 9500,
    currency: 'KES',
    moneyState: 'ready_for_staging_review',
    moneyStateLabel: 'Ready for staging review only',
    reviewHold: 'none',
    updatedAt: hours(2),
  },
];

function baseDetail(summary: SecureLinkSummary): SecureLinkDetail {
  const paymentReadyReadiness =
    summary.slug === 'payment-ready-not-ready'
      ? mockPaymentReadyNotReady
      : summary.slug === 'payment-ready-staging'
        ? mockPaymentReadyStagingReview
        : summary.moneyState === 'provider_confirmed'
          ? {
              status: 'provider_confirmed' as const,
              label: 'Payment Ready readiness',
              summary: 'Provider-confirmed on backend. Mobile view only.',
              isReady: true,
              readyForStagingReviewOnly: false,
              updatedAt: summary.updatedAt,
            }
          : mockPaymentReadyNotReady;

  return {
    ...summary,
    description:
      'Agreement-backed SecureLink placeholder. Money follows the agreement through SecurePay backend only.',
    releaseConditions: [
      'Agreement terms met on backend',
      'Provider-confirmed status from SecurePay API Gateway',
      'Settlement readiness cleared by backend review',
    ],
    providerConfirmedAt:
      summary.moneyState === 'provider_confirmed' ? days(1) : undefined,
    settlementReadiness:
      summary.slug === 'settlement-missing-demo' ||
      summary.moneyState === 'settlement_readiness_pending'
        ? 'not_ready'
        : summary.moneyState === 'ready_for_staging_review'
          ? 'ready_for_staging_review'
          : 'settlement_readiness_pending',
    paymentReadyReadiness,
    isDemo: true,
  };
}

export const mockSecureLinkDetails: SecureLinkDetail[] = mockSecureLinkSummaries.map(baseDetail);

export const mockGroupSecureLinkDetails: GroupSecureLinkDetail[] = mockSecureLinkSummaries
  .filter((item): item is SecureLinkSummary & { kind: 'group_securelink' } => item.kind === 'group_securelink')
  .map((summary) => {
    const detail = baseDetail(summary);
    const fee =
      summary.feeKes ??
      (summary.groupTier === 'welfare'
        ? feeDoctrine.welfareGroupSecureLink.feeKes
        : feeDoctrine.businessSolutionContribution.feeKes);

    return {
      ...detail,
      kind: 'group_securelink',
      groupTier: summary.groupTier!,
      memberCount: summary.slug === 'welfare-chama-march' ? 12 : summary.slug === 'community-review-case' ? 18 : 24,
      contributionSummary: {
        expectedContributions: summary.slug === 'sme-supplier-pool' ? 6 : 10,
        recordedContributions: summary.slug === 'community-review-case' ? 7 : 4,
        feePerContributionKes: fee,
        currency: 'KES',
      },
    };
  });

export function getMockSecureLinkBySlug(slug: string): SecureLinkDetail | undefined {
  return mockSecureLinkDetails.find((item) => item.slug === slug);
}

export function getMockGroupSecureLinkBySlug(slug: string): GroupSecureLinkDetail | undefined {
  return mockGroupSecureLinkDetails.find((item) => item.slug === slug);
}
