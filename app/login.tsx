import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../src/components/AppButton';
import { Input } from '../src/components/Input';
import { SafeNotice } from '../src/components/SafeNotice';
import { Screen } from '../src/components/Screen';
import { ScreenHeader } from '../src/components/ScreenHeader';
import { SecurePayLogoMark } from '../src/components/SecurePayLogoMark';
import { BRAND, STAGING_DEMO_WARNING } from '../src/doctrine/securepayDoctrine';
import { colors, spacing, typography } from '../src/theme';
import { useAuth } from '../src/hooks/useAuth';
import { authenticateWithBiometrics, getBiometricCapability } from '../src/services/biometrics';
import { isValidEmail, isValidPin } from '../src/utils/validation';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('demo@securepay.app');
  const [pin, setPin] = useState('');
  const [errors, setErrors] = useState<{ email?: string; pin?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSignIn() {
    const nextErrors: { email?: string; pin?: string } = {};

    if (!isValidEmail(email)) {
      nextErrors.email = 'Enter a valid email address';
    }
    if (!isValidPin(pin)) {
      nextErrors.pin = 'PIN must be 4–6 digits';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      await signIn(email, pin);
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Sign in failed', 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleBiometricSignIn() {
    const capability = await getBiometricCapability();
    if (!capability.isAvailable) {
      Alert.alert(
        'Biometrics unavailable',
        'Enable Face ID, Touch ID, or fingerprint unlock on this device.',
      );
      return;
    }

    const authenticated = await authenticateWithBiometrics('Unlock SecurePay demo session');
    if (!authenticated) return;

    setSubmitting(true);
    try {
      await signIn('demo@securepay.app', '1234');
      router.replace('/(tabs)');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen style={styles.screen}>
      <SecurePayLogoMark size="md" />
      <ScreenHeader title="Continue in demo mode" subtitle="Sign in to explore SecurePay on mobile." />
      <Text style={styles.coreLine}>{BRAND.coreLine}</Text>
      <Text style={styles.demoWarning}>{STAGING_DEMO_WARNING}</Text>

      <View style={styles.form}>
        <Input label="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} error={errors.email} />
        <Input label="PIN" value={pin} onChangeText={setPin} keyboardType="number-pad" secureTextEntry maxLength={6} error={errors.pin} />
      </View>

      <View style={styles.actions}>
        <SafeNotice compact />
        <AppButton label={submitting ? 'Signing in...' : 'Continue in demo mode'} disabled={submitting} onPress={handleSignIn} />
        <AppButton label="Use biometrics" variant="secondary" disabled={submitting} onPress={handleBiometricSignIn} />
        <Text style={styles.hint}>Demo PIN: any 4–6 digits. No live money movement.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { justifyContent: 'space-between', paddingVertical: spacing.xl, gap: spacing.lg },
  coreLine: { ...typography.heading, color: colors.primary, fontSize: 17 },
  demoWarning: { ...typography.caption, color: colors.warning, lineHeight: 18 },
  form: { gap: spacing.lg },
  actions: { gap: spacing.sm },
  hint: { ...typography.caption, color: colors.textMuted, textAlign: 'center' },
});
