import type { User } from '@app-types/auth';
import type { BackendAuthUser } from '@app-types/admin';
import type { ProfileDto } from '@app-types/storeApi';

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

export function mapProfileDtoToUser(profile: ProfileDto): User {
  const roleUpper = String(profile.role).toUpperCase();
  return {
    ...mapBackendAuthUserToUser({
      id: profile.id,
      email: profile.email,
      fullName: profile.fullName,
      role: roleUpper === 'ADMIN' ? 'ADMIN' : 'USER',
    }),
    ...(profile.avatarUrl ? { avatarUrl: profile.avatarUrl } : {}),
    createdAt: profile.createdAt,
  };
}
