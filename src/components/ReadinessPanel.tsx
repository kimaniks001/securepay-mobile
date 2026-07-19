import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import { MoneyStateStatusBadge } from './StatusBadge';
import type { MoneyStateLabel } from '../api/types';

type ReadinessItem = {
  label: string;
  value: string;
  state?: MoneyStateLabel;
  explanation?: string;
};

type ReadinessPanelProps = {
  title: string;
  subtitle?: string;
  items: ReadinessItem[];
};

export function ReadinessPanel({ title, subtitle, items }: ReadinessPanelProps) {
  return (
    <View style={styles.panel}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {items.map((item) => (
        <View key={item.label} style={styles.row}>
          <View style={styles.rowMain}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
            {item.explanation ? <Text style={styles.explanation}>{item.explanation}</Text> : null}
          </View>
          {item.state ? <MoneyStateStatusBadge state={item.state} /> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: spacing.md,
  },
  title: {
    ...typography.heading,
    color: colors.text,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  row: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  rowMain: {
    gap: 2,
  },
  label: {
    ...typography.overline,
    color: colors.textMuted,
  },
  value: {
    ...typography.label,
    color: colors.text,
    textTransform: 'capitalize',
  },
  explanation: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});
