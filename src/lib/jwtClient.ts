/** Read JWT `exp` (ms) from an access token without verifying the signature (client-side scheduling only). */
export function getJwtExpiryMs(token: string): number | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2 || !parts[1]) return null;
    const json = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(json) as { exp?: number };
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

/** Decode access-token payload (unsigned) for client rehydration after refresh. */
export function decodeAccessTokenPayload(token: string): { id: string; role: 'ADMIN' | 'USER' } | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2 || !parts[1]) return null;
    const json = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(json) as { id?: string; role?: string };
    if (!payload.id || typeof payload.id !== 'string') return null;
    const role = String(payload.role ?? '').toUpperCase();
    if (role !== 'ADMIN' && role !== 'USER') return null;
    return { id: payload.id, role };
  } catch {
    return null;
  }
}
