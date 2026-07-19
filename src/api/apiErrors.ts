export type ApiErrorCategory =
  | 'network_error'
  | 'timeout'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'validation_error'
  | 'server_error'
  | 'unsafe_environment'
  | 'unsupported_action'
  | 'unknown_error';

export type ApiError = {
  category: ApiErrorCategory;
  message: string;
  statusCode?: number;
  requestId?: string;
  cause?: unknown;
};

export type ApiResult<T> =
  | { ok: true; data: T; requestId?: string }
  | { ok: false; error: ApiError };

export function apiSuccess<T>(data: T, requestId?: string): ApiResult<T> {
  return { ok: true, data, requestId };
}

export function apiFailure(
  category: ApiErrorCategory,
  message: string,
  options?: { statusCode?: number; requestId?: string; cause?: unknown },
): ApiResult<never> {
  return {
    ok: false,
    error: {
      category,
      message,
      statusCode: options?.statusCode,
      requestId: options?.requestId,
      cause: options?.cause,
    },
  };
}

export function mapHttpStatusToCategory(status: number): ApiErrorCategory {
  if (status === 401) return 'unauthorized';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'not_found';
  if (status >= 400 && status < 500) return 'validation_error';
  if (status >= 500) return 'server_error';
  return 'unknown_error';
}

export function getSafeErrorMessage(error: ApiError): string {
  switch (error.category) {
    case 'network_error':
      return 'Unable to reach SecurePay API Gateway. Check your connection and try again.';
    case 'timeout':
      return 'SecurePay API Gateway did not respond in time. Try again later.';
    case 'unauthorized':
      return 'Session expired or not signed in. Continue in demo mode or sign in again.';
    case 'forbidden':
      return 'This request is not permitted from the mobile app.';
    case 'not_found':
      return 'The requested SecurePay record was not found.';
    case 'validation_error':
      return 'The SecurePay API Gateway rejected this request.';
    case 'server_error':
      return 'SecurePay API Gateway is temporarily unavailable.';
    case 'unsafe_environment':
      return 'API access blocked for safety. Check environment configuration.';
    case 'unsupported_action':
      return 'This action is controlled by SecurePay backend and is not available from the mobile app.';
    default:
      return 'Something went wrong while loading SecurePay data.';
  }
}

export function toThrownError(error: ApiError): Error {
  return new Error(getSafeErrorMessage(error));
}
