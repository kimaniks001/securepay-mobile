# Mobile Phase 2B — Bolt UI Alignment

## A. Objective

Align SecurePay Mobile look, journey, and wording with the Bolt-built SecurePay web frontend (`kimaniks001/Ulyamwisho`) so the mobile app feels like **SecurePay in your pocket** — not a separate fintech product.

Phase 2B translates web identity into native mobile components while preserving all Phase 2 doctrine safeguards.

## B. Source of truth repos

| Repo | Role |
| --- | --- |
| `kimaniks001/Ulyamwisho` | Visual and journey reference (Bolt web UI) — legacy name |
| `kimaniks001/securepaymain` | Preferred web frontend repo (Option B) |
| `kimaniks001/securepay-mobile` | Expo / React Native mobile client |

**Inspection status:** Web frontend was **not available** during initial Phase 2B. Option B wiring scripts are in place; run after the web repo is pushed.

### Option B — Wire web reference when available

1. Create and push the Bolt frontend to GitHub (preferred repo name: `securepaymain`):

```bash
# On your machine where the Bolt export lives
cd /path/to/Ulyamwisho
git init
git add .
git commit -m "Initial SecurePay web frontend"
gh repo create kimaniks001/securepaymain --public --source=. --remote=origin --push
```

2. From `securepay-mobile`, clone beside mobile and generate alignment report:

```bash
npm run wire:web-reference
```

This will:
- Clone to `reference/securepaymain` (gitignored)
- Write `docs/WEB_MOBILE_ALIGNMENT_REPORT.md` with token/journey/copy diffs

Custom repo URL:

```bash
SECUREPAY_WEB_REPO_URL=https://github.com/<org>/<repo>.git npm run wire:web-reference
```

To inspect locally without scripts:

```bash
git clone https://github.com/kimaniks001/securepaymain.git reference/securepaymain
```

## C. What must match the Bolt web UI

- Brand: **SecurePay by Keyman**
- Core line: **Money should follow the agreement.**
- Tagline: **Trade freely. Fairness built in.**
- Tone: Quiet Trust · Simple · Kenyan · Mobile-first · Agreement-backed
- SecureLink-first language (not wallet / send-money identity)
- Safe money-state labels and status badges
- Fee doctrine (KES 10 welfare / KES 20 general & business)
- Step-based SecureLink and Group SecureLink creation journeys
- Readiness panels (not payout / withdrawal language)
- Green trust primary + warm orange accent palette
- Card-based calm layout

## D. What can adapt for mobile

- Bottom tab navigation (Home, SecureLinks, Create, Activity, Account)
- Single-column stacked cards
- Step wizard screens instead of multi-page web flows
- Touch targets ≥ 52px
- Native `Pressable` / `ScrollView` patterns
- Compact `SafeNotice` on smaller screens

## E. Color / token alignment

Tokens live in `src/theme/`:

| Token | Value | Use |
| --- | --- | --- |
| `primary` | `#166534` | Trust green — headers, active states |
| `accent` | `#EA580C` | Warm orange — CTAs, safety notices |
| `background` | `#F4F7F2` | Soft green-tinted canvas |
| `surface` | `#FFFFFF` | Quiet cards |
| `providerConfirmed` | `#166534` | Provider-confirmed badge |
| `reviewHold` | `#CA8A04` | Review hold |
| `readinessPending` | `#0F766E` | Awaiting / pending readiness |

## F. Component alignment

| Web concept | Mobile component |
| --- | --- |
| Primary button | `AppButton` |
| Card panel | `AppCard` |
| Status chip | `StatusBadge` / `MoneyStateStatusBadge` |
| Money summary | `MoneyStateCard` |
| Page header | `ScreenHeader` |
| Safety banner | `SafeNotice` |
| Wizard step | `StepCard` |
| Fee table | `FeeDoctrineCard` |
| Readiness block | `ReadinessPanel` |
| Logo mark | `SecurePayLogoMark` |

## G. SecureLink journey alignment

Mobile journey (`secureLinkCreateJourney`):

1. Agreement — title, purpose, amount
2. Parties — creator & other KSNumber placeholders
3. Conditions — release, evidence, deadline
4. Preview — draft summary
5. Share — disabled demo placeholder

## H. Group SecureLink journey alignment

Mobile journey (`groupSecureLinkCreateJourney`):

1. Purpose
2. Category (Welfare / General / Business solution)
3. Organizer KSNumber
4. Governance (approvers, minimum approvals)
5. Fee doctrine
6. Preview with readiness note

## I. Readiness panel alignment

Readiness is displayed as **readiness**, never payout:

- Ready for staging review
- Not ready
- Governance incomplete
- Review hold active
- Settlement readiness pending
- Ledger posting pending
- Provider confirmation pending

## J. Safety doctrine preserved

- No real payments, withdrawal, release, or payout from mobile
- No direct Stripe / 2C2P / M-Pesa / PesaLink / Choice Bank / Supabase / ledger
- `SafeNotice` on payment, wallet, readiness, and account surfaces
- `assertSafeUiTextForMobile()` guard in `src/doctrine/uiTextGuard.ts`
- `scripts/check-mobile-ui-safety.mjs` CI-style check
- Mock API mode remains default

## K. Remaining visual gaps

- **Ulyamwisho not inspected** — pixel-level parity pending reference repo access
- Custom SecurePay logo asset (using `SecurePayLogoMark` placeholder)
- Web pricing/help/knowledge pages not mirrored on mobile yet
- Share step is demo-disabled until API Gateway integration
- Dark mode not aligned to web (light-first in 2B)

## L. Recommended Mobile Phase 3

1. Clone and diff against `Ulyamwisho` for pixel/token refinement
2. Connect staging SecurePay API Gateway (read-only sync)
3. Replace mock auth with gateway sessions
4. Sync SecureLink detail evidence and activity from backend
5. Add push notifications for provider-confirmed status (display only)
