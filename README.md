# SecurePay Mobile

SecurePay is a cross-platform mobile wallet app built with **Expo SDK 57** and **React Native**. This repository contains **Phase 1**: the initial app shell with navigation, authentication flow, secure storage, biometric hooks, and core payment screens.

## Features (Phase 1)

- **Welcome & sign-in flow** with email + PIN validation
- **Biometric authentication** via `expo-local-authentication`
- **Encrypted session storage** via `expo-secure-store` (device keychain)
- **Tab navigation**: Home, Pay, History, Profile
- **Payment screen** with amount validation and biometric confirmation
- **Dark fintech UI** with reusable components and theme tokens
- **Mock data** for balance and transactions until backend integration

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | Expo 57 + React Native 0.86 |
| Language | TypeScript |
| Navigation | Expo Router (file-based) |
| Secure storage | expo-secure-store |
| Biometrics | expo-local-authentication |

## Getting Started

### Prerequisites

- Node.js 22.13+
- npm 10+
- [Expo Go](https://expo.dev/go) on a physical device, or Android/iOS simulator

### Install & run

```bash
npm install
npm start
```

Then press:

- `a` for Android emulator
- `i` for iOS simulator (macOS only)
- Scan the QR code with Expo Go on your phone

### Type check

```bash
npm run typecheck
```

## Project Structure

```
app/                    # Expo Router screens
  (tabs)/               # Authenticated tab navigator
  welcome.tsx           # Marketing / onboarding
  login.tsx             # Sign-in screen
src/
  components/           # UI primitives (Button, Input, Card, Screen)
  constants/            # Theme tokens and mock data
  hooks/                # Auth context and hooks
  services/             # Secure storage & biometrics
  types/                # Shared TypeScript types
  utils/                # Validation and formatting helpers
```

## Demo Credentials

Phase 1 uses a local demo session — no backend is required:

- **Email:** any valid email (default `demo@securepay.app`)
- **PIN:** any 4–6 digit code
- **Biometrics:** works when enrolled on the device

## Security Notes

- Auth tokens and profile data are stored with `WHEN_UNLOCKED_THIS_DEVICE_ONLY`.
- Payment confirmation requires biometric authentication when available.
- Card validation utilities (Luhn check) are included for future card flows.
- **No real payments** are processed in Phase 1.

## Roadmap

| Phase | Scope |
| --- | --- |
| **1 (current)** | App shell, auth UX, secure storage, mock data |
| 2 | Backend API integration, real auth, transaction sync |
| 3 | Payment gateway (e.g. Stripe / 2C2P), KYC, push notifications |
| 4 | Production hardening, audit, app store release |

## License

Private — all rights reserved.
