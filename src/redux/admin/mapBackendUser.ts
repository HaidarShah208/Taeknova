import type { User } from '@app-types/auth';
import type { BackendAuthUser } from '@app-types/admin';

export function mapBackendAuthUserToUser(backend: BackendAuthUser): User {
  const trimmed = backend.fullName.trim();
  const parts = trimmed.length ? trimmed.split(/\s+/) : [''];
  const firstName = parts[0] ?? '';
  const lastName = parts.length > 1 ? parts.slice(1).join(' ') : '';

  return {
    id: backend.id,
    email: backend.email,
    firstName,
    lastName,
    fullName: backend.fullName,
    role: backend.role === 'ADMIN' ? 'admin' : 'user',
  };
}
