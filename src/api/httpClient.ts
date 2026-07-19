import { apiConfig, assertApiModeAllowed } from './config';
import {
  apiFailure,
  apiSuccess,
  mapHttpStatusToCategory,
  type ApiResult,
} from './apiErrors';
import { isAllowedMobileRequest, isAuthEndpoint } from './endpoints';
import { setLastApiError } from './lastApiError';
import { getSession } from './sessionStorage';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
};

function buildUrl(path: string): string {
  if (!apiConfig.baseUrl) {
    throw new Error('SecurePay API base URL is not configured.');
  }
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${apiConfig.baseUrl}${normalizedPath}`;
}

function extractRequestId(headers: Headers): string | undefined {
  return (
    headers.get('x-request-id') ??
    headers.get('x-correlation-id') ??
    headers.get('request-id') ??
    undefined
  );
}

function recordError<T>(result: ApiResult<T>): ApiResult<T> {
  if (!result.ok) {
    setLastApiError(result.error);
  }
  return result;
}

export async function httpGet<T>(path: string): Promise<ApiResult<T>> {
  return recordError(await httpRequest<T>(path, { method: 'GET' }));
}

export async function httpPostAuth<T>(path: string, body: unknown): Promise<ApiResult<T>> {
  return recordError(
    await httpRequest<T>(path, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
    }),
  );
}

export async function httpRequest<T>(path: string, options: RequestOptions = {}): Promise<ApiResult<T>> {
  assertApiModeAllowed();

  const method = options.method ?? 'GET';

  if (!isAllowedMobileRequest(path, method)) {
    return apiFailure(
      'unsupported_action',
      'This action is controlled by SecurePay backend and is not available from the mobile app.',
    );
  }

  if (method !== 'GET' && !(method === 'POST' && isAuthEndpoint(path))) {
    return apiFailure(
      'unsupported_action',
      'API writes are disabled in Mobile Phase 4 except safe auth/session calls.',
    );
  }

  let url: string;
  try {
    url = buildUrl(path);
  } catch (error) {
    return apiFailure(
      'unsafe_environment',
      error instanceof Error ? error.message : 'API environment is not configured.',
    );
  }

  const session = await getSession();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...options.headers,
  };

  if (session?.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), apiConfig.requestTimeoutMs);

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });

    const requestId = extractRequestId(response.headers);
    const contentType = response.headers.get('content-type') ?? '';
    const isJson = contentType.includes('application/json');
    const payload = isJson ? await response.json().catch(() => null) : await response.text();

    if (!response.ok) {
      const category = mapHttpStatusToCategory(response.status);
      const message =
        typeof payload === 'object' && payload && 'message' in payload
          ? String((payload as { message: unknown }).message)
          : `SecurePay API Gateway returned ${response.status}`;
      return apiFailure(category, message, { statusCode: response.status, requestId });
    }

    return apiSuccess(payload as T, requestId);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return apiFailure('timeout', 'SecurePay API Gateway request timed out.');
    }
    return apiFailure(
      'network_error',
      'Unable to reach SecurePay API Gateway.',
      { cause: error },
    );
  } finally {
    clearTimeout(timeout);
  }
}
