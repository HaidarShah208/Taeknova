import { baseApi } from '@services/baseApi';
import { setSession } from '@redux/auth';
import type { AdminLoginResponse } from '@app-types/admin';
import { unwrapBackendData } from '@services/apiEnvelope';
import { mapBackendAuthUserToUser } from '@redux/admin/mapBackendUser';

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export const customerAuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AdminLoginResponse, RegisterRequest>({
      query: (body) => ({
        url: '/auth/register',
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
  }),
  overrideExisting: true,
});

export const { useRegisterMutation } = customerAuthApi;
