import { StyleSheet, Text, View } from 'react-native';

import type { MoneyStateLabel } from '../api/types';
import { safeMoneyStateLabels } from '../doctrine/securepayDoctrine';
import { colors, spacing, typography } from '../theme';
import { formatCurrency } from '../utils/format';
import { MoneyStateStatusBadge } from './StatusBadge';

type MoneyStateCardProps = {
  title: string;
  amount?: number;
  currency?: 'KES';
  state: MoneyStateLabel;
  subtitle?: string;
  placeholder?: boolean;
};

export function MoneyStateCard({
  title,
  amount,
  currency = 'KES',
  state,
  subtitle,
  placeholder = false,
}: MoneyStateCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.overline}>
        {placeholder ? safeMoneyStateLabels.demoBalance : 'Agreement'}
      </Text>
      <Text style={styles.title}>{title}</Text>
      {amount !== undefined ? (
        <Text style={styles.amount}>{formatCurrency(amount, currency)}</Text>
      ) : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <MoneyStateStatusBadge state={state} />
      {placeholder ? (
        <Text style={styles.placeholderNote}>{safeMoneyStateLabels.notForWithdrawal}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
  },
  overline: {
    ...typography.overline,
    color: colors.textMuted,
  },
  title: {
    ...typography.heading,
    color: colors.text,
  },
  amount: {
    ...typography.title,
    color: colors.primary,
    fontSize: 32,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  placeholderNote: {
    ...typography.caption,
    color: colors.warning,
  },
});
