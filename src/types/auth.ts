import type { ID } from '@app-types/common';

export type AppUserRole = 'user' | 'admin';

export interface User {
  id: ID;
  email: string;
  firstName: string;
  lastName: string;
  /** Present when session comes from admin API (`fullName` from backend). */
  fullName?: string;
  role?: AppUserRole;
  avatarUrl?: string;
  createdAt?: string;
}

export interface AuthSession {
  user: User;
  token: string;
  /** `null` when expiry is unknown (e.g. admin JWT from backend without `exp` in client). */
  expiresAt: number | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
