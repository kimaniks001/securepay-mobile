import { useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { colors, spacing, typography } from '../../src/constants/theme';
import { useAuth } from '../../src/hooks/useAuth';
import { getBiometricCapability } from '../../src/services/biometrics';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  async function showSecurityStatus() {
    const capability = await getBiometricCapability();
    Alert.alert(
      'Device security',
      [
        `Hardware: ${capability.hasHardware ? 'Available' : 'Unavailable'}`,
        `Enrolled: ${capability.isEnrolled ? 'Yes' : 'No'}`,
        `Ready for SecurePay: ${capability.isAvailable ? 'Yes' : 'No'}`,
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
          <Text style={styles.subtitle}>Manage your account and security settings.</Text>
        </View>

        <Card title={user?.name ?? 'SecurePay User'} subtitle={user?.email}>
          <InfoRow label="Phone" value={user?.phone ?? 'Not set'} />
          <InfoRow label="User ID" value={user?.id ?? '—'} />
        </Card>

        <Card title="Security" subtitle="Phase 1 capabilities">
          <InfoRow label="Session storage" value="Expo SecureStore (keychain)" />
          <InfoRow label="Biometric unlock" value="Face ID / fingerprint ready" />
          <InfoRow label="Backend" value="Not connected yet" />
        </Card>

        <View style={styles.actions}>
          <Button label="Check Device Security" variant="secondary" onPress={showSecurityStatus} />
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
  },
  actions: {
    gap: spacing.sm,
  },
});
