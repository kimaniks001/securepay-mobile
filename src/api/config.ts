export type ApiMode = 'mock' | 'staging' | 'production';

type ApiConfig = {
  mode: ApiMode;
  baseUrl: string | null;
  requestTimeoutMs: number;
};

function resolveMode(): ApiMode {
  const envMode = process.env.EXPO_PUBLIC_SECUREPAY_API_MODE;
  if (envMode === 'staging') {
    return 'staging';
  }
  if (envMode === 'production') {
    return 'production';
  }
  return 'mock';
}

function resolveBaseUrl(mode: ApiMode): string | null {
  if (mode === 'mock') {
    return null;
  }

  const configured = process.env.EXPO_PUBLIC_SECUREPAY_API_BASE_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, '');
  }

  return null;
}

const mode = resolveMode();

export const apiConfig: ApiConfig = {
  mode,
  baseUrl: resolveBaseUrl(mode),
  requestTimeoutMs: 15_000,
};

export function isMockMode(): boolean {
  return apiConfig.mode === 'mock';
}

export function isProductionModeEnabled(): boolean {
  return apiConfig.mode === 'production' && Boolean(apiConfig.baseUrl);
}

export function assertApiModeAllowed(): void {
  if (apiConfig.mode === 'production' && !apiConfig.baseUrl) {
    throw new Error(
      'Production API mode is disabled until explicitly configured in a future phase.',
    );
  }
}
