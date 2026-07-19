import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { MOCK_BALANCE, MOCK_TRANSACTIONS } from '../../src/constants/app';
import { colors, spacing, typography } from '../../src/constants/theme';
import { useAuth } from '../../src/hooks/useAuth';
import { formatCurrency, formatRelativeDate } from '../../src/utils/format';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const recentTransactions = MOCK_TRANSACTIONS.slice(0, 3);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {user?.name.split(' ')[0] ?? 'there'}</Text>
          <Text style={styles.caption}>Your secure wallet overview</Text>
        </View>

        <Card style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available balance</Text>
          <Text style={styles.balanceValue}>{formatCurrency(MOCK_BALANCE)}</Text>
          <View style={styles.balanceActions}>
            <Button label="Send Money" onPress={() => router.push('/(tabs)/pay')} />
            <Button
              label="View History"
              variant="secondary"
              onPress={() => router.push('/(tabs)/history')}
            />
          </View>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent activity</Text>
          {recentTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionRow}>
              <View>
                <Text style={styles.transactionName}>{transaction.recipient}</Text>
                <Text style={styles.transactionMeta}>
                  {formatRelativeDate(transaction.createdAt)} · {transaction.status}
                </Text>
              </View>
              <Text style={styles.transactionAmount}>
                -{formatCurrency(transaction.amount, transaction.currency)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    gap: spacing.xs,
  },
  greeting: {
    ...typography.title,
    color: colors.text,
    fontSize: 30,
  },
  caption: {
    ...typography.body,
    color: colors.textSecondary,
  },
  balanceCard: {
    gap: spacing.md,
    backgroundColor: colors.surfaceElevated,
  },
  balanceLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  balanceValue: {
    ...typography.title,
    color: colors.text,
    fontSize: 36,
  },
  balanceActions: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.text,
  },
  transactionRow: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  transactionName: {
    ...typography.label,
    color: colors.text,
  },
  transactionMeta: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  transactionAmount: {
    ...typography.label,
    color: colors.text,
  },
});
