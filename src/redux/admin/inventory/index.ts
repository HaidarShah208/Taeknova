import { baseApi } from '@services/baseApi';
import type {
  AdminInventoryLog,
  AdminUpdateStockBody,
  AdminUpdateStockResponse,
} from '@app-types/admin';
import { unwrapBackendData } from '@redux/admin/apiEnvelope';

export const adminInventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminUpdateStock: builder.mutation<AdminUpdateStockResponse, AdminUpdateStockBody>({
      query: (body) => ({
        url: '/inventory/stock',
        method: 'PATCH',
        body,
      }),
      transformResponse: (raw: unknown) => unwrapBackendData<AdminUpdateStockResponse>(raw),
      invalidatesTags: (result) => {
        const tags: Array<{ type: 'AdminProduct' | 'AdminInventory'; id: string }> = [
          { type: 'AdminProduct', id: 'LIST' },
        ];
        const productId = result?.variant?.productId;
        if (productId) {
          tags.push({ type: 'AdminProduct', id: productId });
          tags.push({ type: 'AdminInventory', id: productId });
        }
        return tags;
      },
    }),
    adminListInventoryLogs: builder.query<AdminInventoryLog[], string>({
      query: (productId) => ({
        url: `/inventory/${productId}/logs`,
      }),
      transformResponse: (raw: unknown) => unwrapBackendData<AdminInventoryLog[]>(raw),
      providesTags: (_result, _err, productId) => [{ type: 'AdminInventory', id: productId }],
    }),
  }),
  overrideExisting: true,
});

export const { useAdminUpdateStockMutation, useAdminListInventoryLogsQuery } = adminInventoryApi;
