import * as SecureStore from 'expo-secure-store';

const SESSION_KEY = 'securepay_mobile_session_v1';

export type MobileSession = {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  userId?: string;
  ksNumber?: string;
  displayName?: string;
  email?: string;
};

const FORBIDDEN_SESSION_KEYS = [
  'internal_token',
  'internalToken',
  'choice',
  'provider',
  'bank',
  'mpesa',
  'pesalink',
  'stripe',
  'supabase',
  'ledger',
] as const;

function assertSafeSessionPayload(session: MobileSession): void {
  const serialized = JSON.stringify(session).toLowerCase();
  for (const forbidden of FORBIDDEN_SESSION_KEYS) {
    if (serialized.includes(forbidden)) {
      throw new Error('Forbidden session metadata cannot be stored on device.');
    }
  }
}

export async function saveSession(session: MobileSession): Promise<void> {
  assertSafeSessionPayload(session);
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session), {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

export async function getSession(): Promise<MobileSession | null> {
  const raw = await SecureStore.getItemAsync(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MobileSession;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}

export async function hasSession(): Promise<boolean> {
  const session = await getSession();
  return Boolean(session?.accessToken || session?.userId);
}
