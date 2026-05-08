import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { STORAGE_KEYS } from '@constants/app';
import type { AuthSession, User } from '@app-types/auth';
import { localStore } from '@utils/storage';

interface AuthState {
  user: User | null;
  token: string | null;
  expiresAt: number | null;
  status: 'idle' | 'authenticated' | 'unauthenticated';
}

const persistedToken = localStore.get<string | null>(STORAGE_KEYS.authToken, null);

const initialState: AuthState = {
  user: null,
  token: persistedToken,
  expiresAt: null,
  status: persistedToken ? 'authenticated' : 'unauthenticated',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<AuthSession>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.expiresAt = action.payload.expiresAt;
      state.status = 'authenticated';
      localStore.set(STORAGE_KEYS.authToken, action.payload.token);
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    clearSession(state) {
      state.user = null;
      state.token = null;
      state.expiresAt = null;
      state.status = 'unauthenticated';
      localStore.remove(STORAGE_KEYS.authToken);
    },
  },
});

export const { setSession, setUser, clearSession } = authSlice.actions;
export const authReducer = authSlice.reducer;

export const selectIsAuthenticated = (state: { auth: AuthState }): boolean =>
  state.auth.status === 'authenticated' && !!state.auth.token;
export const selectCurrentUser = (state: { auth: AuthState }): User | null => state.auth.user;
export const selectIsAdmin = (state: { auth: AuthState }): boolean => state.auth.user?.role === 'admin';
