# Mobile Staging API Contract Checklist

Use this checklist to confirm Securepaymain backend routes against the mobile client contract.

**Status legend:** `confirmed` · `assumed` · `missing` · `blocked` · `future`

| Endpoint / concern | Mobile constant | Status | Notes |
|--------------------|-----------------|--------|-------|
| Mobile login / session | `POST /api/v1/auth/mobile/login` | **assumed** | TODO: confirm with Securepaymain auth module |
| Session refresh | `POST /api/v1/auth/mobile/refresh` | **assumed** | Refresh token flow not yet validated |
| Session logout | `POST /api/v1/auth/mobile/logout` | **assumed** | Optional server-side invalidation |
| Current session | `GET /api/v1/auth/mobile/session` | **assumed** | May duplicate `/users/me` |
| Current user | `GET /api/v1/users/me` | **assumed** | Requires bearer token |
| KSNumber profile | `GET /api/v1/ksnumber/profile` | **assumed** | Confirm field names: `ks_number`, `display_name` |
| SecureLink list | `GET /api/v1/secure-links` | **assumed** | Confirm pagination wrapper (`items` vs `data`) |
| SecureLink detail | `GET /api/v1/secure-links/{slug}` | **assumed** | Confirm slug param name |
| Group SecureLink detail | `GET /api/v1/secure-links/{slug}/group` | **assumed** | May be embedded in detail response instead |
| Group contribution summary | `collection_contribution_summary` field | **assumed** | Mapper supports snake/camel variants |
| Payment Ready readiness | `GET /api/v1/readiness/payment-ready` | **assumed** | May also appear nested on SecureLink |
| Payment Ready field alias | `collection_payment_ready_readiness` | **assumed** | Mapper handles nested variant |
| Account readiness | `GET /api/v1/readiness/account` | **assumed** | Confirm settlement readiness fields |
| Activity / transaction history | `GET /api/v1/activity/transactions` | **assumed** | Confirm activity label vocabulary |
| Evidence list | `GET /api/v1/secure-links/{slug}/evidence` | **missing** | Not wired in UI yet — future read-only |
| Draft create SecureLink | `POST /api/v1/secure-links/drafts` | **future** | Blocked in Phase 4 — mobile drafts remain local mock |
| Draft create Group SecureLink | `POST /api/v1/secure-links/group/drafts` | **future** | Blocked in Phase 4 |
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

## Confirmation workflow

1. Obtain Securepaymain OpenAPI or route table from backend team.
2. For each **assumed** row, verify path, method, auth, and response shape.
3. Update `src/api/endpoints.ts` constants when confirmed.
4. Update `src/api/mappers.ts` if field names differ.
5. Mark row **confirmed** in this checklist (do not mark confirmed without backend evidence).
6. Re-run `npm run check:ui-safety` and Account → **Refresh contract status**.

## Cloud Agent safety

Do not use real staging tokens or production credentials when running Cloud Agents. Use placeholder URLs and demo credentials only.
