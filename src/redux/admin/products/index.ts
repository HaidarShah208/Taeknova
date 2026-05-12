import { baseApi } from '@services/baseApi';
import type {
  AdminCreateProductBody,
  AdminListProductsQuery,
  AdminProduct,
  AdminProductListResponse,
  AdminUpdateProductBody,
} from '@app-types/admin';
import { assertBackendSuccess, unwrapBackendData } from '@redux/admin/apiEnvelope';

export interface AdminUpdateProductRequest {
  productId: string;
  body: AdminUpdateProductBody;
}

export interface AdminUploadProductImageRequest {
  productId: string;
  file: File;
}

function buildProductsListUrl(params?: AdminListProductsQuery): string {
  const q = new URLSearchParams();
  if (!params) return '/products';
  if (params.page != null) q.set('page', String(params.page));
  if (params.limit != null) q.set('limit', String(params.limit));
  if (params.search) q.set('search', params.search);
  if (params.status) q.set('status', params.status);
  const qs = q.toString();
  return qs ? `/products?${qs}` : '/products';
}

export const adminProductsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminListProducts: builder.query<AdminProductListResponse, AdminListProductsQuery | void>({
      query: (params) => ({
        url: buildProductsListUrl(params ?? undefined),
      }),
      transformResponse: (raw: unknown) => unwrapBackendData<AdminProductListResponse>(raw),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'AdminProduct' as const, id })),
              { type: 'AdminProduct' as const, id: 'LIST' },
            ]
          : [{ type: 'AdminProduct' as const, id: 'LIST' }],
    }),
    adminCreateProduct: builder.mutation<AdminProduct, AdminCreateProductBody>({
      query: (body) => ({
        url: '/products',
        method: 'POST',
        body,
      }),
      transformResponse: (raw: unknown) => unwrapBackendData<AdminProduct>(raw),
      invalidatesTags: [{ type: 'AdminProduct', id: 'LIST' }],
    }),
    adminUpdateProduct: builder.mutation<AdminProduct, AdminUpdateProductRequest>({
      query: ({ productId, body }) => ({
        url: `/products/${productId}`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (raw: unknown) => unwrapBackendData<AdminProduct>(raw),
      invalidatesTags: (_result, _err, { productId }) => [
        { type: 'AdminProduct', id: productId },
        { type: 'AdminProduct', id: 'LIST' },
      ],
    }),
    adminDeleteProduct: builder.mutation<void, string>({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: 'DELETE',
      }),
      transformResponse: (raw: unknown) => {
        assertBackendSuccess(raw);
        return undefined;
      },
      invalidatesTags: (_result, _err, productId) => [
        { type: 'AdminProduct', id: productId },
        { type: 'AdminProduct', id: 'LIST' },
      ],
    }),
    adminApproveProduct: builder.mutation<AdminProduct, string>({
      query: (productId) => ({
        url: `/products/${productId}/approve`,
        method: 'PATCH',
      }),
      transformResponse: (raw: unknown) => unwrapBackendData<AdminProduct>(raw),
      invalidatesTags: (_result, _err, productId) => [
        { type: 'AdminProduct', id: productId },
        { type: 'AdminProduct', id: 'LIST' },
      ],
    }),
    adminRejectProduct: builder.mutation<AdminProduct, string>({
      query: (productId) => ({
        url: `/products/${productId}/reject`,
        method: 'PATCH',
      }),
      transformResponse: (raw: unknown) => unwrapBackendData<AdminProduct>(raw),
      invalidatesTags: (_result, _err, productId) => [
        { type: 'AdminProduct', id: productId },
        { type: 'AdminProduct', id: 'LIST' },
      ],
    }),
    adminUploadProductImage: builder.mutation<AdminProduct, AdminUploadProductImageRequest>({
      query: ({ productId, file }) => {
        const formData = new FormData();
        formData.append('image', file);
        return {
          url: `/products/${productId}/images`,
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (raw: unknown) => unwrapBackendData<AdminProduct>(raw),
      invalidatesTags: (_result, _err, { productId }) => [
        { type: 'AdminProduct', id: productId },
        { type: 'AdminProduct', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAdminListProductsQuery,
  useAdminCreateProductMutation,
  useAdminUpdateProductMutation,
  useAdminDeleteProductMutation,
  useAdminApproveProductMutation,
  useAdminRejectProductMutation,
  useAdminUploadProductImageMutation,
} = adminProductsApi;
