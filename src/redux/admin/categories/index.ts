import { baseApi } from '@services/baseApi';
import type {
  AdminCategory,
  AdminCreateCategoryBody,
  AdminUpdateCategoryBody,
} from '@app-types/admin';
import { assertBackendSuccess, unwrapBackendData } from '@services/apiEnvelope';

export interface AdminUpdateCategoryRequest {
  categoryId: string;
  body: AdminUpdateCategoryBody;
}

export const adminCategoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminListCategories: builder.query<AdminCategory[], void>({
      query: () => ({ url: '/categories' }),
      transformResponse: (raw: unknown) => unwrapBackendData<AdminCategory[]>(raw),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'AdminCategory' as const, id })),
              { type: 'AdminCategory' as const, id: 'LIST' },
            ]
          : [{ type: 'AdminCategory' as const, id: 'LIST' }],
    }),
    adminCreateCategory: builder.mutation<AdminCategory, AdminCreateCategoryBody>({
      query: (body) => ({
        url: '/categories',
        method: 'POST',
        body,
      }),
      transformResponse: (raw: unknown) => unwrapBackendData<AdminCategory>(raw),
      invalidatesTags: [{ type: 'AdminCategory', id: 'LIST' }],
    }),
    adminUpdateCategory: builder.mutation<AdminCategory, AdminUpdateCategoryRequest>({
      query: ({ categoryId, body }) => ({
        url: `/categories/${categoryId}`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (raw: unknown) => unwrapBackendData<AdminCategory>(raw),
      invalidatesTags: (_result, _err, { categoryId }) => [
        { type: 'AdminCategory', id: categoryId },
        { type: 'AdminCategory', id: 'LIST' },
      ],
    }),
    adminDeleteCategory: builder.mutation<void, string>({
      query: (categoryId) => ({
        url: `/categories/${categoryId}`,
        method: 'DELETE',
      }),
      transformResponse: (raw: unknown) => {
        assertBackendSuccess(raw);
        return undefined;
      },
      invalidatesTags: (_result, _err, categoryId) => [
        { type: 'AdminCategory', id: categoryId },
        { type: 'AdminCategory', id: 'LIST' },
        { type: 'AdminProduct', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAdminListCategoriesQuery,
  useAdminCreateCategoryMutation,
  useAdminUpdateCategoryMutation,
  useAdminDeleteCategoryMutation,
} = adminCategoriesApi;
