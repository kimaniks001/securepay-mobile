import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ApiStatePanel } from '../../src/components/ApiStatePanel';
import { SafeNotice } from '../../src/components/SafeNotice';
import { Screen } from '../../src/components/Screen';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { MoneyStateStatusBadge } from '../../src/components/StatusBadge';
import { colors, spacing, typography } from '../../src/theme';
import { useTransactionHistory } from '../../src/hooks/useSecurePayApi';
import { formatCurrency, formatRelativeDate } from '../../src/utils/format';

export default function HistoryScreen() {
  const history = useTransactionHistory();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Activity"
          subtitle="Mock SecureLink activity with safe status labels."
        />

        <SafeNotice compact />

        <ApiStatePanel
          loading={history.loading}
          error={history.error}
          empty={!history.loading && !history.error && !history.data?.length}
          emptyMessage="No activity records yet."
          onRetry={history.retry}
        >
          {history.data?.map((item) => (
            <View key={item.id} style={styles.row}>
              <View style={styles.rowMain}>
                <Text style={styles.name}>{item.title}</Text>
                <Text style={styles.activity}>{item.activityDisplay}</Text>
                <Text style={styles.note}>{item.note ?? 'Agreement-backed activity record'}</Text>
                <Text style={styles.meta}>{formatRelativeDate(item.createdAt)}</Text>
              </View>
              <View style={styles.rowAside}>
                <Text style={styles.amount}>
                  {formatCurrency(item.agreementControlledAmount, item.currency)}
                </Text>
                <MoneyStateStatusBadge state={item.moneyState} />
              </View>
            </View>
          ))}
        </ApiStatePanel>
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
  row: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  rowMain: {
    flex: 1,
    gap: 4,
  },
  rowAside: {
    alignItems: 'flex-end',
    gap: spacing.xs,
    maxWidth: '46%',
  },
  name: {
    ...typography.label,
    color: colors.text,
  },
  activity: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  note: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  meta: {
    ...typography.caption,
    color: colors.textMuted,
  },
  amount: {
    ...typography.label,
    color: colors.text,
  },
});
