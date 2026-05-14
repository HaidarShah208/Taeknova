import { baseApi } from '@services/baseApi';
import { setSession } from '@redux/auth';
import type { RegisterApiResponse } from '@app-types/admin';
import { unwrapBackendData, unwrapBackendEnvelope } from '@services/apiEnvelope';
import { mapBackendAuthUserToUser } from '@redux/admin/mapBackendUser';
import { getJwtExpiryMs } from '@lib/jwtClient';

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export const customerAuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegisterApiResponse, RegisterRequest>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      transformResponse: (raw: unknown) => unwrapBackendData<RegisterApiResponse>(raw),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (!data.requiresEmailVerification) {
            dispatch(
              setSession({
                user: mapBackendAuthUserToUser(data.user),
                token: data.accessToken,
                expiresAt: getJwtExpiryMs(data.accessToken),
              }),
            );
          }
        } catch {
          /* no session on error */
        }
      },
    }),
    verifyEmail: builder.query<{ verified: boolean }, string>({
      query: (token) => ({
        url: '/auth/verify-email',
        params: { token },
      }),
      transformResponse: (raw: unknown) => unwrapBackendData<{ verified: boolean }>(raw),
    }),
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
      transformResponse: (raw: unknown) => {
        const { message } = unwrapBackendEnvelope<{ sent: boolean }>(raw);
        return { message };
      },
    }),
    resetPassword: builder.mutation<{ message: string }, { token: string; password: string }>({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
      transformResponse: (raw: unknown) => {
        const { message } = unwrapBackendEnvelope<{ reset: boolean }>(raw);
        return { message };
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useRegisterMutation,
  useLazyVerifyEmailQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = customerAuthApi;
