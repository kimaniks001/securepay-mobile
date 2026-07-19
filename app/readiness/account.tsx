import { ActivityIndicator, ScrollView, StyleSheet, Text } from 'react-native';

import { Card } from '../../src/components/Card';
import { SafeNotice } from '../../src/components/SafeNotice';
import { Screen } from '../../src/components/Screen';
import { colors, spacing, typography } from '../../src/constants/theme';
import { useAccountReadiness } from '../../src/hooks/useSecurePayApi';
import { getMoneyStateColor } from '../../src/utils/moneyState';

export default function AccountReadinessScreen() {
  const readiness = useAccountReadiness();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <SafeNotice />
        {readiness.loading || !readiness.data ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <>
            <Card title="Account readiness" subtitle="Mock API · backend is source of truth">
              <Text style={[styles.status, { color: getMoneyStateColor(readiness.data.status) }]}>
                {readiness.data.summary}
              </Text>
              <Text style={styles.meta}>Status: {readiness.data.status.replaceAll('_', ' ')}</Text>
              <Text style={styles.meta}>
                Settlement readiness: {readiness.data.settlementReadiness.replaceAll('_', ' ')}
              </Text>
              <Text style={styles.meta}>
                Updated: {new Date(readiness.data.updatedAt).toLocaleString()}
              </Text>
            </Card>
            <Card title="SecurePay Wallet placeholder">
              <Text style={styles.body}>
                SecurePay Wallet is not live in this build. No withdrawal, payout, or release actions
                are available on mobile.
              </Text>
            </Card>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  status: {
    ...typography.body,
    lineHeight: 22,
  },
  meta: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'capitalize',
  },
  body: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
