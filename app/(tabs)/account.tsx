import { useRouter } from 'expo-router';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../../src/components/AppButton';
import { AppCard } from '../../src/components/AppCard';
import { ReadinessPanel } from '../../src/components/ReadinessPanel';
import { SafeNotice } from '../../src/components/SafeNotice';
import { Screen } from '../../src/components/Screen';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { STAGING_DEMO_WARNING } from '../../src/doctrine/securepayDoctrine';
import { isMockMode } from '../../src/api/config';
import { colors, spacing, typography } from '../../src/theme';
import { useAuth } from '../../src/hooks/useAuth';
import { useAccountReadiness, useKSNumberProfile } from '../../src/hooks/useSecurePayApi';
import { getBiometricCapability } from '../../src/services/biometrics';

export default function AccountScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const profile = useKSNumberProfile();
  const readiness = useAccountReadiness();

  async function showSecurityStatus() {
    const capability = await getBiometricCapability();
    Alert.alert(
      'Device security',
      [
        `Biometric login: ${capability.isAvailable ? 'Ready' : 'Not ready'}`,
        `Secure storage: Expo SecureStore (keychain)`,
        `Environment mode: ${isMockMode() ? 'mock (default)' : 'configured'}`,
      ].join('\n'),
    );
  }

  async function handleSignOut() {
    await signOut();
    router.replace('/welcome');
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Account"
          subtitle="KSNumber, readiness, and device security."
        />
        <Text style={styles.demoWarning}>{STAGING_DEMO_WARNING}</Text>

        <SafeNotice compact />

        <AppCard title={user?.name ?? 'SecurePay user'} subtitle={user?.email}>
          <InfoRow label="KSNumber" value={profile.data?.ksNumber ?? user?.ksNumber ?? 'Placeholder'} />
          <InfoRow label="Profile status" value="Demo / staging" />
          <InfoRow label="Activation status" value="Placeholder — pending backend" />
        </AppCard>

        {readiness.loading || !readiness.data ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <ReadinessPanel
            title="Readiness"
            subtitle="Backend remains source of truth"
            items={[
              {
                label: 'Settlement readiness',
                value: readiness.data.settlementReadiness.replaceAll('_', ' '),
                state: readiness.data.settlementReadiness,
              },
              {
                label: 'Payment Ready readiness',
                value: readiness.data.paymentReadyReadiness.label,
                state: readiness.data.paymentReadyReadiness.status,
                explanation: readiness.data.paymentReadyReadiness.summary,
              },
              {
                label: 'Account readiness',
                value: readiness.data.label,
                state: readiness.data.status,
                explanation: readiness.data.summary,
              },
            ]}
          />
        )}

        <AppCard title="Agreement Review Reserve" subtitle="Placeholder only">
          <Text style={styles.body}>
            Agreement Review Reserve is a backend concept. This mobile build shows a placeholder
            only. No funds movement.
          </Text>
        </AppCard>

        <AppCard title="SecurePay Wallet" subtitle="Placeholder only">
          <Text style={styles.body}>
            SecurePay Wallet is not live in this build. Not available for withdrawal. No cash-out.
          </Text>
        </AppCard>

        <AppCard title="Device security">
          <InfoRow label="Biometric login" value="Available when enrolled" />
          <InfoRow label="Secure storage" value="Expo SecureStore" />
          <InfoRow label="API mode" value={isMockMode() ? 'mock' : 'configured'} />
        </AppCard>

        <View style={styles.actions}>
          <AppButton label="Account readiness detail" variant="secondary" onPress={() => router.push('/readiness/account')} />
          <AppButton label="Check device security" variant="ghost" onPress={showSecurityStatus} />
          <AppButton label="Sign Out" variant="danger" onPress={handleSignOut} />
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
  demoWarning: {
    ...typography.caption,
    color: colors.warning,
    lineHeight: 18,
  },
  body: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.xs,
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
    textTransform: 'capitalize',
  },
  actions: {
    gap: spacing.sm,
  },
});
