import { useRouter } from 'expo-router';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { SafeNotice } from '../../src/components/SafeNotice';
import { Screen } from '../../src/components/Screen';
import { STAGING_DEMO_WARNING } from '../../src/doctrine/securepayDoctrine';
import { colors, spacing, typography } from '../../src/constants/theme';
import { useAuth } from '../../src/hooks/useAuth';
import { useAccountReadiness, useKSNumberProfile } from '../../src/hooks/useSecurePayApi';
import { getBiometricCapability } from '../../src/services/biometrics';
import { isMockMode } from '../../src/api/config';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const profile = useKSNumberProfile();
  const readiness = useAccountReadiness();

  async function showSecurityStatus() {
    const capability = await getBiometricCapability();
    Alert.alert(
      'Device security',
      [
        `Hardware: ${capability.hasHardware ? 'Available' : 'Unavailable'}`,
        `Enrolled: ${capability.isEnrolled ? 'Yes' : 'No'}`,
        `Biometric login: ${capability.isAvailable ? 'Ready' : 'Not ready'}`,
        `Secure storage: Expo SecureStore (keychain)`,
        `API mode: ${isMockMode() ? 'mock (default)' : 'configured'}`,
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
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>KSNumber, readiness, and device security.</Text>
          <Text style={styles.demoWarning}>{STAGING_DEMO_WARNING}</Text>
        </View>

        <SafeNotice compact />

        <Card title={user?.name ?? 'SecurePay user'} subtitle={user?.email}>
          <InfoRow label="KSNumber" value={profile.data?.ksNumber ?? user?.ksNumber ?? 'Placeholder'} />
          <InfoRow label="Phone" value={user?.phone ?? 'Not set'} />
          <InfoRow label="Build" value="Demo / staging" />
        </Card>

        <Card title="Readiness" subtitle="From mock SecurePay API adapter">
          {readiness.loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <>
              <InfoRow label="Account readiness" value={readiness.data?.label ?? '—'} />
              <InfoRow
                label="Settlement readiness"
                value={readiness.data?.settlementReadiness.replaceAll('_', ' ') ?? '—'}
              />
              <InfoRow
                label="Payment Ready readiness"
                value={readiness.data?.paymentReadyReadiness.label ?? '—'}
              />
              <Button
                label="Account readiness detail"
                variant="secondary"
                onPress={() => router.push('/readiness/account')}
              />
              <Button
                label="Payment Ready readiness detail"
                variant="ghost"
                onPress={() => router.push('/readiness/payment-ready')}
              />
            </>
          )}
        </Card>

        <Card title="Device security" subtitle="Local session only">
          <InfoRow label="Secure storage" value="Expo SecureStore (keychain)" />
          <InfoRow label="Biometric login" value="Available when enrolled" />
          <InfoRow label="Backend connection" value="Mock API only (Phase 2)" />
        </Card>

        <View style={styles.actions}>
          <Button label="Check device security" variant="secondary" onPress={showSecurityStatus} />
          <Button label="Sign Out" variant="danger" onPress={handleSignOut} />
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
  title: {
    ...typography.title,
    color: colors.text,
    fontSize: 30,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  demoWarning: {
    ...typography.caption,
    color: colors.warning,
    lineHeight: 18,
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
