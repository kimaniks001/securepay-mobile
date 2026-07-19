import type { ApiError } from './apiErrors';
import { getSafeErrorMessage } from './apiErrors';

let lastError: ApiError | null = null;

export function setLastApiError(error: ApiError | null): void {
  lastError = error;
}

export function getLastApiError(): ApiError | null {
  return lastError;
}

export function getLastApiErrorMessage(): string | null {
  if (!lastError) return null;
  return getSafeErrorMessage(lastError);
}

export function clearLastApiError(): void {
  lastError = null;
}
