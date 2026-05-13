import { baseApi } from '@services/baseApi';
import type { AdminCreateAdminBody, AdminUserRecord } from '@app-types/admin';
import { assertBackendSuccess, unwrapBackendData } from '@services/apiEnvelope';

export const adminUsersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminListUsers: builder.query<AdminUserRecord[], void>({
      query: () => ({ url: '/users' }),
      transformResponse: (raw: unknown) => unwrapBackendData<AdminUserRecord[]>(raw),
      providesTags: (result) =>
        result
          ? [
              ...result.map((user) => ({ type: 'AdminUser' as const, id: user.id })),
              { type: 'AdminUser' as const, id: 'LIST' },
            ]
          : [{ type: 'AdminUser' as const, id: 'LIST' }],
    }),
    adminCreateAdminUser: builder.mutation<AdminUserRecord, AdminCreateAdminBody>({
      query: (body) => ({
        url: '/users/admins',
        method: 'POST',
        body,
      }),
      transformResponse: (raw: unknown) => unwrapBackendData<AdminUserRecord>(raw),
      invalidatesTags: [{ type: 'AdminUser', id: 'LIST' }],
    }),
    adminRemoveUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'DELETE',
      }),
      transformResponse: (raw: unknown) => {
        assertBackendSuccess(raw);
        return undefined;
      },
      invalidatesTags: (_result, _error, userId) => [
        { type: 'AdminUser', id: userId },
        { type: 'AdminUser', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: true,
});

export const { useAdminCreateAdminUserMutation, useAdminListUsersQuery, useAdminRemoveUserMutation } =
  adminUsersApi;
