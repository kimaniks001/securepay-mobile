# Mobile Phase 3: Staging Read-Only API Gateway Integration

**Repository:** `kimaniks001/securepay-mobile`  
**Branch:** `mobile-phase-3-staging-readonly-api-gateway-integration`  
**Date:** 2026-07-19

---

## A. Executive summary

Mobile Phase 3 adds a **read-only staging integration layer** through the SecurePay API Gateway. The mobile app remains a client only: it can load user profile, KSNumber, SecureLinks, readiness, and activity from staging when configured, but **cannot** confirm payments, release money, withdraw, post ledger entries, or call provider endpoints.

**Default mode remains `mock`.** Production API access is disabled. Staging requires an explicit base URL and remains read-only.

---

## B. Scope and non-goals

### In scope

- API environment model (`mock`, `staging`, `production_disabled`)
- Config validation and safe environment labels
- HTTP client (GET-only, timeout, typed errors)
- Secure session storage (expo-secure-store, no internal tokens)
- Staging read-only API adapter with DTO mappers
- Read-only action guards
- Screen loading/error/empty states
- Environment banner on Account/Home

### Non-goals (Phase 3)

- Production backend integration
- Hardcoded production URLs or tokens
- Real or fake payment success from mobile
- Withdrawal, release, payout, ledger posting
- Direct Stripe, 2C2P, M-Pesa, PesaLink, Choice Bank, Supabase, or ledger clients
- API writes (draft create to staging gateway)
- Committed `.env` files or secrets

---

## C. Relationship to prior mobile phases

| Phase | Contribution to Phase 3 |
|-------|-------------------------|
| **Phase 1** | Expo shell, navigation, secure storage foundation |
| **Phase 2** | Doctrine, mock API adapter, types, readiness screens |
| **Phase 2B** | UI components, journey map, safety checks |
| **Phase 2C-Lite** | Public site alignment, environment-safe copy |
| **PR #5 review** | Confirmed stack merge-ready on `main` |

Phase 3 extends `src/api/` without changing money-movement posture.

---

## D. API modes

| Mode | Default | Behavior |
|------|---------|----------|
| `mock` | **Yes** | Local mock data via `mockSecurepayApi` |
| `staging` | No | Read-only GET via `stagingSecurepayApi` when base URL configured and environment validated |
| `production` | Disabled | Maps to `production_disabled`; blocked in Phase 3 |

### Environment labels

- **Mock mode** — Demo mode. No real money movement.
- **Staging mode** — Connected to staging API. Money actions remain disabled.
- **Production disabled** — Production API access disabled in this phase.
- **Unsafe environment blocked** — Misconfigured or blocked URL; falls back to mock reads where safe.

---

## E. Environment variables

See `.env.example` (never commit `.env`):

```bash
EXPO_PUBLIC_SECUREPAY_API_MODE=mock
EXPO_PUBLIC_SECUREPAY_API_BASE_URL=
EXPO_PUBLIC_SECUREPAY_ENABLE_API_WRITES=false
EXPO_PUBLIC_SECUREPAY_ALLOW_PRODUCTION_API=false
```

### Rules

1. Default mode is `mock`.
2. `staging` requires `EXPO_PUBLIC_SECUREPAY_API_BASE_URL`.
3. Production `securepay.ke` URLs rejected unless `EXPO_PUBLIC_SECUREPAY_ALLOW_PRODUCTION_API=true` (Phase 3 still read-only).
4. `EXPO_PUBLIC_SECUREPAY_ENABLE_API_WRITES` is **not honored** in Phase 3.
5. Cloud Agents must not use real staging/production secrets.

---

## F. HTTP client behavior

`src/api/httpClient.ts`:

- Uses configured base URL from `apiConfig`
- **GET requests only** in Phase 3
- Bearer token from secure session when present
- 15s timeout with abort
- Typed `ApiResult<T>` success/error
- Safe user-facing error messages via `apiErrors.ts`
- Request ID extraction from response headers when available
- Forbidden endpoint paths blocked before network call

---

## G. Session storage rules

