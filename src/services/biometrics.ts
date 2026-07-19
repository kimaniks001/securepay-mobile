import * as LocalAuthentication from 'expo-local-authentication';

export type BiometricCapability = {
  isAvailable: boolean;
  hasHardware: boolean;
  isEnrolled: boolean;
  supportedTypes: LocalAuthentication.AuthenticationType[];
};

export async function getBiometricCapability(): Promise<BiometricCapability> {
  const [hasHardware, isEnrolled, supportedTypes] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
    LocalAuthentication.supportedAuthenticationTypesAsync(),
  ]);

  return {
    isAvailable: hasHardware && isEnrolled,
    hasHardware,
    isEnrolled,
    supportedTypes,
  };
}

export async function authenticateWithBiometrics(
  promptMessage = 'Unlock SecurePay',
): Promise<boolean> {
  const capability = await getBiometricCapability();
  if (!capability.isAvailable) {
    return false;
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage,
    cancelLabel: 'Cancel',
    disableDeviceFallback: false,
  });

  return result.success;
}
