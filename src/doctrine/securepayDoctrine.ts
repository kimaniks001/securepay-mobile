export const BRAND = {
  name: 'SecurePay',
  byline: 'SecurePay by Keyman',
  coreLine: 'Money should follow the agreement.',
  tone: ['Quiet Trust', 'Simple', 'Kenyan', 'Mobile-first', 'Agreement-backed'] as const,
} as const;

export const forbiddenPublicTerms = [
  'escrow',
  'frozen',
  'custody',
  'custodial',
  'guaranteed payout',
  'instant release',
  'withdraw now',
  'cash out now',
  'fake payment complete',
  'settled',
  'paid',
  'withdraw',
  'cash out',
  'release funds',
  'payout now',
  'available balance',
  'send money',
  'confirm payment',
  'payment complete',
  'payment successful',
] as const;

export const safeMoneyStateLabels = {
  demoBalance: 'Demo balance',
  agreementReadiness: 'Agreement readiness',
  walletPlaceholder: 'SecurePay Wallet placeholder',
  notForWithdrawal: 'Not available for withdrawal',
  noLiveMoney: 'No live money movement in this build',
  agreementControlled: 'Agreement-controlled amount',
  providerConfirmed: 'Provider-confirmed',
  providerPending: 'Provider confirmation pending',
  paymentReadyReadiness: 'Payment Ready readiness',
  reviewHold: 'Review hold',
  settlementReadiness: 'Settlement readiness',
  ledgerReadinessPending: 'Ledger readiness pending',
} as const;

export const disabledMoneyActions = [
  'withdrawal',
  'payout',
  'release',
  'provider confirmation from phone',
  'direct gateway payment success',
  'Choice Bank transfer',
  'ledger posting from mobile',
] as const;

export type DisabledMoneyAction = (typeof disabledMoneyActions)[number];

export const feeDoctrine = {
  welfareGroupSecureLink: {
    label: 'Welfare Group SecureLink',
    feeKes: 10,
    description: 'KES 10 per contribution',
  },
  generalGroupSecureLink: {
    label: 'General Group SecureLink',
    feeKes: 20,
    description: 'KES 20 per contribution',
  },
  businessSolutionContribution: {
    label: 'Business solution contribution',
    feeKes: 20,
    description: 'KES 20 per contribution',
  },
} as const;

export const mobileSafetyRules = [
  'This app is a mobile client only.',
  'Backend money logic stays on the SecurePay API Gateway.',
  'No direct payment gateway integration from the phone.',
  'No direct Stripe, 2C2P, M-Pesa, PesaLink, or Choice Bank integration.',
  'No direct Supabase or ledger access from the phone.',
  'No fake payment success or provider confirmation from mobile.',
  'All money state changes require backend provider confirmation.',
] as const;

export const SAFE_NOTICE_DEFAULT =
  'SecurePay backend remains the source of truth. This mobile app does not confirm payments, release money, withdraw funds, or move money directly.';

export const STAGING_DEMO_WARNING =
  'Demo / staging build only. No live money movement. SecurePay Wallet is a placeholder until backend integration.';
