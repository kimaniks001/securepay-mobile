# SecurePay Mobile

**SecurePay by Keyman** — *Money should follow the agreement.*

Cross-platform mobile client for SecurePay, built with **Expo SDK 57** and **React Native**. This app is a **mobile client only**. It does not implement backend money logic and communicates with SecurePay exclusively through the **SecurePay API Gateway** in future phases.

## Phase summary

| Phase | Scope |
| --- | --- |
| **1 (merged)** | Expo shell, Welcome/Login/Home/Pay/History/Profile, secure storage, biometrics, mock balance |
| **2 (merged)** | Doctrine alignment, API adapter, mock SecureLinks, readiness screens, safe copy |
| **2B** | Bolt UI alignment — theme, components, journeys, navigation labels |
| **2C-Lite (merged)** | Public site look-and-feel — [securepay.securepay4businessdemo.live](https://securepay.securepay4businessdemo.live/) |
| **3 (current)** | Staging read-only API Gateway integration |
| **4 (next)** | Authenticated staging writes, production hardening, app store release |

## Phase 2 — Doctrine alignment

Phase 2 aligns public UI with SecurePay doctrine:

- **Brand:** SecurePay by Keyman · *Money should follow the agreement.*
- **Tone:** Quiet Trust · Simple · Kenyan · Mobile-first · Agreement-backed
- **Safe terms:** SecureLink, Group SecureLink, Agreement Account, Provider-confirmed, Payment Ready readiness, Review hold, Settlement readiness, KSNumber
- **Forbidden public terms avoided:** escrow, custody, withdraw, cash out, fake payment success, guaranteed payout, etc.

### What Phase 2 adds

- `src/doctrine/securepayDoctrine.ts` — forbidden terms, safe labels, fee doctrine, mobile safety rules
- `src/api/` — mock-first API adapter (`securepayApi`, config, types, mock implementation)
- `src/mocks/` — SecureLink, profile, and activity mock scenarios
- **SecureLinks tab** and detail/create screens
- **Readiness screens** for account and Payment Ready readiness
- **SafeNotice** component on payment, wallet, readiness, and account screens
- Doctrine-safe copy on all Phase 1 screens

## Phase 2B — Bolt UI and mobile journey alignment

Mobile now aligns to the **Bolt web UI** (`kimaniks001/Ulyamwisho`) as the visual and journey reference. Web flows are adapted into native phone screens — not copied as React DOM components.

### What Phase 2B adds

- `docs/MOBILE_PHASE_2B_BOLT_UI_ALIGNMENT.md` — alignment specification
- `src/theme/` — SecurePay green/orange design tokens (trust green + warm orange accent)
- Bolt-aligned components: `AppButton`, `AppCard`, `StatusBadge`, `MoneyStateCard`, `ScreenHeader`, `StepCard`, `FeeDoctrineCard`, `ReadinessPanel`, `SecurePayLogoMark`
- `src/doctrine/mobileJourneyMap.ts` — canonical mobile journeys
- `src/doctrine/uiTextGuard.ts` — `assertSafeUiTextForMobile()` helper
- Step-based Create SecureLink and Create Group SecureLink flows
- Tab labels: **Home · SecureLinks · Create · Activity · Account**
- `npm run check:ui-safety` — lightweight forbidden-term and mock-mode checks

### Still mock / staging only

- No real payments, withdrawal, release, or payout
- No direct provider integration (Stripe, 2C2P, M-Pesa, PesaLink, Choice Bank, Supabase, ledger)
- Backend remains the source of truth

## Phase 2C-Lite — Public site look-and-feel alignment

Mobile aligns to the **public SecurePay site** as visual and tone reference:

**https://securepay.securepay4businessdemo.live/**

### What Phase 2C-Lite adds

- `docs/MOBILE_PHASE_2C_LITE_PUBLIC_SITE_ALIGNMENT.md`
- `src/doctrine/publicSiteReference.ts` — public site copy and safe readiness labels
- Refined `src/theme/` tokens (warmer white, trust green, orange CTA)
- `AgreementFlowCard` — four-step agreement flow (safe mobile labels)
- Welcome/Home copy aligned to SecurePay.ke public identity
- Journey tone updates — agreement-first, trust-first, simple Kenyan mobile

### Not pixel-perfect

Public site is the reference until the Bolt repo (`securepaymain`) is available for Phase 2D local sync.

### Still mock / staging only

- No real payments, withdrawal, release, or payout
- No direct provider integrations
- Backend remains source of truth

## Phase 3 — Staging read-only API Gateway integration

Mobile Phase 3 adds a **read-only staging layer** through the SecurePay API Gateway. The app remains a client only.

### What Phase 3 adds

- `docs/MOBILE_PHASE_3_STAGING_READONLY_API_GATEWAY_INTEGRATION.md`
- `src/api/config.ts` — `mock` / `staging` / `production_disabled` with validation
- `src/api/httpClient.ts` — GET-only gateway client with typed errors
- `src/api/stagingSecurepayApi.ts` — read-only staging reads with mock fallback
- `src/api/endpoints.ts`, `mappers.ts`, `mobileActionGuards.ts`, `sessionStorage.ts`
- `EnvironmentBanner` and `ApiStatePanel` for environment and data states

### Run in mock mode (default)

```bash
npm install
npm start
```

### Run in staging read-only mode

Create `.env.local` (gitignored):

```bash
EXPO_PUBLIC_SECUREPAY_API_MODE=staging
EXPO_PUBLIC_SECUREPAY_API_BASE_URL=https://your-approved-staging-gateway.example
EXPO_PUBLIC_SECUREPAY_ENABLE_API_WRITES=false
EXPO_PUBLIC_SECUREPAY_ALLOW_PRODUCTION_API=false
```

### Cloud Agent / secrets warning

Do **not** provide Cloud Agents with production tokens, staging internal tokens, Choice Bank credentials, database credentials, customer data, real `.env` files, `INTERNAL_TOKEN`, or provider secrets. Use placeholders only.

## What this app does NOT do

- No real payments or fake payment success
- No withdrawal, payout, or release actions on mobile
- No direct Stripe, 2C2P, M-Pesa, PesaLink, or Choice Bank integration
- No direct Supabase or ledger access
- No production API URL by default
- No committed secrets or `.env` files

## API mode

See **Phase 3** above for full environment setup. Summary:

| Mode | Default | Behavior |
| --- | --- | --- |
| `mock` | **Yes** | All API calls return local mock data |
| `staging` | No | Read-only GET via SecurePay API Gateway |
| `production` | Disabled | Blocked in Mobile Phase 3 |

Optional environment variables (not committed) — see `.env.example`.

## Getting started

### Prerequisites

- Node.js 22.13+
- npm 10+
- [Expo Go](https://expo.dev/go) on a device, or Android/iOS simulator

### Install and run

```bash
npm install
npm start
```

### Checks

```bash
npm run typecheck
npm run check:ui-safety
```

## Project structure

```
app/
  (tabs)/               # Home, SecureLinks, Create, Activity, Account
  securelink/           # Detail, step-based create flows
  readiness/            # Account & Payment Ready readiness
  welcome.tsx
  login.tsx
src/
  theme/                # SecurePay design tokens (Phase 2B)
  api/                  # SecurePay API adapter (mock default, staging read-only)
  doctrine/             # Doctrine, journey map, UI text guard
  mocks/                # Mock SecureLinks, profile, transactions
  components/           # UI + SafeNotice
  hooks/                # Auth + API hooks
  services/             # Secure storage & biometrics
  types/                # Shared types
  utils/                # Validation, formatting, money state
```

## Demo credentials

- **Email:** any valid email (default `demo@securepay.app`)
- **PIN:** any 4–6 digit code
- **Biometrics:** when enrolled on device
- **KSNumber:** `KS-2026-0042` (mock)

## Fee doctrine (display only)

| SecureLink type | Fee |
| --- | --- |
| Welfare Group SecureLink | KES 10 per contribution |
| General Group SecureLink | KES 20 per contribution |
| Business solution contribution | KES 20 per contribution |

## Security notes

- Session data stored in Expo SecureStore (`WHEN_UNLOCKED_THIS_DEVICE_ONLY`)
- Biometric unlock for demo session only — not provider confirmation
- Backend remains the source of truth for all money state
- Future backend integration uses **SecurePay API Gateway only**

## License

Private — all rights reserved.
