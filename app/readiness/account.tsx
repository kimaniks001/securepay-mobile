import { ScrollView, StyleSheet, Text } from 'react-native';

import { ApiStatePanel } from '../../src/components/ApiStatePanel';
import { AppCard } from '../../src/components/AppCard';
import { ReadinessPanel } from '../../src/components/ReadinessPanel';
import { SafeNotice } from '../../src/components/SafeNotice';
import { Screen } from '../../src/components/Screen';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { accountReadinessJourney } from '../../src/doctrine/mobileJourneyMap';
import { safeMoneyStateLabels } from '../../src/doctrine/securepayDoctrine';
import { colors, spacing, typography } from '../../src/theme';
import { useAccountReadiness } from '../../src/hooks/useSecurePayApi';

export default function AccountReadinessScreen() {
  const readiness = useAccountReadiness();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Account readiness" subtitle="Read-only via SecurePay API adapter" />
        <SafeNotice />

        <ApiStatePanel loading={readiness.loading} error={readiness.error} onRetry={readiness.retry}>
          {readiness.data ? (
            <>
              <ReadinessPanel
              title="Account readiness"
              items={[
                { label: 'KSNumber', value: 'KS-2026-0042', explanation: accountReadinessJourney.steps[0].explanation },
                { label: 'Activation status', value: 'Placeholder — pending backend', explanation: accountReadinessJourney.steps[1].explanation },
                { label: 'Settlement readiness', value: readiness.data.settlementReadiness.replaceAll('_', ' '), state: readiness.data.settlementReadiness },
                { label: 'Account readiness', value: readiness.data.label, state: readiness.data.status, explanation: readiness.data.summary },
              ]}
            />
            <AppCard title={safeMoneyStateLabels.walletPlaceholder}>
              <Text style={styles.body}>
                SecurePay Wallet is not live. Not available for withdrawal. Backend controls all money state.
              </Text>
            </AppCard>
            </>
          ) : null}
        </ApiStatePanel>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg, paddingVertical: spacing.lg, paddingBottom: spacing.xxl },
  body: { ...typography.caption, color: colors.textSecondary, lineHeight: 20 },
});
