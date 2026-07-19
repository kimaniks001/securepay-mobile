# Mobile Phase 5: API Contract Confirmation and Authenticated Staging Smoke Tests

**Repository:** `kimaniks001/securepay-mobile`  
**Branch:** `mobile-phase-5-api-contract-confirmation-staging-smoke-tests`  
**Date:** 2026-07-19

---

## A. Executive summary

Phase 5 adds **contract confirmation tooling** and **local staging smoke-test infrastructure** while keeping the mobile client **read-only** for money state. Securepaymain was **not available locally**, so **zero routes were marked confirmed**. All gateway paths remain **assumed** until backend source evidence is attached.

Deliverables: categorized endpoint constants, fixture-based mapper contract checks, local smoke-test script, updated checklist, and enhanced contract self-check.

---

## B. Scope and non-goals

### In scope

- Inspect Securepaymain if available (was not)
- Separate confirmed vs assumed endpoint constants
- Fixture-based mapper contract tests (`npm run check:api-contract`)
- Local staging smoke-test script (`npm run smoke:staging-readonly`)
- Evidence read-only API function (mapper + staging) — **UI not wired** (endpoint missing)
- Updated checklist and contract metadata

### Non-goals

- Production integration
- Draft creation to staging
- Real/fake payments, withdrawal, release, payout, ledger posting
- Provider confirmation from mobile
- Evidence upload/delete/approve
- Committed secrets or `.env` files
- General API writes (auth POST only)

---

## C. Sources inspected

| Source | Result |
|--------|--------|
| `../Securepaymain` | **Not available** |
| Local OpenAPI/Swagger | **Not found** |
| Controller route grep | **Skipped** — no repo |
| Phase 4 mobile contract | Reviewed — all assumptions documented |

---

## D. Confirmed API routes

**None** in Phase 5. `confirmedReadEndpoints` and `confirmedAuthEndpoints` are empty objects until Securepaymain verification.

---

## E. Assumed API routes

All Phase 4 assumed routes remain assumed:

- `GET /api/v1/health`
- `GET /api/v1/users/me`
- `GET /api/v1/ksnumber/profile`
- `GET /api/v1/secure-links`
- `GET /api/v1/secure-links/{slug}`
- `GET /api/v1/secure-links/{slug}/group`
- `GET /api/v1/readiness/payment-ready`
- `GET /api/v1/readiness/account`
- `GET /api/v1/activity/transactions`
- `POST /api/v1/auth/mobile/login`
- `POST /api/v1/auth/mobile/refresh`
- `POST /api/v1/auth/mobile/logout`
- `GET /api/v1/auth/mobile/session`

---

## F. Missing API routes

| Route | Status |
|-------|--------|
| `GET /api/v1/secure-links/{slug}/evidence` | **missing** — mapper + staging function exist; UI not wired |
| `GET /api/v1/secure-links/{slug}/evidence/{id}` | **missing** — not implemented |

---

## G. Blocked/forbidden API routes

Protected via `forbiddenInternalEndpoints` and `forbiddenMoneyActionEndpoints`:

- webhook-complete, payment-complete, provider confirmation
- ledger posting, release, withdrawal, payout, settlement, auto-payout
- Choice transfer, direct provider routes
- internal routes including `/internal/secure-link`

---

## H. Auth/session contract

- **Assumed** login: `POST /api/v1/auth/mobile/login` with `{ email, pin }`
- Response fields: `access_token` / `accessToken`, `refresh_token`, `expires_at`, nested `user`
- Tokens stored **only** in expo-secure-store
- No INTERNAL_TOKEN, no provider secrets
- Staging login shows safe error when environment misconfigured
- Logout clears all secure storage

---

## I. Read-only contract

- GET-only for data endpoints
- POST allowed only for auth endpoints
- Staging reads fall back to mock on failure
- Conservative DTO mapping rules preserved

---

## J. Evidence read-only contract

- `stagingGetSecureLinkEvidence(slug)` added
- `mapEvidenceList()` + fixtures for contract tests
- **UI not wired** — endpoint status **missing**, not confirmed
- No upload, delete, approve, or release triggers

---

## K. DTO mapping changes

- `mapEvidenceList()` / `mapEvidenceItem()` added
- Fixture catalog in `src/api/fixtures/`
- `mapperContractChecks.ts` validates snake/camelCase, null readiness, fee doctrine, conservative status rules

---

## L. Staging smoke-test design

**Script:** `scripts/mobile-staging-readonly-smoke.mjs`  
**npm script:** `npm run smoke:staging-readonly`

### Rules

- Requires `EXPO_PUBLIC_SECUREPAY_API_MODE=staging`
- Requires `EXPO_PUBLIC_SECUREPAY_API_BASE_URL`
- Refuses production `securepay.ke` URL by default
- GET only for read endpoints
- Optional `SECUREPAY_SMOKE_ACCESS_TOKEN` for authenticated endpoints
- Optional `SECUREPAY_SMOKE_TEST_SLUG` for detail/evidence smoke
- Masks tokens in logs; never prints secrets
- Writes report to `logs/mobile-staging-smoke-report.local.json` (gitignored)
- Exits safely when credentials missing (skips auth-required checks)

---

## M. Safety checks

```bash
npm run typecheck
npm run check:ui-safety
npm run check:api-contract
npx expo config --type public
```

---

## N. Remaining risks

1. **No Securepaymain source** — all routes remain assumed
2. Staging 401 until developer provides local bearer token
3. Evidence endpoint shape unknown
4. Auth request/response schema unverified
5. Smoke test requires live staging URL (developer-local only)

---

## O. Recommended Mobile Phase 6

1. **Clone Securepaymain** and confirm routes → populate `confirmedReadEndpoints`
2. Wire evidence read-only UI when endpoint confirmed
3. Add OpenAPI snapshot doc from Securepaymain
4. Controlled draft submission to staging (still no money actions)
5. CI fixture-based contract tests (no live staging in CI)
6. Production readiness gate (separate audited phase)

---

## Phase 4 assumptions before Phase 5 (baseline)

Phase 4 documented all routes as **assumed** with empty confirmed maps. Auth used placeholder `POST /api/v1/auth/mobile/login`. DTO mappers handled snake/camelCase and `collection_*` nested fields. Contract self-check ran on Account screen. No automated mapper tests or smoke scripts existed.
