# SecurePay Mobile

**SecurePay by Keyman** — *Money should follow the agreement.*

Cross-platform mobile client for SecurePay, built with **Expo SDK 57** and **React Native**. This app is a **mobile client only**. It does not implement backend money logic and communicates with SecurePay exclusively through the **SecurePay API Gateway** in future phases.

## Phase summary

| Phase | Scope |
| --- | --- |
| **1 (merged)** | Expo shell, Welcome/Login/Home/Pay/History/Profile, secure storage, biometrics, mock balance |
| **2 (current)** | Doctrine alignment, API adapter foundation, SecureLink domain types, mock API, safe copy |
| **3 (next)** | Live SecurePay API Gateway integration (staging), authenticated API calls, sync |
| **4** | Production hardening, audit, app store release |

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

## What this app does NOT do

- No real payments or fake payment success
- No withdrawal, payout, or release actions on mobile
- No direct Stripe, 2C2P, M-Pesa, PesaLink, or Choice Bank integration
- No direct Supabase or ledger access
- No production API URL by default
- No committed secrets or `.env` files

## API mode

| Mode | Default | Behavior |
| --- | --- | --- |
| `mock` | **Yes** | All API calls return local mock data |
| `staging` | No | Reserved for Phase 3 — requires `EXPO_PUBLIC_SECUREPAY_API_BASE_URL` |
| `production` | Disabled | Blocked unless explicitly configured in a future phase |

Optional environment variables (not committed):

```bash
# .env.local (create locally — never commit)
EXPO_PUBLIC_SECUREPAY_API_MODE=mock
# EXPO_PUBLIC_SECUREPAY_API_BASE_URL=https://staging-api.securepay.example
```

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
```

## Project structure

```
app/
  (tabs)/               # Home, SecureLinks, Actions, Activity, Profile
  securelink/           # Detail, create, create-group
  readiness/            # Account & Payment Ready readiness
  welcome.tsx
  login.tsx
src/
  api/                  # SecurePay API adapter (mock default)
  doctrine/             # SecurePay doctrine constants
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
