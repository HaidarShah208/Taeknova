import { baseApi } from '@services/baseApi';
import { clearSession, setSession } from '@redux/auth';
import type { User } from '@app-types/auth';
import type { AdminLoginResponse, AdminRefreshResponse } from '@app-types/admin';
import { assertBackendSuccess, unwrapBackendData } from '@redux/admin/apiEnvelope';
import { mapBackendAuthUserToUser } from '@redux/admin/mapBackendUser';

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export const adminAuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation<AdminLoginResponse, AdminLoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      transformResponse: (raw: unknown) => unwrapBackendData<AdminLoginResponse>(raw),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(
          setSession({
            user: mapBackendAuthUserToUser(data.user),
            token: data.accessToken,
            expiresAt: null,
          }),
        );
      },
    }),
    adminRefresh: builder.mutation<AdminRefreshResponse, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
        body: {},
      }),
      transformResponse: (raw: unknown) => unwrapBackendData<AdminRefreshResponse>(raw),
      async onQueryStarted(_arg, { dispatch, queryFulfilled, getState }) {
        const { data } = await queryFulfilled;
        const user = (getState() as unknown as { auth: { user: User | null } }).auth.user;
        if (user) {
          dispatch(
            setSession({
              user,
              token: data.accessToken,
              expiresAt: null,
            }),
          );
        }
      },
    }),
    adminLogout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      transformResponse: (raw: unknown) => {
        assertBackendSuccess(raw);
        return undefined;
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(clearSession());
      },
    }),
  }),
  overrideExisting: true,
});

export const { useAdminLoginMutation, useAdminRefreshMutation, useAdminLogoutMutation } = adminAuthApi;
