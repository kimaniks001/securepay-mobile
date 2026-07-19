import { getSafeErrorMessage, toThrownError } from './apiErrors';
import { apiConfig, isMockMode, isStagingMode } from './config';
import { authEndpoints } from './endpoints';
import { httpPostAuth } from './httpClient';
import { clearLastApiError } from './lastApiError';
import { MOCK_KS_NUMBER } from '../mocks/mockProfile';
import {
  clearSession,
  getSession,
  hasSession,
  saveSession,
  type MobileSession,
} from './sessionStorage';
import {
  clearSecureSession,
  saveAuthToken,
  saveUserProfile,
} from '../services/secureStorage';
import type { UserProfile } from '../types/auth';

export type AuthLoginInput = {
  email: string;
  pin: string;
};

export type AuthLoginResult = {
  session: MobileSession;
  user: UserProfile;
};

type StagingAuthResponse = {
  access_token?: string;
  accessToken?: string;
  refresh_token?: string;
  refreshToken?: string;
  expires_at?: string;
  expiresAt?: string;
  user?: {
    id?: string;
    name?: string;
    display_name?: string;
    displayName?: string;
    email?: string;
    phone?: string;
    ks_number?: string;
    ksNumber?: string;
  };
};

const DEMO_USER: UserProfile = {
  id: 'usr_demo_001',
  name: 'Kimani K.',
  email: 'demo@securepay.app',
  phone: '+254 700 000 000',
  ksNumber: MOCK_KS_NUMBER,
};

function buildDemoSession(email: string): AuthLoginResult {
  const normalizedEmail = email.trim().toLowerCase();
  const user: UserProfile = { ...DEMO_USER, email: normalizedEmail };
  const session: MobileSession = {
    accessToken: `demo-token-${Date.now()}`,
    userId: user.id,
    ksNumber: user.ksNumber,
    displayName: user.name,
    email: user.email,
    authMode: 'demo',
  };
  return { session, user };
}

async function persistAuthResult(result: AuthLoginResult): Promise<void> {
  await Promise.all([
    saveSession(result.session),
    saveAuthToken(result.session.accessToken ?? ''),
    saveUserProfile(JSON.stringify(result.user)),
  ]);
  clearLastApiError();
}

export async function getStoredSession(): Promise<MobileSession | null> {
  return getSession();
}

export async function loginWithDemoCredentials(input: AuthLoginInput): Promise<AuthLoginResult> {
  const result = buildDemoSession(input.email);
  await persistAuthResult(result);
  return result;
}

export async function loginWithStagingCredentials(input: AuthLoginInput): Promise<AuthLoginResult> {
  if (!isStagingMode()) {
    throw new Error('Staging login is only available when staging mode is configured.');
  }

  if (!apiConfig.baseUrl) {
    throw new Error(
      'Staging auth requires EXPO_PUBLIC_SECUREPAY_API_BASE_URL. Configure a staging gateway URL first.',
    );
  }

  const response = await httpPostAuth<StagingAuthResponse>(authEndpoints.login, {
    email: input.email.trim().toLowerCase(),
    pin: input.pin,
  });

  if (!response.ok) {
    throw new Error(getSafeErrorMessage(response.error));
  }

  const data = response.data;
  const accessToken = data.access_token ?? data.accessToken;
  if (!accessToken) {
    throw new Error('Staging auth response did not include an access token.');
  }

  const userRecord = data.user ?? {};
  const user: UserProfile = {
    id: userRecord.id ?? 'staging_user',
    name: userRecord.display_name ?? userRecord.displayName ?? userRecord.name ?? 'SecurePay user',
    email: userRecord.email ?? input.email.trim().toLowerCase(),
    phone: userRecord.phone,
    ksNumber: userRecord.ks_number ?? userRecord.ksNumber ?? 'KS-PENDING',
  };

  const session: MobileSession = {
    accessToken,
    refreshToken: data.refresh_token ?? data.refreshToken,
    expiresAt: data.expires_at ?? data.expiresAt,
    userId: user.id,
    ksNumber: user.ksNumber,
    displayName: user.name,
    email: user.email,
    authMode: 'staging',
  };

  const result = { session, user };
  await persistAuthResult(result);
  return result;
}

export async function login(input: AuthLoginInput): Promise<AuthLoginResult> {
  if (isMockMode()) {
    return loginWithDemoCredentials(input);
  }
  return loginWithStagingCredentials(input);
}

export async function refreshSession(): Promise<MobileSession | null> {
  const current = await getSession();
  if (!current?.refreshToken) {
    return current;
  }

  if (isMockMode() || !isStagingMode()) {
    return current;
  }

  const response = await httpPostAuth<StagingAuthResponse>(authEndpoints.refresh, {
    refresh_token: current.refreshToken,
  });

  if (!response.ok) {
    throw toThrownError(response.error);
  }

  const data = response.data;
  const accessToken = data.access_token ?? data.accessToken ?? current.accessToken;
  const updated: MobileSession = {
    ...current,
    accessToken,
    refreshToken: data.refresh_token ?? data.refreshToken ?? current.refreshToken,
    expiresAt: data.expires_at ?? data.expiresAt ?? current.expiresAt,
  };
  await saveSession(updated);
  if (accessToken) {
    await saveAuthToken(accessToken);
  }
  return updated;
}

export async function logout(): Promise<void> {
  await Promise.all([clearSession(), clearSecureSession()]);
  clearLastApiError();
}

export async function isAuthenticated(): Promise<boolean> {
  return hasSession();
}

export function getAuthModeLabel(): string {
  if (isMockMode()) return 'Demo auth (mock mode)';
  if (isStagingMode()) return 'Staging auth (API Gateway)';
  return 'Auth unavailable';
}

export function canUseStagingLogin(): boolean {
  return isStagingMode() && Boolean(apiConfig.baseUrl);
}

export function getStagingAuthUnavailableMessage(): string | null {
  if (isMockMode()) return null;
  if (!isStagingMode()) {
    return apiConfig.statusMessage ?? 'Staging environment is not ready.';
  }
  if (!apiConfig.baseUrl) {
    return 'Staging auth endpoint requires EXPO_PUBLIC_SECUREPAY_API_BASE_URL.';
  }
  return null;
}

export async function safeLogin(input: AuthLoginInput): Promise<AuthLoginResult> {
  try {
    return await login(input);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Sign in failed.';
    throw new Error(message);
  }
}

export function describeAuthFailure(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Sign in failed. Check credentials and staging configuration.';
}
