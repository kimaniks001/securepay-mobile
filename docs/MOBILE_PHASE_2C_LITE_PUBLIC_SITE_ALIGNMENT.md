# Mobile Phase 2C-Lite — Public Site Look-and-Feel Alignment

## A. Objective

Align SecurePay Mobile look, tone, and journey with the **public SecurePay web site** so the app feels like SecurePay in your pocket — without pixel-perfect cloning or unsafe money actions.

This phase uses the live public demo as the visual and tone reference. A later **Mobile Phase 2D** can sync against the local Bolt repo (`Ulyamwisho` / `securepaymain`) for deeper parity.

## B. Public site reference URL

**https://securepay.securepay4businessdemo.live/**

Known title: **SecurePay.ke — Money Should Follow the Agreement**

## C. What can be inferred from the public site

| Element | Inferred for mobile |
| --- | --- |
| Hero | Money should follow the agreement. |
| Subline | Make agreements clear. Add evidence when needed. Get approval before money moves. |
| Identity | SecurePay by Keyman · Trade freely. Fairness built in. |
| Palette | White / warm soft background, trust green, warm orange CTA |
| Layout | Calm cards, readable dark text, subtle borders |
| Flow | Agree → Fund/contribute → Confirm → Readiness (mobile reframes “release” as readiness review) |
| Demo | Demo mode only · No signup · No real money moves |
| Disclaimer | SecurePay is not a bank. Licensed partners on backend. |
| Products | SecureLink, Group SecureLink, fee doctrine, readiness language |

## D. What cannot be confirmed without the Bolt repo

- Exact hex tokens from Tailwind/CSS source
- Component-level spacing grid
- Full page directory and routing map
- Business Solutions sub-product screens
- Developer API docs layout
- Pixel-perfect typography scale

## E. Mobile visual alignment applied

- `src/theme/` refined: warmer white background (`#FFFCF8`), trust green (`#0B6B44`), orange CTA (`#E85D04`)
- Softer card shadows and larger corner radii
- `SecurePayLogoMark` shows **SecurePay.ke**
- `AgreementFlowCard` mirrors public four-step story with safe mobile labels

## F. Journey alignment applied

- Welcome: public hero copy, demo banner, not-a-bank disclaimer, agreement flow card
- Home: SecurePay.ke eyebrow, dashboard cards, agreement flow summary
- Create SecureLink: 5 steps with public-site tone (agreement-first, trust-first)
- Create Group SecureLink: 6 steps with fee doctrine
- Readiness: safe label vocabulary from public site doctrine

## G. Safety doctrine preserved

- No real payments, withdrawal, release, payout, or provider confirmation from mobile
- No direct Stripe / 2C2P / M-Pesa / PesaLink / Choice Bank / Supabase / ledger
- `SafeNotice` on sensitive screens
- `uiTextGuard.ts` and `check:ui-safety` updated
- Public site “release” language reframed as **readiness review** on mobile

## H. Remaining gaps for Phase 2D

- Bolt repo clone and token diff (`npm run wire:web-reference`)
- Pixel-level component parity
- Business Solutions entry points
- “I received a SecurePay Link” receiver flow
- Final logo asset from brand kit

## I. Recommended Mobile Phase 3

1. Staging SecurePay API Gateway (read-only sync)
2. Authenticated sessions from gateway
3. SecureLink detail evidence from backend
4. Push notifications for provider-confirmed status (display only)
5. Phase 2D Bolt repo alignment pass after `securepaymain` is available
