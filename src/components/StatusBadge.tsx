import { StyleSheet, Text, View } from 'react-native';

import type { MoneyStateLabel } from '../api/types';
import { colors, radius, spacing, typography } from '../theme';
import { getMoneyStateColor, getMoneyStateLabel } from '../utils/moneyState';

type StatusBadgeTone = 'default' | MoneyStateLabel;

type StatusBadgeProps = {
  label: string;
  tone?: StatusBadgeTone;
  explanation?: string;
};

export function StatusBadge({ label, tone = 'default', explanation }: StatusBadgeProps) {
  const color =
    tone === 'default' ? colors.textSecondary : getMoneyStateColor(tone);
  const backgroundColor =
    tone === 'default' ? colors.surfaceMuted : `${color}18`;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.badge, { backgroundColor, borderColor: `${color}33` }]}>
        <Text style={[styles.label, { color }]}>{label}</Text>
      </View>
      {explanation ? <Text style={styles.explanation}>{explanation}</Text> : null}
    </View>
  );
}

export function MoneyStateStatusBadge({
  state,
  explanation,
}: {
  state: MoneyStateLabel;
  explanation?: string;
}) {
  return (
    <StatusBadge
      label={getMoneyStateLabel(state)}
      tone={state}
      explanation={explanation}
    />
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  label: {
    ...typography.caption,
    fontWeight: '600',
  },
  explanation: {
    ...typography.caption,
    color: colors.textMuted,
    lineHeight: 16,
  },
});
