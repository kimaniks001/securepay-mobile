import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import {
  canUseStagingLogin,
  describeAuthFailure,
  getAuthModeLabel,
  getStagingAuthUnavailableMessage,
} from '../src/api/authApi';
import { isMockMode } from '../src/api/config';
import { AppButton } from '../src/components/AppButton';
import { Input } from '../src/components/Input';
import { SafeNotice } from '../src/components/SafeNotice';
import { Screen } from '../src/components/Screen';
import { SecurePayLogoMark } from '../src/components/SecurePayLogoMark';
import { BRAND, STAGING_DEMO_WARNING } from '../src/doctrine/securepayDoctrine';
import { PUBLIC_SITE } from '../src/doctrine/publicSiteReference';
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

  const mockMode = isMockMode();
  const stagingLoginReady = canUseStagingLogin();
  const stagingUnavailable = getStagingAuthUnavailableMessage();
  const authModeLabel = getAuthModeLabel();

  const primaryButtonLabel = useMemo(() => {
    if (submitting) return 'Signing in...';
    if (mockMode) return 'Continue in demo mode';
    return 'Sign in with staging credentials';
  }, [mockMode, submitting]);

  async function handleSignIn() {
    const nextErrors: { email?: string; pin?: string } = {};
    if (!isValidEmail(email)) nextErrors.email = 'Enter a valid email address';
    if (!isValidPin(pin)) nextErrors.pin = 'PIN must be 4–6 digits';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (!mockMode && !stagingLoginReady) {
      Alert.alert(
        'Staging sign-in unavailable',
        stagingUnavailable ?? 'Configure staging API environment before signing in.',
      );
      return;
    }

    setSubmitting(true);
    try {
      await signIn(email, pin);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Sign in failed', describeAuthFailure(error));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleBiometricSignIn() {
    if (!mockMode) {
      Alert.alert(
        'Biometrics unavailable in staging mode',
        'Use staging credentials to sign in. Biometric unlock is for demo sessions only.',
      );
      return;
    }

    const capability = await getBiometricCapability();
    if (!capability.isAvailable) {
      Alert.alert('Biometrics unavailable', 'Enable Face ID, Touch ID, or fingerprint on this device.');
      return;
    }
    const authenticated = await authenticateWithBiometrics('Unlock SecurePay demo session');
    if (!authenticated) return;
    setSubmitting(true);
    try {
      await signIn('demo@securepay.app', '1234');
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Sign in failed', describeAuthFailure(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen style={styles.screen}>
      <SecurePayLogoMark size="md" />
      <Text style={styles.coreLine}>{BRAND.coreLine}</Text>
      <Text style={styles.heroSubline}>{PUBLIC_SITE.heroSubline}</Text>
      <Text style={styles.demoBanner}>{PUBLIC_SITE.demoBanner}</Text>
      <Text style={styles.demoWarning}>{STAGING_DEMO_WARNING}</Text>
      <Text style={styles.authMode}>{authModeLabel}</Text>
      {!mockMode && stagingUnavailable ? (
        <Text style={styles.stagingWarning}>{stagingUnavailable}</Text>
      ) : null}

      <View style={styles.form}>
        <Input label="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} error={errors.email} />
        <Input label="PIN" value={pin} onChangeText={setPin} keyboardType="number-pad" secureTextEntry maxLength={6} error={errors.pin} />
      </View>

      <View style={styles.actions}>
        <SafeNotice compact />
        <Text style={styles.hint}>
          Agreement-backed sign-in only. Not bank login. Not wallet activation.
        </Text>
        <AppButton label={primaryButtonLabel} disabled={submitting} onPress={handleSignIn} />
        {mockMode ? (
          <AppButton label="Use biometrics" variant="secondary" disabled={submitting} onPress={handleBiometricSignIn} />
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { justifyContent: 'space-between', paddingVertical: spacing.xl, gap: spacing.md },
  coreLine: { ...typography.heading, color: colors.primary, fontSize: 18 },
  heroSubline: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },
  demoBanner: { ...typography.caption, color: colors.primary, fontWeight: '600' },
  demoWarning: { ...typography.caption, color: colors.warning, lineHeight: 18 },
  authMode: { ...typography.caption, color: colors.textMuted, lineHeight: 18 },
  stagingWarning: { ...typography.caption, color: colors.error, lineHeight: 18 },
  hint: { ...typography.caption, color: colors.textMuted, lineHeight: 18 },
  form: { gap: spacing.lg },
  actions: { gap: spacing.sm },
});
