import { apiFailure } from './apiErrors';

export type MobileAction =
  | 'create_payment_success'
  | 'provider_confirmation'
  | 'release'
  | 'withdrawal'
  | 'payout'
  | 'ledger_posting'
  | 'choice_transfer'
  | 'mpesa_direct_call'
  | 'pesalink_direct_call'
  | 'direct_wallet_transfer'
  | 'internal_webhook_complete'
  | 'internal_ledger_posting';

export type BlockedMobileAction = MobileAction;

const BLOCKED_ACTIONS = new Set<MobileAction>([
  'create_payment_success',
  'provider_confirmation',
  'release',
  'withdrawal',
  'payout',
  'ledger_posting',
  'choice_transfer',
  'mpesa_direct_call',
  'pesalink_direct_call',
  'direct_wallet_transfer',
  'internal_webhook_complete',
  'internal_ledger_posting',
]);

const SAFE_BLOCKED_MESSAGE =
  'This action is controlled by SecurePay backend and is not available from the mobile app.';

export function isBlockedMobileAction(action: MobileAction): boolean {
  return BLOCKED_ACTIONS.has(action);
}

export function guardMobileAction(action: MobileAction) {
  if (!isBlockedMobileAction(action)) {
    return { allowed: true as const };
  }
  return {
    allowed: false as const,
    result: apiFailure('unsupported_action', SAFE_BLOCKED_MESSAGE),
  };
}

export function assertReadOnlyMobileAction(action: MobileAction): void {
  const guard = guardMobileAction(action);
  if (!guard.allowed) {
    throw new Error(SAFE_BLOCKED_MESSAGE);
  }
}
