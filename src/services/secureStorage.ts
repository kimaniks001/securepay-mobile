import * as SecureStore from 'expo-secure-store';

const KEYS = {
  authToken: 'securepay.auth.token',
  userProfile: 'securepay.auth.profile',
} as const;

export async function saveAuthToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(KEYS.authToken, token, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

export async function getAuthToken(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.authToken);
}

export async function saveUserProfile(profile: string): Promise<void> {
  await SecureStore.setItemAsync(KEYS.userProfile, profile, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

export async function getUserProfile(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.userProfile);
}

export async function clearSecureSession(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(KEYS.authToken),
    SecureStore.deleteItemAsync(KEYS.userProfile),
  ]);
}
