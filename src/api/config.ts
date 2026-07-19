export type RequestedApiMode = 'mock' | 'staging' | 'production';

export type EffectiveApiMode = 'mock' | 'staging' | 'production_disabled';

export type EnvironmentLabel =
  | 'Mock mode'
  | 'Staging mode'
  | 'Production disabled'
  | 'Unsafe environment blocked';

export type ApiConfigStatus = 'ready' | 'blocked' | 'misconfigured';

type ApiConfig = {
  requestedMode: RequestedApiMode;
  effectiveMode: EffectiveApiMode;
  baseUrl: string | null;
  requestTimeoutMs: number;
  writesEnabled: boolean;
  allowProductionApi: boolean;
  environmentLabel: EnvironmentLabel;
  status: ApiConfigStatus;
  statusMessage: string | null;
};

const PRODUCTION_HOST_PATTERNS = [/securepay\.ke/i, /api\.securepay\.ke/i];
// Production securepay.ke URLs are rejected unless EXPO_PUBLIC_SECUREPAY_ALLOW_PRODUCTION_API=true.

function parseBooleanEnv(value: string | undefined): boolean {
  return value === 'true' || value === '1';
}

function resolveRequestedMode(): RequestedApiMode {
  const envMode = process.env.EXPO_PUBLIC_SECUREPAY_API_MODE?.trim().toLowerCase();
  if (envMode === 'staging') return 'staging';
  if (envMode === 'production') return 'production';
  return 'mock';
}

function normalizeBaseUrl(value: string | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  return trimmed.replace(/\/$/, '');
}

function isProductionUrl(url: string): boolean {
  try {
    const hostname = new URL(url).hostname;
    return PRODUCTION_HOST_PATTERNS.some((pattern) => pattern.test(hostname));
  } catch {
    return PRODUCTION_HOST_PATTERNS.some((pattern) => pattern.test(url));
  }
}

function buildConfig(): ApiConfig {
  const requestedMode = resolveRequestedMode();
  const allowProductionApi = parseBooleanEnv(
    process.env.EXPO_PUBLIC_SECUREPAY_ALLOW_PRODUCTION_API,
  );
  const writesEnabled = parseBooleanEnv(process.env.EXPO_PUBLIC_SECUREPAY_ENABLE_API_WRITES);
  const configuredBaseUrl = normalizeBaseUrl(process.env.EXPO_PUBLIC_SECUREPAY_API_BASE_URL);

  if (requestedMode === 'mock') {
    return {
      requestedMode,
      effectiveMode: 'mock',
      baseUrl: null,
      requestTimeoutMs: 15_000,
      writesEnabled: false,
      allowProductionApi,
      environmentLabel: 'Mock mode',
      status: 'ready',
      statusMessage: null,
    };
  }

  if (requestedMode === 'production') {
    return {
      requestedMode,
      effectiveMode: 'production_disabled',
      baseUrl: configuredBaseUrl,
      requestTimeoutMs: 15_000,
      writesEnabled: false,
      allowProductionApi,
      environmentLabel: 'Production disabled',
      status: 'blocked',
      statusMessage:
        'Production API access is disabled in Mobile Phase 4. Use staging mode with a staging gateway URL.',
    };
  }

  if (!configuredBaseUrl) {
    return {
      requestedMode,
      effectiveMode: 'staging',
      baseUrl: null,
      requestTimeoutMs: 15_000,
      writesEnabled: false,
      allowProductionApi,
      environmentLabel: 'Unsafe environment blocked',
      status: 'misconfigured',
      statusMessage:
        'Staging mode requires EXPO_PUBLIC_SECUREPAY_API_BASE_URL. Falling back to safe read-only mock data.',
    };
  }

  if (isProductionUrl(configuredBaseUrl) && !allowProductionApi) {
    return {
      requestedMode,
      effectiveMode: 'staging',
      baseUrl: configuredBaseUrl,
      requestTimeoutMs: 15_000,
      writesEnabled: false,
      allowProductionApi,
      environmentLabel: 'Unsafe environment blocked',
      status: 'blocked',
      statusMessage:
        'Production SecurePay URL blocked by default. Set EXPO_PUBLIC_SECUREPAY_ALLOW_PRODUCTION_API=true only for approved testing. Phase 4 remains read-only.',
    };
  }

  if (writesEnabled) {
    return {
      requestedMode,
      effectiveMode: 'staging',
      baseUrl: configuredBaseUrl,
      requestTimeoutMs: 15_000,
      writesEnabled: false,
      allowProductionApi,
      environmentLabel: 'Unsafe environment blocked',
      status: 'blocked',
      statusMessage:
        'API writes are disabled in Mobile Phase 4. EXPO_PUBLIC_SECUREPAY_ENABLE_API_WRITES is not honored.',
    };
  }

  return {
    requestedMode,
    effectiveMode: 'staging',
    baseUrl: configuredBaseUrl,
    requestTimeoutMs: 15_000,
    writesEnabled: false,
    allowProductionApi,
    environmentLabel: 'Staging mode',
    status: 'ready',
    statusMessage: null,
  };
}

export const apiConfig: ApiConfig = buildConfig();

export function isMockMode(): boolean {
  return apiConfig.effectiveMode === 'mock' || apiConfig.status !== 'ready';
}

export function isStagingMode(): boolean {
  return apiConfig.effectiveMode === 'staging' && apiConfig.status === 'ready';
}

export function isProductionModeEnabled(): boolean {
  return false;
}

export function isApiEnvironmentReady(): boolean {
  return apiConfig.status === 'ready';
}

export function getEnvironmentLabel(): EnvironmentLabel {
  return apiConfig.environmentLabel;
}

export function getEnvironmentBannerMessage(): string {
  switch (apiConfig.environmentLabel) {
    case 'Mock mode':
      return 'Demo mode. No real money movement.';
    case 'Staging mode':
      return 'Connected to SecurePay staging API. Money actions remain disabled.';
    case 'Production disabled':
      return 'Production API access is disabled in this mobile phase.';
    case 'Unsafe environment blocked':
      return 'API access blocked for safety.';
    default:
      return 'Demo mode. No real money movement.';
  }
}

export function assertApiModeAllowed(): void {
  if (apiConfig.requestedMode === 'production') {
    throw new Error(
      apiConfig.statusMessage ??
        'Production API access is disabled in Mobile Phase 4.',
    );
  }
}

export function assertStagingReadAllowed(): void {
  if (apiConfig.effectiveMode === 'staging' && apiConfig.status === 'ready') {
    return;
  }
  if (apiConfig.effectiveMode === 'mock' && apiConfig.status === 'ready') {
    return;
  }
  throw new Error(apiConfig.statusMessage ?? 'API environment is not ready.');
}
