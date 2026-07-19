export const PUBLIC_SITE = {
  url: 'https://securepay.securepay4businessdemo.live/',
  title: 'SecurePay.ke — Money Should Follow the Agreement',
  heroLine: 'Money should follow the agreement.',
  heroSubline: 'Make agreements clear. Add evidence when needed. Get approval before money moves.',
  promise: 'Agreement-backed payments for everyday trust.',
  notABank:
    'SecurePay is not a bank. Payments are processed through licensed partners on the backend.',
  demoBanner: 'Demo mode only · No signup · No real money moves',
} as const;

export const publicAgreementSteps = [
  {
    id: 'agree',
    label: 'Agree',
    detail: 'Both sides see the same terms on the SecureLink.',
  },
  {
    id: 'fund',
    label: 'Fund or contribute',
    detail: 'Contributions are recorded through the link — backend confirms.',
  },
  {
    id: 'confirm',
    label: 'Confirm',
    detail: 'Provider confirmation pending until SecurePay backend verifies.',
  },
  {
    id: 'readiness',
    label: 'Readiness review',
    detail: 'Payment Ready and settlement readiness — not payout from mobile.',
  },
] as const;

export const safeReadinessLabels = [
  'Ready for staging review',
  'Not ready',
  'Governance incomplete',
  'Provider confirmation pending',
  'Review hold active',
  'Settlement readiness pending',
  'Ledger posting pending',
] as const;
