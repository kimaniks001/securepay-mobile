import { apiConfig, getEnvironmentLabel, isApiEnvironmentReady, isMockMode, isProductionModeEnabled, isStagingMode } from './config';
import { forbiddenInternalEndpoints, forbiddenMoneyActionEndpoints, isForbiddenEndpoint } from './endpoints';
import { getLastApiErrorMessage } from './lastApiError';
import { guardMobileAction } from './mobileActionGuards';
import { getSession, hasSession, validateSessionStorageSafety } from './sessionStorage';

export type ContractCheckStatus = 'pass' | 'warn' | 'fail';

export type ContractCheckItem = {
  id: string;
  label: string;
  status: ContractCheckStatus;
  detail: string;
};

export type ContractSelfCheckResult = {
  checkedAt: string;
  items: ContractCheckItem[];
  summary: string;
};

function maskBaseUrl(url: string | null): string {
  if (!url) return 'Not configured';
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.hostname}${parsed.port ? `:${parsed.port}` : ''}/…`;
  } catch {
    return 'Invalid URL';
  }
}

export async function runContractSelfCheck(): Promise<ContractSelfCheckResult> {
  const items: ContractCheckItem[] = [];

  items.push({
    id: 'api_mode',
    label: 'API mode',
    status: 'pass',
    detail: `${getEnvironmentLabel()} (requested: ${apiConfig.requestedMode})`,
  });

  items.push({
    id: 'base_url',
    label: 'Base URL',
    status: apiConfig.baseUrl ? 'pass' : isMockMode() ? 'pass' : 'warn',
    detail: maskBaseUrl(apiConfig.baseUrl),
  });

  items.push({
    id: 'production_blocked',
    label: 'Production API',
    status: isProductionModeEnabled() ? 'fail' : 'pass',
    detail: apiConfig.allowProductionApi
      ? 'Production override flag set — Phase 4 remains read-only'
      : 'Blocked by default',
  });

  items.push({
    id: 'writes_disabled',
    label: 'API writes',
    status: apiConfig.writesEnabled ? 'fail' : 'pass',
    detail: 'Disabled — auth/session POST only',
  });

  items.push({
    id: 'environment_ready',
    label: 'Environment ready',
    status: isApiEnvironmentReady() ? 'pass' : 'warn',
    detail: apiConfig.statusMessage ?? 'Ready',
  });

  const storageCheck = validateSessionStorageSafety();
  items.push({
    id: 'session_storage',
    label: 'Session storage safeguards',
    status: storageCheck.ok ? 'pass' : 'fail',
    detail: storageCheck.message,
  });

  const sessionStored = await hasSession();
  items.push({
    id: 'session_present',
    label: 'Mobile session',
    status: sessionStored ? 'pass' : isStagingMode() ? 'warn' : 'pass',
    detail: sessionStored ? 'Session stored in SecureStore' : 'No session stored',
  });

  const forbiddenSample = forbiddenMoneyActionEndpoints[0];
  items.push({
    id: 'forbidden_endpoints',
    label: 'Forbidden endpoints protected',
    status: isForbiddenEndpoint(forbiddenSample) ? 'pass' : 'fail',
    detail: `${forbiddenMoneyActionEndpoints.length + forbiddenInternalEndpoints.length} blocked patterns`,
  });

  const guard = guardMobileAction('withdrawal');
  items.push({
    id: 'money_actions_blocked',
    label: 'Money actions blocked',
    status: guard.allowed ? 'fail' : 'pass',
    detail: 'Withdrawal/release/payout/provider/ledger blocked on mobile',
  });

  const lastError = getLastApiErrorMessage();
  if (lastError) {
    items.push({
      id: 'last_api_error',
      label: 'Last API error',
      status: 'warn',
      detail: lastError,
    });
  }

  const failCount = items.filter((i) => i.status === 'fail').length;
  const warnCount = items.filter((i) => i.status === 'warn').length;
  const summary =
    failCount > 0
      ? `${failCount} contract check(s) failed`
      : warnCount > 0
        ? `${warnCount} warning(s) — review staging configuration`
        : 'API contract checks passed';

  return {
    checkedAt: new Date().toISOString(),
    items,
    summary,
  };
}

export async function getContractStatusForDisplay(): Promise<{
  mode: string;
  baseUrlMasked: string;
  productionBlocked: boolean;
  writesDisabled: boolean;
  sessionStored: boolean;
  forbiddenProtected: boolean;
  lastApiError: string | null;
  summary: string;
}> {
  const result = await runContractSelfCheck();
  const session = await getSession();
  return {
    mode: getEnvironmentLabel(),
    baseUrlMasked: maskBaseUrl(apiConfig.baseUrl),
    productionBlocked: !isProductionModeEnabled(),
    writesDisabled: !apiConfig.writesEnabled,
    sessionStored: Boolean(session?.accessToken || session?.userId),
    forbiddenProtected: isForbiddenEndpoint(forbiddenMoneyActionEndpoints[0]),
    lastApiError: getLastApiErrorMessage(),
    summary: result.summary,
  };
}
