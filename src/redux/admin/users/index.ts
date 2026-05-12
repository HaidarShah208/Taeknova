import { baseApi } from '@services/baseApi';
import type { AdminCreateAdminBody, AdminUserRecord } from '@app-types/admin';
import { unwrapBackendData } from '@services/apiEnvelope';

export const adminUsersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminCreateAdminUser: builder.mutation<AdminUserRecord, AdminCreateAdminBody>({
      query: (body) => ({
        url: '/users/admins',
        method: 'POST',
        body,
      }),
      transformResponse: (raw: unknown) => unwrapBackendData<AdminUserRecord>(raw),
      invalidatesTags: [{ type: 'AdminUser', id: 'LIST' }],
    }),
  }),
  overrideExisting: true,
});

export const { useAdminCreateAdminUserMutation } = adminUsersApi;
