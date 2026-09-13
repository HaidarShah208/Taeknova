export interface BackendApiEnvelope<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
}

export function unwrapBackendData<T>(raw: unknown): T {
  const envelope = raw as BackendApiEnvelope<T>;
  if (envelope.data === undefined) {
    throw new Error(envelope.message || 'Unexpected API response');
  }
  return envelope.data;
}

/** Success responses that always include `data` (e.g. `{ sent: true }`). */
export function unwrapBackendEnvelope<T>(raw: unknown): { message: string; data: T } {
  const envelope = raw as BackendApiEnvelope<T>;
  if (!envelope.success) {
    throw new Error(envelope.message || 'Request failed');
  }
  if (envelope.data === undefined) {
    throw new Error(envelope.message || 'Unexpected API response');
  }
  return { message: envelope.message, data: envelope.data };
}

export function assertBackendSuccess(raw: unknown): void {
  const envelope = raw as BackendApiEnvelope<unknown>;
  if (!envelope.success) {
    throw new Error(envelope.message || 'Request failed');
  }
}

/** Read `message` from RTK Query / fetch error bodies (`{ success, message, errors }`). */
export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (!error || typeof error !== 'object') return fallback;

  const data = (error as { data?: unknown }).data;
  if (data && typeof data === 'object' && 'message' in data) {
    const message = (data as BackendApiEnvelope<unknown>).message;
    if (typeof message === 'string' && message.trim().length > 0) {
      return message.trim();
    }
  }

  if ('message' in error && typeof (error as { message: unknown }).message === 'string') {
    const message = (error as { message: string }).message.trim();
    if (message.length > 0 && message !== 'Rejected') {
      return message;
    }
  }

  return fallback;
}
