import { apiConfig } from './config';
import type {
  AccountReadiness,
  ApiUser,
  GroupSecureLinkDraftInput,
  GroupSecureLinkDetail,
  KSNumberProfile,
  PaymentReadyReadiness,
  SecureLinkDetail,
  SecureLinkDraftInput,
  SecureLinkSummary,
  SecurePayTransaction,
} from './types';
import { mockProfile, mockAccountReadinessNotReady } from '../mocks/mockProfile';
import {
  getMockGroupSecureLinkBySlug,
  getMockSecureLinkBySlug,
  mockGroupSecureLinkDetails,
  mockSecureLinkDetails,
  mockSecureLinkSummaries,
} from '../mocks/mockSecureLinks';
import { mockTransactions } from '../mocks/mockTransactions';

function delay<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

function draftSummary(input: SecureLinkDraftInput, kind: SecureLinkSummary['kind']): SecureLinkSummary {
  const slug = `${input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${Date.now()}`;
  return {
    id: `draft_${slug}`,
    slug,
    title: input.title,
    kind,
    agreementControlledAmount: input.agreementControlledAmount,
    currency: 'KES',
    moneyState: 'draft',
    moneyStateLabel: 'Draft — not submitted for provider confirmation',
    reviewHold: 'none',
    updatedAt: new Date().toISOString(),
  };
}

export async function mockGetCurrentUser(): Promise<ApiUser> {
  return delay({
    id: 'usr_demo_001',
    name: mockProfile.displayName,
    email: mockProfile.email,
    phone: mockProfile.phone,
    ksNumber: mockProfile.ksNumber,
  });
}

export async function mockGetKSNumberProfile(): Promise<KSNumberProfile> {
  return delay(mockProfile);
}

export async function mockGetSecureLinks(): Promise<SecureLinkSummary[]> {
  return delay(mockSecureLinkSummaries);
}

export async function mockGetSecureLinkBySlug(slug: string): Promise<SecureLinkDetail | null> {
  return delay(getMockSecureLinkBySlug(slug) ?? null);
}

export async function mockCreateSecureLinkDraft(input: SecureLinkDraftInput): Promise<SecureLinkDetail> {
  const summary = draftSummary(input, 'securelink');
  return delay({
    ...summary,
    description: input.description,
    releaseConditions: [
      'Agreement terms recorded on backend',
      'Provider-confirmed status required before live movement',
    ],
    settlementReadiness: 'not_ready',
    paymentReadyReadiness: mockAccountReadinessNotReady.paymentReadyReadiness,
    isDemo: true,
  });
}

export async function mockCreateGroupSecureLinkDraft(
  input: GroupSecureLinkDraftInput,
): Promise<GroupSecureLinkDetail> {
  const summary = draftSummary(input, 'group_securelink');
  const fee =
    input.groupTier === 'welfare'
      ? 10
      : 20;

  return delay({
    ...summary,
    kind: 'group_securelink',
    groupTier: input.groupTier,
    description: input.description,
    releaseConditions: [
      'Group agreement terms recorded on backend',
      'Provider-confirmed status required before live movement',
    ],
    settlementReadiness: 'not_ready',
    paymentReadyReadiness: mockAccountReadinessNotReady.paymentReadyReadiness,
    memberCount: input.memberCount,
    feeKes: fee,
    contributionSummary: {
      expectedContributions: input.memberCount,
      recordedContributions: 0,
      feePerContributionKes: fee,
      currency: 'KES',
    },
    isDemo: true,
  });
}

export async function mockGetPaymentReadyReadiness(): Promise<PaymentReadyReadiness> {
  return delay(mockProfile.accountReadiness.paymentReadyReadiness);
}

export async function mockGetAccountReadiness(): Promise<AccountReadiness> {
  return delay(mockProfile.accountReadiness);
}

export async function mockGetTransactionHistory(): Promise<SecurePayTransaction[]> {
  return delay(mockTransactions);
}

export function getMockCatalogForDebug() {
  return {
    mode: apiConfig.mode,
    secureLinks: mockSecureLinkSummaries.length,
    groupSecureLinks: mockGroupSecureLinkDetails.length,
    transactions: mockTransactions.length,
  };
}
