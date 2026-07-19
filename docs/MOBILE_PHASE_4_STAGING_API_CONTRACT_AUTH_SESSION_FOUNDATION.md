# Mobile Phase 4: Staging API Contract and Auth Session Foundation

**Repository:** `kimaniks001/securepay-mobile`  
**Branch:** `mobile-phase-4-staging-api-contract-auth-session-foundation`  
**Date:** 2026-07-19

---

## A. Executive summary

Mobile Phase 4 tightens the staging API contract foundation introduced in Phase 3 and adds **safe authenticated session support** for staging reads. Placeholder gateway assumptions are now documented, categorized, and checkable. Auth POSTs are the only non-GET calls permitted; all money actions remain blocked.

**Default mode remains `mock`.** Production API access remains disabled. Mobile remains a read-only client for money state.

---

## B. Scope and non-goals

### In scope

- Documented API contract and backend checklist
- Categorized endpoint constants (public, authenticated, auth, future, forbidden)
- Auth/session API (`authApi.ts`) with demo and staging login paths
- Enhanced session storage safeguards
- DTO compatibility helpers (snake_case, camelCase, nested collection fields)
- Runtime contract self-check utility
- Account API contract status display
- Staging-aware login screen

### Non-goals

- Production backend integration
- Real payment, withdrawal, release, payout, ledger posting
- Direct provider SDKs (Stripe, 2C2P, M-Pesa, PesaLink, Choice Bank, Supabase, ledger)
- API writes except safe auth/session POSTs
- Pretending unconfirmed routes are confirmed
- Committed secrets or `.env` files

---

## C. Relationship to prior phases

| Phase | Contribution |
|-------|--------------|
| **1** | Expo shell, secure storage, demo auth |
| **2** | Doctrine, mock API adapter, types |
| **2B / 2C-Lite** | UI alignment, safety checks |
| **3** | Staging read-only GET, HTTP client, mappers, environment banner |
| **4 (this)** | Contract docs, auth foundation, DTO hardening, self-check |

---

## D. Current Phase 3 API assumptions (baseline before Phase 4)

Phase 3 introduced these **assumed** gateway paths (not confirmed against Securepaymain):

| Function | Assumed path |
|----------|--------------|
| Current user | `GET /api/v1/users/me` |
| KSNumber profile | `GET /api/v1/ksnumber/profile` |
| SecureLinks list | `GET /api/v1/secure-links` |
| SecureLink detail | `GET /api/v1/secure-links/{slug}` |
| Group detail | `GET /api/v1/secure-links/{slug}/group` |
| Payment Ready readiness | `GET /api/v1/readiness/payment-ready` |
| Account readiness | `GET /api/v1/readiness/account` |
| Activity history | `GET /api/v1/activity/transactions` |

Additional Phase 3 behaviors:

- Demo login stored token in `secureStorage` only — not synced with API session layer
- Staging reads could return **401** without gateway token
- DTO mappers accepted snake_case and camelCase but not nested `collection_*` wrappers
- No runtime contract verification
- Auth endpoints not defined

Phase 4 addresses these gaps without enabling money actions.

---

## E. Required backend contract checks

See **`docs/MOBILE_STAGING_API_CONTRACT_CHECKLIST.md`** for the full checklist.

Backend team must confirm:

1. Auth login/refresh/logout paths and token shape
2. Read endpoint paths and pagination wrappers
3. SecureLink and Group SecureLink response shapes
4. Readiness field sources (standalone vs nested on SecureLink)
5. Activity label vocabulary alignment with mobile doctrine
6. Evidence endpoint availability (future read-only)

**Do not mark routes confirmed without backend evidence.**

---

## F. Auth/session model

| Mode | Login behavior |
|------|----------------|
| `mock` | `loginWithDemoCredentials()` — local demo token, no network |
| `staging` | `loginWithStagingCredentials()` — `POST /api/v1/auth/mobile/login` (assumed) |

### Session storage

- Tokens stored in **expo-secure-store** via `sessionStorage.ts`
- User profile mirrored in legacy `secureStorage` for app shell compatibility
- `logout()` clears both stores
- Forbidden: INTERNAL_TOKEN, provider/bank/webhook/production secrets

### Allowed HTTP methods (Phase 4)

| Method | Allowed for |
|--------|-------------|
| GET | Authenticated/public read endpoints |
| POST | Auth endpoints only (`/api/v1/auth/mobile/*`) |
| PUT/PATCH/DELETE | **Blocked** |

