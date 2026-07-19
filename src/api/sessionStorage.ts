import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const SESSION_KEY = 'securepay_mobile_session_v1';

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

export type MobileSession = {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  userId?: string;
  ksNumber?: string;
  displayName?: string;
  email?: string;
  authMode?: 'demo' | 'staging';
};

const FORBIDDEN_SESSION_KEY_PATTERNS = [
  /internal[_-]?token/i,
  /choice/i,
  /provider[_-]?secret/i,
  /provider[_-]?credential/i,
  /database[_-]?credential/i,
  /bank[_-]?credential/i,
  /webhook[_-]?secret/i,
  /production[_-]?secret/i,
  /mpesa/i,
  /pesalink/i,
  /stripe/i,
  /supabase/i,
  /ledger[_-]?secret/i,
  /daraja/i,
  /2c2p/i,
] as const;

const FORBIDDEN_VALUE_PATTERNS = [
  /INTERNAL_TOKEN/i,
  /sk_live_/i,
  /sk_test_/i,
  /Bearer\s+eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/,
] as const;

function assertSafeSessionKey(key: string): void {
  for (const pattern of FORBIDDEN_SESSION_KEY_PATTERNS) {
    if (pattern.test(key)) {
      throw new Error(`Forbidden session key cannot be stored on device: ${key}`);
    }
  }
}

function assertSafeSessionValue(value: unknown): void {
  if (value === null || value === undefined) return;
  const serialized = String(value);
  for (const pattern of FORBIDDEN_VALUE_PATTERNS) {
    if (pattern.test(serialized)) {
      throw new Error('Forbidden session value pattern cannot be stored on device.');
    }
  }
  for (const pattern of FORBIDDEN_SESSION_KEY_PATTERNS) {
    if (pattern.test(serialized)) {
      throw new Error('Forbidden session metadata cannot be stored on device.');
    }
  }
}

function assertSafeSessionPayload(session: MobileSession): void {
  for (const [key, value] of Object.entries(session)) {
    assertSafeSessionKey(key);
    assertSafeSessionValue(value);
  }
  const serialized = JSON.stringify(session).toLowerCase();
  if (serialized.includes('internal_token') || serialized.includes('webhook_secret')) {
    throw new Error('Forbidden session metadata cannot be stored on device.');
  }
}

export async function saveSession(session: MobileSession): Promise<void> {
  assertSafeSessionPayload(session);
  if (Platform.OS === 'web') {
    await webStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session), {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  }
}

export async function getSession(): Promise<MobileSession | null> {
  const raw = Platform.OS === 'web' 
    ? await webStorage.getItem(SESSION_KEY)
    : await SecureStore.getItemAsync(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as MobileSession;
    assertSafeSessionPayload(parsed);
    return parsed;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  if (Platform.OS === 'web') {
    await webStorage.deleteItem(SESSION_KEY);
  } else {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  }
}

export async function hasSession(): Promise<boolean> {
  const session = await getSession();
  return Boolean(session?.accessToken || session?.userId);
}

export function validateSessionStorageSafety(): { ok: boolean; message: string } {
  try {
    assertSafeSessionPayload({
      accessToken: 'demo-safe-token',
      email: 'demo@securepay.app',
      authMode: 'demo',
    });
    assertSafeSessionKey('accessToken');
    return { ok: true, message: 'Session storage safeguards active' };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Session storage validation failed',
    };
  }
}
