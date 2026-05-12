import { baseApi } from '@services/baseApi';
import type { OrderDto } from '@app-types/storeApi';
import { assertBackendSuccess, unwrapBackendData } from '@services/apiEnvelope';

export interface AdminOrderListResponse {
  items: OrderDto[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export interface AdminListOrdersQuery {
  page?: number;
  limit?: number;
}

const orderInvalidations = (): Array<
  { type: 'AdminOrder'; id: 'LIST' } | { type: 'ServerOrder'; id: 'LIST' } | 'CheckoutSummary'
> => [{ type: 'AdminOrder', id: 'LIST' }, { type: 'ServerOrder', id: 'LIST' }, 'CheckoutSummary'];

function buildAdminOrdersUrl(params?: AdminListOrdersQuery): string {
  const q = new URLSearchParams();
  if (params?.page != null) q.set('page', String(params.page));
  if (params?.limit != null) q.set('limit', String(params.limit));
  const qs = q.toString();
  return qs ? `/orders/admin?${qs}` : '/orders/admin';
}

export const adminOrdersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminListAllOrders: builder.query<AdminOrderListResponse, AdminListOrdersQuery | void>({
      query: (params) => ({ url: buildAdminOrdersUrl(params ?? undefined) }),
      transformResponse: (raw: unknown) => unwrapBackendData<AdminOrderListResponse>(raw),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((o) => ({ type: 'AdminOrder' as const, id: o.id })),
              { type: 'AdminOrder' as const, id: 'LIST' },
            ]
          : [{ type: 'AdminOrder' as const, id: 'LIST' }],
    }),
    adminApproveOrder: builder.mutation<OrderDto, string>({
      query: (orderId) => ({ url: `/orders/admin/${orderId}/approve`, method: 'PATCH' }),
      transformResponse: (raw: unknown) => unwrapBackendData<OrderDto>(raw),
      invalidatesTags: (_r, _e, id) => [...orderInvalidations(), { type: 'AdminOrder', id }],
    }),
    adminRejectOrder: builder.mutation<void, string>({
      query: (orderId) => ({ url: `/orders/admin/${orderId}/reject`, method: 'PATCH' }),
      transformResponse: (raw: unknown) => {
        assertBackendSuccess(raw);
        return undefined;
      },
      invalidatesTags: (_r, _e, id) => [...orderInvalidations(), { type: 'AdminOrder', id }],
    }),
    adminShipOrder: builder.mutation<OrderDto, string>({
      query: (orderId) => ({ url: `/orders/admin/${orderId}/ship`, method: 'PATCH' }),
      transformResponse: (raw: unknown) => unwrapBackendData<OrderDto>(raw),
      invalidatesTags: (_r, _e, id) => [...orderInvalidations(), { type: 'AdminOrder', id }],
    }),
    adminDeliverOrder: builder.mutation<OrderDto, string>({
      query: (orderId) => ({ url: `/orders/admin/${orderId}/deliver`, method: 'PATCH' }),
      transformResponse: (raw: unknown) => unwrapBackendData<OrderDto>(raw),
      invalidatesTags: (_r, _e, id) => [...orderInvalidations(), { type: 'AdminOrder', id }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAdminListAllOrdersQuery,
  useAdminApproveOrderMutation,
  useAdminRejectOrderMutation,
  useAdminShipOrderMutation,
  useAdminDeliverOrderMutation,
} = adminOrdersApi;