---

## G. Read-only endpoint contract

### `publicReadEndpoints`

- `GET /api/v1/health` (optional)

### `authenticatedReadEndpoints`

All Phase 3 read paths, plus:

- `GET /api/v1/secure-links/{slug}/evidence` (reserved, not UI-wired)

### `futureDraftWriteEndpoints` (blocked in Phase 4)

- `POST /api/v1/secure-links/drafts`
- `POST /api/v1/secure-links/group/drafts`

---

## H. DTO mapping contract

`mappers.ts` compatibility helpers:

| Helper | Purpose |
|--------|---------|
| `pickField()` | snake_case + camelCase field resolution |
| `normalizeDtoRecord()` | Unwrap `data` / `item` / `result` wrappers |
| `parseAgreementAmount()` | Major units or minor units (÷100) |
| `resolvePaymentReadyReadinessSource()` | Handles `collection_payment_ready_readiness` |
| `resolveContributionSummarySource()` | Handles `collection_contribution_summary` |

### Mapping rules (unchanged from Phase 3, reinforced)

- `pending` / `initiated` → `awaiting_payment` (not paid)
- `failed` / `reversed` → `not_ready`
- `provider_confirmed` stays provider-confirmed
- Payment Ready ≠ payout
- Ledger posted ≠ money released
- Review hold blocks readiness display
- Unknown → `not_ready`

---

## I. Forbidden endpoints

See `forbiddenInternalEndpoints` and `forbiddenMoneyActionEndpoints` in `src/api/endpoints.ts`.

Includes: webhook-complete, payment-complete, provider confirmation, ledger posting, release, withdrawal, payout, settlement, auto-payout, Choice transfer, direct provider routes, `/internal/*`.

---

## J. Environment rules

Same as Phase 3:

```bash
EXPO_PUBLIC_SECUREPAY_API_MODE=mock
EXPO_PUBLIC_SECUREPAY_API_BASE_URL=
EXPO_PUBLIC_SECUREPAY_ENABLE_API_WRITES=false
EXPO_PUBLIC_SECUREPAY_ALLOW_PRODUCTION_API=false
```

- Mock default
- Staging requires base URL
- Production `securepay.ke` blocked by default
- Writes env flag not honored (auth POST exception only in httpClient)

---

## K. Safety checks

```bash
npm run typecheck
npm run check:ui-safety
npx expo config --type public
```

Phase 4 additions to `check-mobile-ui-safety.mjs`:

- `authApi.ts` exists
- `contractSelfCheck.ts` exists
- No INTERNAL_TOKEN storage keys
- Forbidden endpoints not in callable read list
- No production URL hardcoded in source

Runtime: Account → **API contract status** → **Refresh contract status**

---

## L. Remaining backend questions

1. Exact auth endpoint paths and request/response schema
2. Whether Group SecureLink detail is separate route or embedded
3. Pagination format for SecureLinks and activity lists
4. Evidence endpoint shape and availability
5. Token refresh cadence and expiry handling
6. Whether readiness endpoints exist standalone or only nested

---

## M. Recommended Mobile Phase 5

1. **Confirm contract** — mark checklist items confirmed from Securepaymain OpenAPI
2. **Authenticated staging smoke tests** — lightweight contract tests with mock server
3. **Evidence read-only UI** — when endpoint confirmed
4. **Controlled draft submission** — POST drafts to staging (still no money actions)
5. **Token refresh UX** — silent refresh before read calls
6. **Production readiness gate** — separate audited phase

---

## Phase 4 files added/updated

| File | Purpose |
|------|---------|
| `src/api/authApi.ts` | Demo + staging login, logout, refresh |
| `src/api/contractSelfCheck.ts` | Runtime contract verification |
| `src/api/endpoints.ts` | Categorized endpoint constants |
| `src/api/sessionStorage.ts` | Enhanced secret rejection |
| `src/api/mappers.ts` | DTO compatibility helpers |
| `src/api/httpClient.ts` | Auth POST allowance |
| `src/api/lastApiError.ts` | Last error tracking for Account display |
| `app/login.tsx` | Mock vs staging login UX |
| `app/(tabs)/account.tsx` | API contract status section |
| `docs/MOBILE_STAGING_API_CONTRACT_CHECKLIST.md` | Backend confirmation checklist |
