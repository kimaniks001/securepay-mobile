# Mobile Staging API Contract Checklist

Use this checklist to confirm Securepaymain backend routes against the mobile client contract.

**Status legend:** `confirmed` · `assumed` · `missing` · `blocked` · `future`

**Phase 5 source inspection:** `../Securepaymain` was **not available locally**. No routes were marked confirmed without backend evidence.

| Endpoint / concern | Mobile constant | Status | Notes |
|--------------------|-----------------|--------|-------|
| Mobile login / session | `POST /api/v1/auth/mobile/login` | **assumed** | Securepaymain not local — auth schema unverified |
| Session refresh | `POST /api/v1/auth/mobile/refresh` | **assumed** | Refresh token flow not validated |
| Session logout | `POST /api/v1/auth/mobile/logout` | **assumed** | Optional server-side invalidation |
| Current session | `GET /api/v1/auth/mobile/session` | **assumed** | May duplicate `/users/me` |
| Current user | `GET /api/v1/users/me` | **assumed** | Requires bearer token |
| KSNumber profile | `GET /api/v1/ksnumber/profile` | **assumed** | Field names: `ks_number`, `display_name` |
| SecureLink list | `GET /api/v1/secure-links` | **assumed** | Pagination wrapper TBD (`items` vs `data`) |
| SecureLink detail | `GET /api/v1/secure-links/{slug}` | **assumed** | Slug param name unverified |
| Group SecureLink detail | `GET /api/v1/secure-links/{slug}/group` | **assumed** | May be embedded in detail response |
| Group contribution summary | `collection_contribution_summary` field | **assumed** | Mapper supports snake/camel variants |
| Payment Ready readiness | `GET /api/v1/readiness/payment-ready` | **assumed** | May also appear nested on SecureLink |
| Payment Ready field alias | `collection_payment_ready_readiness` | **assumed** | Mapper handles nested variant |
| Account readiness | `GET /api/v1/readiness/account` | **assumed** | Settlement readiness fields unverified |
| Activity / transaction history | `GET /api/v1/activity/transactions` | **assumed** | Activity label vocabulary unverified |
| Evidence list | `GET /api/v1/secure-links/{slug}/evidence` | **missing** | Staging API function exists; **UI not wired** until confirmed |
| Evidence detail | `GET /api/v1/secure-links/{slug}/evidence/{id}` | **missing** | Not implemented — no source evidence |
| Draft create SecureLink | `POST /api/v1/secure-links/drafts` | **future** | Blocked — mobile drafts remain local mock |
| Draft create Group SecureLink | `POST /api/v1/secure-links/group/drafts` | **future** | Blocked |
| Webhook complete | `/api/v1/webhooks/complete` | **blocked** | Must never be called from mobile |
| Payment complete | `/api/v1/payment-complete` | **blocked** | Must never be called from mobile |
| Provider confirmation | `/api/v1/provider-confirmation` | **blocked** | Must never be called from mobile |
| Ledger posting | `/api/v1/ledger/posting` | **blocked** | Must never be called from mobile |
| Release | `/api/v1/release` | **blocked** | Must never be called from mobile |
| Withdrawal | `/api/v1/withdrawal` | **blocked** | Must never be called from mobile |
| Payout / auto-payout | `/api/v1/payout`, `/api/v1/auto-payout` | **blocked** | Must never be called from mobile |
| Choice transfer | `/api/v1/choice-bank/transfer` | **blocked** | Must never be called from mobile |
| Settlement trigger | `/api/v1/settlement` | **blocked** | Must never be called from mobile |
| Internal routes | `/internal/*` | **blocked** | Must never be called from mobile |
| Internal secure-link ops | `/internal/secure-link` | **blocked** | Added Phase 5 forbidden list |

## Confirmed routes (Phase 5)

**None.** Securepaymain/OpenAPI source was not available locally.

## Confirmation workflow

1. Clone or mount Securepaymain beside mobile repo (`../Securepaymain`).
2. Search OpenAPI/Swagger, controllers, and gateway route tables.
3. For each **assumed** row, verify path, method, auth, and response shape.
4. Move verified routes to `confirmedReadEndpoints` / `confirmedAuthEndpoints` in `src/api/endpoints.ts`.
5. Update this checklist status to **confirmed** with source file reference.
6. Re-run `npm run check:api-contract`, `npm run check:ui-safety`, and optional `npm run smoke:staging-readonly`.

## Cloud Agent safety

Do not use real staging tokens or production credentials when running Cloud Agents. Use placeholder URLs and demo credentials only.
