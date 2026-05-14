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
