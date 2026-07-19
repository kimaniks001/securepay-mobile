import { ActivityIndicator, ScrollView, StyleSheet, Text } from 'react-native';

import { AppCard } from '../../src/components/AppCard';
import { ReadinessPanel } from '../../src/components/ReadinessPanel';
import { SafeNotice } from '../../src/components/SafeNotice';
import { Screen } from '../../src/components/Screen';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { readinessJourney } from '../../src/doctrine/mobileJourneyMap';
import { safeReadinessLabels } from '../../src/doctrine/publicSiteReference';
import { colors, spacing, typography } from '../../src/theme';
import { usePaymentReadyReadiness } from '../../src/hooks/useSecurePayApi';

const readinessLabels = safeReadinessLabels;

export default function PaymentReadyReadinessScreen() {
  const readiness = usePaymentReadyReadiness();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Payment Ready readiness" subtitle="Readiness only — not payout" />
        <SafeNotice />

        {readiness.loading || !readiness.data ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <>
            <ReadinessPanel
              title="Payment Ready readiness"
              items={[
                {
                  label: 'Status',
                  value: readiness.data.label,
                  state: readiness.data.status,
                  explanation: readiness.data.summary,
                },
                {
                  label: 'Staging review',
                  value: readiness.data.readyForStagingReviewOnly ? 'Ready for staging review' : 'Not ready',
                },
              ]}
            />
            <AppCard title="Allowed readiness labels" subtitle="Safe mobile vocabulary">
              {readinessLabels.map((label) => (
                <Text key={label} style={styles.labelItem}>• {label}</Text>
              ))}
            </AppCard>
            <AppCard muted>
              <Text style={styles.body}>{readinessJourney.steps[0].explanation}</Text>
              <Text style={styles.body}>
                Payment Ready readiness does not mean money has moved. Provider-confirmed status must
                come from the SecurePay API Gateway.
              </Text>
            </AppCard>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg, paddingVertical: spacing.lg, paddingBottom: spacing.xxl },
  body: { ...typography.caption, color: colors.textSecondary, lineHeight: 20 },
  labelItem: { ...typography.caption, color: colors.textSecondary, lineHeight: 20 },
});