`src/api/sessionStorage.ts` (expo-secure-store):

**Allowed:** mobile access token, refresh token placeholder, expiry, basic user metadata.

**Forbidden:** INTERNAL_TOKEN, Choice/provider/bank credentials, raw customer secrets, production secrets.

Login remains demo mode until auth endpoints are stable; storage layer is prepared for future session tokens.

---

## H. Staging API functions

`src/api/stagingSecurepayApi.ts` (read-only):

| Function | Gateway route (placeholder) |
|----------|----------------------------|
| `stagingGetCurrentUser` | `GET /api/v1/users/me` |
| `stagingGetKSNumberProfile` | `GET /api/v1/ksnumber/profile` |
| `stagingGetSecureLinks` | `GET /api/v1/secure-links` |
| `stagingGetSecureLinkBySlug` | `GET /api/v1/secure-links/{slug}` |
| `stagingGetPaymentReadyReadiness` | `GET /api/v1/readiness/payment-ready` |
| `stagingGetAccountReadiness` | `GET /api/v1/readiness/account` |
| `stagingGetTransactionHistory` | `GET /api/v1/activity/transactions` |

If staging is unavailable or misconfigured, functions **fall back to mock data** safely.

> **TODO:** Confirm exact routes against Securepaymain backend before production cutover.

---

## I. DTO mapping rules

`src/api/mappers.ts` maps backend DTOs conservatively:

- `provider_confirmed` stays `provider_confirmed`
- `pending` / `initiated` → `awaiting_payment` (not paid)
- `failed` / `reversed` → `not_ready` (not collected)
- Payment Ready readiness never implies payout
- Ledger posted does not imply money released
- Review hold blocks readiness display
- Missing settlement readiness → `not_ready`
- Unknown status → `not_ready`
- Group fee doctrine: Welfare KES 10, General/Business KES 20

---

## J. Read-only action guards

`src/api/mobileActionGuards.ts` blocks:

- create payment success, provider confirmation, release, withdrawal, payout
- ledger posting, Choice transfer, M-Pesa/PesaLink direct calls
- wallet transfer, internal webhook-complete, internal ledger posting

Returns `unsupported_action` with safe message.

---

## K. Screen behavior

Screens load through `securepayApi` facade:

- **Home, SecureLinks, Activity, Account, Readiness** — loading, error, empty via `ApiStatePanel`
- **SecureLink detail** — read-only backend status (agreement, provider, readiness, ledger label)
- **Environment banner** on Account (and Home compact)
- No money-action buttons added

---

## L. Safety checks

```bash
npm run typecheck
npm run check:ui-safety   # includes Phase 3 API safety checks
npx expo config --type public
```

Checks verify: mock default, production disabled, writes blocked, guards present, no provider SDKs, no unsafe buttons.

---

## M. Remaining risks

1. **Gateway route mismatch** — placeholder paths may differ from live Securepaymain API.
2. **Auth not wired** — demo login; staging may return 401 until mobile auth is integrated.
3. **DTO drift** — backend field names may change; mappers use defensive fallbacks.
4. **No automated integration tests** — lightweight static checks only.

---

## N. Recommended Mobile Phase 4

1. **Authenticated staging sessions** — OAuth/mobile token exchange via API Gateway (no secrets in repo).
2. **Confirmed gateway contract** — OpenAPI sync from Securepaymain.
3. **Controlled write paths** — draft SecureLink submission to staging (still no money actions).
4. **E2E staging smoke tests** — read-only contract tests against approved staging URL.
5. **Production readiness gate** — separate phase with audit, pen test, and app store release plan.

---

## Mock behavior before Phase 3 (baseline)

Prior to Phase 3, all `securepayApi` methods routed exclusively to `mockSecurepayApi`:

- Fixed demo user `KS-2026-0042`
- Local SecureLink summaries and details from `src/mocks/`
- Readiness states for staging review only (not payout)
- Draft create stored locally with demo flags
- No network calls; `apiConfig.mode` defaulted to `mock`

Phase 3 preserves this as the default and safe fallback path.
