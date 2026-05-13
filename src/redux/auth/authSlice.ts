import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { STORAGE_KEYS } from '@constants/app';
import type { AuthSession, User } from '@app-types/auth';
import { decodeAccessTokenPayload, getJwtExpiryMs } from '@lib/jwtClient';
import { localStore } from '@utils/storage';

interface AuthState {
  user: User | null;
  token: string | null;
  expiresAt: number | null;
  status: 'idle' | 'authenticated' | 'unauthenticated';
}

/** After refresh, rebuild minimal user from JWT (token is persisted; full user may be in `authUser`). */
function hydrateUserFromToken(token: string | null): User | null {
  if (!token) return null;
  const payload = decodeAccessTokenPayload(token);
  if (!payload) return null;
  return {
    id: payload.id,
    email: '',
    firstName: payload.role === 'ADMIN' ? 'Admin' : 'User',
    lastName: '',
    role: payload.role === 'ADMIN' ? 'admin' : 'user',
  };
}

const persistedToken = localStore.get<string | null>(STORAGE_KEYS.authToken, null);
const persistedUser = localStore.get<User | null>(STORAGE_KEYS.authUser, null);
const rehydratedUser = persistedUser ?? hydrateUserFromToken(persistedToken);

const initialState: AuthState = {
  user: rehydratedUser,
  token: persistedToken,
  expiresAt: persistedToken ? getJwtExpiryMs(persistedToken) : null,
  status: persistedToken && rehydratedUser ? 'authenticated' : 'unauthenticated',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<{ token: string; expiresAt: number | null }>) {
      localStore.remove(STORAGE_KEYS.authUser);
      const user = hydrateUserFromToken(action.payload.token);
      if (!user) {
        state.user = null;
        state.token = null;
        state.expiresAt = null;
        state.status = 'unauthenticated';
        localStore.remove(STORAGE_KEYS.authToken);
        return;
      }
      state.token = action.payload.token;
      state.expiresAt = action.payload.expiresAt;
      state.user = user;
      state.status = 'authenticated';
      localStore.set(STORAGE_KEYS.authToken, action.payload.token);
    },
    setSession(state, action: PayloadAction<AuthSession>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.expiresAt = action.payload.expiresAt ?? getJwtExpiryMs(action.payload.token);
      state.status = 'authenticated';
      localStore.set(STORAGE_KEYS.authToken, action.payload.token);
      localStore.set(STORAGE_KEYS.authUser, action.payload.user);
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      localStore.set(STORAGE_KEYS.authUser, action.payload);
    },
    clearSession(state) {
      state.user = null;
      state.token = null;
      state.expiresAt = null;
      state.status = 'unauthenticated';
      localStore.remove(STORAGE_KEYS.authToken);
      localStore.remove(STORAGE_KEYS.authUser);
    },
  },
});

export const { setAccessToken, setSession, setUser, clearSession } = authSlice.actions;
export const authReducer = authSlice.reducer;

export const selectIsAuthenticated = (state: { auth: AuthState }): boolean =>
  state.auth.status === 'authenticated' && !!state.auth.token;
export const selectCurrentUser = (state: { auth: AuthState }): User | null => state.auth.user;
export const selectIsAdmin = (state: { auth: AuthState }): boolean =>
  state.auth.user?.role === 'admin';
