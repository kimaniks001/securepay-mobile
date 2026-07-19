import type { MoneyStateLabel } from '../api/types';
import { colors } from '../theme/colors';

export const moneyStateColor: Record<MoneyStateLabel, string> = {
  draft: colors.textMuted,
  awaiting_payment: colors.readinessPending,
  provider_confirmed: colors.providerConfirmed,
  review_hold: colors.reviewHold,
  payment_ready_readiness: colors.primary,
  settlement_readiness_pending: colors.warning,
  agreement_controlled: colors.primary,
  not_ready: colors.textMuted,
  ready_for_staging_review: colors.accent,
};

export const moneyStateDisplayLabel: Record<MoneyStateLabel, string> = {
  draft: 'Draft',
  awaiting_payment: 'Awaiting payment',
  provider_confirmed: 'Provider-confirmed',
  review_hold: 'Review hold',
  payment_ready_readiness: 'Payment Ready readiness',
  settlement_readiness_pending: 'Settlement readiness pending',
  agreement_controlled: 'Agreement-controlled amount',
  not_ready: 'Not ready',
  ready_for_staging_review: 'Ready for staging review',
};

export function getMoneyStateColor(state: MoneyStateLabel): string {
  return moneyStateColor[state] ?? colors.textSecondary;
}

export function getMoneyStateLabel(state: MoneyStateLabel): string {
  return moneyStateDisplayLabel[state] ?? state.replaceAll('_', ' ');
}
