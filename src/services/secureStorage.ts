import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const KEYS = {
  authToken: 'securepay.auth.token',
  userProfile: 'securepay.auth.profile',
} as const;

// Web fallback using localStorage
const webStorage = {
  setItem: async (key: string, value: string): Promise<void> => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  },
  getItem: async (key: string): Promise<string | null> => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return null;
  },
  deleteItem: async (key: string): Promise<void> => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  },
};

export async function saveAuthToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    await webStorage.setItem(KEYS.authToken, token);
  } else {
    await SecureStore.setItemAsync(KEYS.authToken, token, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  }
}

export async function getAuthToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return webStorage.getItem(KEYS.authToken);
  }
  return SecureStore.getItemAsync(KEYS.authToken);
}

export async function saveUserProfile(profile: string): Promise<void> {
  if (Platform.OS === 'web') {
    await webStorage.setItem(KEYS.userProfile, profile);
  } else {
    await SecureStore.setItemAsync(KEYS.userProfile, profile, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  }
}

export async function getUserProfile(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return webStorage.getItem(KEYS.userProfile);
  }
  return SecureStore.getItemAsync(KEYS.userProfile);
}

export async function clearSecureSession(): Promise<void> {
  if (Platform.OS === 'web') {
    await Promise.all([
      webStorage.deleteItem(KEYS.authToken),
      webStorage.deleteItem(KEYS.userProfile),
    ]);
  } else {
    await Promise.all([
      SecureStore.deleteItemAsync(KEYS.authToken),
      SecureStore.deleteItemAsync(KEYS.userProfile),
    ]);
  }
}
