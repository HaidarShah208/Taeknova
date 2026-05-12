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

export function assertBackendSuccess(raw: unknown): void {
  const envelope = raw as BackendApiEnvelope<unknown>;
  if (!envelope.success) {
    throw new Error(envelope.message || 'Request failed');
  }
}
