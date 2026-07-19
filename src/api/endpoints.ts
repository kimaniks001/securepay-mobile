/**
 * SecurePay API Gateway route constants.
 * Confirm paths against Securepaymain backend before production use.
 * Mobile Phase 3: read-only routes only.
 */

const API_V1 = '/api/v1';

export const gatewayEndpoints = {
  currentUser: `${API_V1}/users/me`,
  ksNumberProfile: `${API_V1}/ksnumber/profile`,
  secureLinks: `${API_V1}/secure-links`,
  secureLinkBySlug: (slug: string) => `${API_V1}/secure-links/${encodeURIComponent(slug)}`,
  groupSecureLinkBySlug: (slug: string) =>
    `${API_V1}/secure-links/${encodeURIComponent(slug)}/group`,
  paymentReadyReadiness: `${API_V1}/readiness/payment-ready`,
  accountReadiness: `${API_V1}/readiness/account`,
  transactionHistory: `${API_V1}/activity/transactions`,
} as const;

/** Endpoints that must never be called from mobile in Phase 3. */
export const forbiddenMobileEndpoints = [
  '/api/v1/payments/confirm',
  '/api/v1/payments/success',
  '/api/v1/provider-confirmation',
  '/api/v1/webhooks/complete',
  '/api/v1/ledger/post',
  '/api/v1/ledger/posting',
  '/api/v1/release',
  '/api/v1/withdrawal',
  '/api/v1/payout',
  '/api/v1/choice-bank/transfer',
  '/api/v1/mpesa',
  '/api/v1/pesalink',
  '/internal/',
] as const;

export function isForbiddenEndpoint(path: string): boolean {
  const normalized = path.toLowerCase();
  return forbiddenMobileEndpoints.some((forbidden) => normalized.includes(forbidden));
}
