import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SafeNotice } from '../../src/components/SafeNotice';
import { Screen } from '../../src/components/Screen';
import { colors, spacing, typography } from '../../src/constants/theme';
import { useTransactionHistory } from '../../src/hooks/useSecurePayApi';
import { formatCurrency, formatRelativeDate } from '../../src/utils/format';
import { getMoneyStateColor } from '../../src/utils/moneyState';

export default function HistoryScreen() {
  const history = useTransactionHistory();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Activity history</Text>
          <Text style={styles.subtitle}>
            Mock SecureLink activity with safe status labels. No release or withdrawal claims.
          </Text>
        </View>

        <SafeNotice compact />

        {history.loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          history.data?.map((item) => (
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
                <Text style={[styles.status, { color: getMoneyStateColor(item.moneyState) }]}>
                  {item.moneyState.replaceAll('_', ' ')}
                </Text>
              </View>
            </View>
          ))
        )}
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
    lineHeight: 22,
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
  activity: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
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
