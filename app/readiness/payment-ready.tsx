import { ActivityIndicator, ScrollView, StyleSheet, Text } from 'react-native';

import { Card } from '../../src/components/Card';
import { SafeNotice } from '../../src/components/SafeNotice';
import { Screen } from '../../src/components/Screen';
import { colors, spacing, typography } from '../../src/constants/theme';
import { usePaymentReadyReadiness } from '../../src/hooks/useSecurePayApi';
import { getMoneyStateColor } from '../../src/utils/moneyState';

export default function PaymentReadyReadinessScreen() {
  const readiness = usePaymentReadyReadiness();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <SafeNotice />
        {readiness.loading || !readiness.data ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Card title="Payment Ready readiness" subtitle="Mock API · provider confirmation required">
            <Text style={[styles.status, { color: getMoneyStateColor(readiness.data.status) }]}>
              {readiness.data.summary}
            </Text>
            <Text style={styles.meta}>Status: {readiness.data.status.replaceAll('_', ' ')}</Text>
            <Text style={styles.meta}>
              Ready for staging review only: {readiness.data.readyForStagingReviewOnly ? 'Yes' : 'No'}
            </Text>
            <Text style={styles.meta}>Backend ready flag: {readiness.data.isReady ? 'Yes' : 'No'}</Text>
            <Text style={styles.body}>
              Payment Ready readiness does not mean money has moved. Provider-confirmed status must
              come from the SecurePay API Gateway.
            </Text>
          </Card>
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
    marginTop: spacing.sm,
  },
});
