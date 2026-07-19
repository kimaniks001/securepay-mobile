/**
 * SecurePay API Gateway route constants.
 * Mobile Phase 4: categorized contract foundation.
 * Confirm paths against Securepaymain backend — most routes are ASSUMED until checklist confirms.
 */

const API_V1 = '/api/v1';

/** Read endpoints that may work without a session (health/public metadata only). */
export const publicReadEndpoints = {
  health: `${API_V1}/health`,
} as const;

/** Read endpoints that require a mobile bearer session. */
export const authenticatedReadEndpoints = {
  currentUser: `${API_V1}/users/me`,
  ksNumberProfile: `${API_V1}/ksnumber/profile`,
  secureLinks: `${API_V1}/secure-links`,
  secureLinkBySlug: (slug: string) => `${API_V1}/secure-links/${encodeURIComponent(slug)}`,
  groupSecureLinkBySlug: (slug: string) =>
    `${API_V1}/secure-links/${encodeURIComponent(slug)}/group`,
  secureLinkEvidence: (slug: string) =>
    `${API_V1}/secure-links/${encodeURIComponent(slug)}/evidence`,
  paymentReadyReadiness: `${API_V1}/readiness/payment-ready`,
  accountReadiness: `${API_V1}/readiness/account`,
  transactionHistory: `${API_V1}/activity/transactions`,
} as const;

/**
 * Auth/session endpoints — only non-money POSTs allowed from mobile in Phase 4.
 * TODO: Confirm exact auth routes against Securepaymain.
 */
export const authEndpoints = {
  login: `${API_V1}/auth/mobile/login`,
  refresh: `${API_V1}/auth/mobile/refresh`,
  logout: `${API_V1}/auth/mobile/logout`,
  session: `${API_V1}/auth/mobile/session`,
} as const;

/** Draft write endpoints reserved for a future phase — not callable in Phase 4. */
export const futureDraftWriteEndpoints = {
  createSecureLinkDraft: `${API_V1}/secure-links/drafts`,
  createGroupSecureLinkDraft: `${API_V1}/secure-links/group/drafts`,
} as const;

/** Internal routes that must never be called from mobile. */
export const forbiddenInternalEndpoints = [
  '/internal/',
  '/admin/internal/',
  '/api/internal/',
  '/webhooks/internal/',
] as const;

/** Money/provider/ledger routes forbidden from mobile. */
export const forbiddenMoneyActionEndpoints = [
  '/api/v1/webhooks/complete',
  '/api/v1/webhook-complete',
  '/api/v1/payments/complete',
  '/api/v1/payments/confirm',
  '/api/v1/payments/success',
  '/api/v1/payment-complete',
  '/api/v1/provider-confirmation',
  '/api/v1/provider/confirm',
  '/api/v1/ledger/post',
  '/api/v1/ledger/posting',
  '/api/v1/ledger-posting',
  '/api/v1/release',
  '/api/v1/withdrawal',
  '/api/v1/payout',
  '/api/v1/settlement',
  '/api/v1/auto-payout',
  '/api/v1/choice-bank/transfer',
  '/api/v1/choice/transfer',
  '/api/v1/mpesa',
  '/api/v1/pesalink',
  '/api/v1/stripe',
  '/api/v1/2c2p',
] as const;

/** @deprecated Use authenticatedReadEndpoints — kept for Phase 3 imports. */
export const gatewayEndpoints = authenticatedReadEndpoints;

export const allCallableReadPaths = [
  ...Object.values(publicReadEndpoints),
  ...Object.values(authenticatedReadEndpoints).flatMap((v) =>
    typeof v === 'function' ? [] : [v],
  ),
] as const;

const FORBIDDEN_ALL = [
  ...forbiddenInternalEndpoints,
  ...forbiddenMoneyActionEndpoints,
  ...Object.values(futureDraftWriteEndpoints),
] as const;

export function isAuthEndpoint(path: string): boolean {
  const normalized = path.toLowerCase();
  return Object.values(authEndpoints).some((endpoint) => normalized.includes(endpoint.toLowerCase()));
}

export function isForbiddenEndpoint(path: string): boolean {
  const normalized = path.toLowerCase();
  return FORBIDDEN_ALL.some((forbidden) => normalized.includes(forbidden.toLowerCase()));
}

export function isAllowedMobileRequest(path: string, method: string): boolean {
  if (isForbiddenEndpoint(path)) return false;
  const upperMethod = method.toUpperCase();
  if (upperMethod === 'GET') {
    return (
      allCallableReadPaths.some((allowed) => path.toLowerCase().includes(allowed.toLowerCase())) ||
      isAuthEndpoint(path)
    );
  }
  if (upperMethod === 'POST' && isAuthEndpoint(path)) return true;
  return false;
}
