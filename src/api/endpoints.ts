/**
 * SecurePay API Gateway route constants.
 * Mobile Phase 5: confirmed vs assumed contract separation.
 *
 * Securepaymain/OpenAPI source was NOT available locally during Phase 5.
 * confirmed* endpoint maps are empty until backend evidence is attached.
 */

const API_V1 = '/api/v1';

/** Routes confirmed from Securepaymain/OpenAPI/controller source. Empty until verified. */
export const confirmedReadEndpoints: Record<string, string> = {};

/** Routes assumed from Phase 3/4 mobile contract — not yet verified against Securepaymain. */
export const assumedReadEndpoints = {
  health: `${API_V1}/health`,
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

/** Auth routes confirmed from Securepaymain. Empty until verified. */
export const confirmedAuthEndpoints: Record<string, string> = {};

/** Auth routes assumed — TODO confirm against Securepaymain auth module. */
export const assumedAuthEndpoints = {
  login: `${API_V1}/auth/mobile/login`,
  refresh: `${API_V1}/auth/mobile/refresh`,
  logout: `${API_V1}/auth/mobile/logout`,
  session: `${API_V1}/auth/mobile/session`,
} as const;

/** @deprecated Use assumedReadEndpoints */
export const publicReadEndpoints = {
  health: assumedReadEndpoints.health,
} as const;

/** @deprecated Use assumedReadEndpoints */
export const authenticatedReadEndpoints = assumedReadEndpoints;

/** @deprecated Use assumedAuthEndpoints */
export const authEndpoints = assumedAuthEndpoints;

/** Draft write endpoints reserved for a future phase — not callable. */
export const futureDraftWriteEndpoints = {
  createSecureLinkDraft: `${API_V1}/secure-links/drafts`,
  createGroupSecureLinkDraft: `${API_V1}/secure-links/group/drafts`,
} as const;

export const forbiddenInternalEndpoints = [
  '/internal/',
  '/admin/internal/',
  '/api/internal/',
  '/webhooks/internal/',
  '/internal/secure-link',
] as const;

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

/** @deprecated Use assumedReadEndpoints */
export const gatewayEndpoints = assumedReadEndpoints;

export const allCallableReadPaths: string[] = [
  ...Object.values(confirmedReadEndpoints),
  ...Object.values(assumedReadEndpoints).flatMap((v) => (typeof v === 'function' ? [] : [v])),
];

const FORBIDDEN_ALL = [
  ...forbiddenInternalEndpoints,
  ...forbiddenMoneyActionEndpoints,
  ...Object.values(futureDraftWriteEndpoints),
] as const;

export type EndpointContractStatus = 'confirmed' | 'assumed' | 'missing' | 'blocked' | 'future';

export const endpointContractMeta: Record<
  string,
  { path: string; status: EndpointContractStatus; source: string }
> = {
  health: { path: assumedReadEndpoints.health, status: 'assumed', source: 'Phase 5 — Securepaymain not local' },
  currentUser: { path: assumedReadEndpoints.currentUser, status: 'assumed', source: 'Phase 5 — Securepaymain not local' },
  ksNumberProfile: { path: assumedReadEndpoints.ksNumberProfile, status: 'assumed', source: 'Phase 5 — Securepaymain not local' },
  secureLinks: { path: assumedReadEndpoints.secureLinks, status: 'assumed', source: 'Phase 5 — Securepaymain not local' },
  secureLinkDetail: { path: '/api/v1/secure-links/{slug}', status: 'assumed', source: 'Phase 5 — Securepaymain not local' },
  groupSecureLinkDetail: { path: '/api/v1/secure-links/{slug}/group', status: 'assumed', source: 'Phase 5 — Securepaymain not local' },
  paymentReadyReadiness: { path: assumedReadEndpoints.paymentReadyReadiness, status: 'assumed', source: 'Phase 5 — Securepaymain not local' },
  accountReadiness: { path: assumedReadEndpoints.accountReadiness, status: 'assumed', source: 'Phase 5 — Securepaymain not local' },
  transactionHistory: { path: assumedReadEndpoints.transactionHistory, status: 'assumed', source: 'Phase 5 — Securepaymain not local' },
  evidenceList: { path: '/api/v1/secure-links/{slug}/evidence', status: 'missing', source: 'Phase 5 — endpoint not confirmed; UI not wired' },
  authLogin: { path: assumedAuthEndpoints.login, status: 'assumed', source: 'Phase 5 — Securepaymain not local' },
  authRefresh: { path: assumedAuthEndpoints.refresh, status: 'assumed', source: 'Phase 5 — Securepaymain not local' },
  authLogout: { path: assumedAuthEndpoints.logout, status: 'assumed', source: 'Phase 5 — Securepaymain not local' },
  draftSecureLink: { path: futureDraftWriteEndpoints.createSecureLinkDraft, status: 'future', source: 'Blocked until Phase 6+' },
  draftGroupSecureLink: { path: futureDraftWriteEndpoints.createGroupSecureLinkDraft, status: 'future', source: 'Blocked until Phase 6+' },
};

export function isAuthEndpoint(path: string): boolean {
  const normalized = path.toLowerCase();
  const allAuth: string[] = [
    ...Object.values(confirmedAuthEndpoints),
    ...Object.values(assumedAuthEndpoints),
  ];
  return allAuth.some((endpoint) => normalized.includes(endpoint.toLowerCase()));
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

export function getConfirmedEndpointCount(): number {
  return (
    Object.keys(confirmedReadEndpoints).length + Object.keys(confirmedAuthEndpoints).length
  );
}

export function getAssumedEndpointCount(): number {
  return Object.values(endpointContractMeta).filter((m) => m.status === 'assumed').length;
}
