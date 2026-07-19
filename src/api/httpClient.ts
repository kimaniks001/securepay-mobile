import { apiConfig, assertApiModeAllowed } from './config';
import {
  apiFailure,
  apiSuccess,
  mapHttpStatusToCategory,
  type ApiResult,
} from './apiErrors';
import { isForbiddenEndpoint } from './endpoints';
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

export async function httpGet<T>(path: string): Promise<ApiResult<T>> {
  return httpRequest<T>(path, { method: 'GET' });
}

export async function httpRequest<T>(path: string, options: RequestOptions = {}): Promise<ApiResult<T>> {
  assertApiModeAllowed();

  if (isForbiddenEndpoint(path)) {
    return apiFailure(
      'unsupported_action',
      'This action is controlled by SecurePay backend and is not available from the mobile app.',
    );
  }

  const method = options.method ?? 'GET';
  if (method !== 'GET') {
    return apiFailure(
      'unsupported_action',
      'API writes are disabled in Mobile Phase 3. Only read-only GET requests are allowed.',
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
