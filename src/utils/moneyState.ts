import type { MoneyStateLabel } from '../api/types';
import { colors } from '../constants/theme';

export const moneyStateColor: Record<MoneyStateLabel, string> = {
  draft: colors.textMuted,
  awaiting_payment: colors.warning,
  provider_confirmed: colors.success,
  review_hold: colors.warning,
  payment_ready_readiness: colors.primary,
  settlement_readiness_pending: colors.warning,
  agreement_controlled: colors.primary,
  not_ready: colors.textMuted,
  ready_for_staging_review: colors.accent,
};

export function getMoneyStateColor(state: MoneyStateLabel): string {
  return moneyStateColor[state] ?? colors.textSecondary;
}
