import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Screen } from '../../src/components/Screen';
import { MOCK_TRANSACTIONS, statusColor } from '../../src/constants/app';
import { colors, spacing, typography } from '../../src/constants/theme';
import { formatCurrency, formatRelativeDate } from '../../src/utils/format';

export default function HistoryScreen() {
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Transaction history</Text>
          <Text style={styles.subtitle}>Mock data for the initial app shell.</Text>
        </View>

        {MOCK_TRANSACTIONS.map((transaction) => (
          <View key={transaction.id} style={styles.row}>
            <View style={styles.rowMain}>
              <Text style={styles.name}>{transaction.recipient}</Text>
              <Text style={styles.note}>{transaction.note ?? 'No note'}</Text>
              <Text style={styles.meta}>{formatRelativeDate(transaction.createdAt)}</Text>
            </View>
            <View style={styles.rowAside}>
              <Text style={styles.amount}>
                -{formatCurrency(transaction.amount, transaction.currency)}
              </Text>
              <Text style={[styles.status, { color: statusColor[transaction.status] }]}>
                {transaction.status}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  header: {
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.title,
    color: colors.text,
    fontSize: 30,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  row: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  rowMain: {
    flex: 1,
    gap: 2,
  },
  rowAside: {
    alignItems: 'flex-end',
    gap: 4,
  },
  name: {
    ...typography.label,
    color: colors.text,
  },
  note: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  meta: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  amount: {
    ...typography.label,
    color: colors.text,
  },
  status: {
    ...typography.caption,
    textTransform: 'capitalize',
    fontWeight: '600',
  },
});
