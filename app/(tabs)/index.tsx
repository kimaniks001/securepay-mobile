import { useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { SafeNotice } from '../../src/components/SafeNotice';
import { Screen } from '../../src/components/Screen';
import { safeMoneyStateLabels, STAGING_DEMO_WARNING } from '../../src/doctrine/securepayDoctrine';
import { colors, spacing, typography } from '../../src/constants/theme';
import { useAuth } from '../../src/hooks/useAuth';
import { useKSNumberProfile, useTransactionHistory } from '../../src/hooks/useSecurePayApi';
import { DEMO_AGREEMENT_READINESS_KES } from '../../src/mocks/mockTransactions';
import { formatCurrency, formatRelativeDate } from '../../src/utils/format';
import { getMoneyStateColor } from '../../src/utils/moneyState';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const profile = useKSNumberProfile();
  const history = useTransactionHistory();
  const recentActivity = history.data?.slice(0, 3) ?? [];

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {user?.name.split(' ')[0] ?? 'there'}</Text>
          <Text style={styles.caption}>Agreement overview · demo / staging</Text>
          <Text style={styles.demoWarning}>{STAGING_DEMO_WARNING}</Text>
        </View>

        <SafeNotice compact />

        <Card style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>{safeMoneyStateLabels.demoBalance}</Text>
          <Text style={styles.balanceValue}>{formatCurrency(DEMO_AGREEMENT_READINESS_KES)}</Text>
          <Text style={styles.balanceHint}>{safeMoneyStateLabels.agreementReadiness}</Text>
          <Text style={styles.balanceHint}>{safeMoneyStateLabels.notForWithdrawal}</Text>
          <Text style={styles.balanceHint}>{safeMoneyStateLabels.noLiveMoney}</Text>
          <View style={styles.balanceActions}>
            <Button label="SecureLinks" onPress={() => router.push('/(tabs)/securelinks')} />
            <Button
              label="SecureLink actions"
              variant="secondary"
              onPress={() => router.push('/(tabs)/pay')}
            />
            <Button
              label="Activity"
              variant="ghost"
              onPress={() => router.push('/(tabs)/history')}
            />
          </View>
        </Card>

        <Card title="KSNumber" subtitle="Placeholder profile from mock API">
          {profile.loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <>
              <InfoRow label="KSNumber" value={profile.data?.ksNumber ?? user?.ksNumber ?? '—'} />
              <InfoRow label="Account readiness" value={profile.data?.accountReadiness.label ?? '—'} />
              <Button
                label="View account readiness"
                variant="secondary"
                onPress={() => router.push('/readiness/account')}
              />
            </>
          )}
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent activity</Text>
          {history.loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            recentActivity.map((item) => (
              <View key={item.id} style={styles.transactionRow}>
                <View style={styles.transactionMain}>
                  <Text style={styles.transactionName}>{item.title}</Text>
                  <Text style={styles.transactionMeta}>
                    {formatRelativeDate(item.createdAt)} · {item.activityDisplay}
                  </Text>
                </View>
                <View style={styles.transactionAside}>
                  <Text style={styles.transactionAmount}>
                    {formatCurrency(item.agreementControlledAmount, item.currency)}
                  </Text>
                  <Text style={[styles.transactionState, { color: getMoneyStateColor(item.moneyState) }]}>
                    {item.moneyState.replaceAll('_', ' ')}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
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
  demoWarning: {
    ...typography.caption,
    color: colors.warning,
    lineHeight: 18,
  },
  balanceCard: {
    gap: spacing.sm,
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
  balanceHint: {
    ...typography.caption,
    color: colors.textMuted,
  },
  balanceActions: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  infoLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  infoValue: {
    ...typography.caption,
    color: colors.text,
    flexShrink: 1,
    textAlign: 'right',
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
    gap: spacing.md,
  },
  transactionMain: {
    flex: 1,
    gap: 2,
  },
  transactionAside: {
    alignItems: 'flex-end',
    gap: 4,
  },
  transactionName: {
    ...typography.label,
    color: colors.text,
  },
  transactionMeta: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  transactionAmount: {
    ...typography.label,
    color: colors.text,
  },
  transactionState: {
    ...typography.caption,
    textTransform: 'capitalize',
  },
});
