import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Button } from '../src/components/Button';
import { Input } from '../src/components/Input';
import { Screen } from '../src/components/Screen';
import { colors, spacing, typography } from '../src/constants/theme';
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
        'Enable Face ID, Touch ID, or fingerprint unlock on this device to use this option.',
      );
      return;
    }

    const authenticated = await authenticateWithBiometrics('Sign in to SecurePay');
    if (!authenticated) {
      return;
    }

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
      <View style={styles.header}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to access your SecurePay wallet.</Text>
      </View>

      <View style={styles.form}>
        <Input
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          label="Email"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
        />
        <Input
          label="PIN"
          value={pin}
          onChangeText={setPin}
          keyboardType="number-pad"
          secureTextEntry
          maxLength={6}
          error={errors.pin}
        />
      </View>

      <View style={styles.actions}>
        <Button label={submitting ? 'Signing in...' : 'Sign In'} disabled={submitting} onPress={handleSignIn} />
        <Button
          label="Use Biometrics"
          variant="secondary"
          disabled={submitting}
          onPress={handleBiometricSignIn}
        />
        <Text style={styles.hint}>Demo PIN: any 4–6 digit code works in Phase 1.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'space-between',
    paddingVertical: spacing.xl,
  },
  header: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  form: {
    gap: spacing.lg,
  },
  actions: {
    gap: spacing.sm,
  },
  hint: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
