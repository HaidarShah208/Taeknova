import { baseApi } from '@services/baseApi';
import { assertBackendSuccess, unwrapBackendData } from '@services/apiEnvelope';
import type { OrderDto } from '@app-types/storeApi';

export interface OrderListResponse {
  items: OrderDto[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listMyOrders: builder.query<OrderListResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 20 }) => ({
        url: `/orders?${new URLSearchParams({ page: String(page), limit: String(limit) }).toString()}`,
      }),
      transformResponse: (raw: unknown) => unwrapBackendData<OrderListResponse>(raw),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((o) => ({ type: 'ServerOrder' as const, id: o.id })),
              { type: 'ServerOrder' as const, id: 'LIST' },
            ]
          : [{ type: 'ServerOrder' as const, id: 'LIST' }],
    }),
    getMyOrder: builder.query<OrderDto, string>({
      query: (orderId) => ({ url: `/orders/${orderId}` }),
      transformResponse: (raw: unknown) => unwrapBackendData<OrderDto>(raw),
      providesTags: (_r, _e, id) => [{ type: 'ServerOrder', id }],
    }),
    createOrder: builder.mutation<
      OrderDto,
      { addressId: string; shippingMethod?: string; customerNotes?: string }
    >({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      transformResponse: (raw: unknown) => unwrapBackendData<OrderDto>(raw),
      invalidatesTags: [
        { type: 'ServerOrder', id: 'LIST' },
        { type: 'ServerCart', id: 'LIST' },
        'CheckoutSummary',
      ],
    }),
    cancelOrder: builder.mutation<void, string>({
      query: (orderId) => ({ url: `/orders/${orderId}/cancel`, method: 'PATCH' }),
      transformResponse: (raw: unknown) => {
        assertBackendSuccess(raw);
        return undefined;
      },
      invalidatesTags: (_r, _e, id) => [
        { type: 'ServerOrder', id },
        { type: 'ServerOrder', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListMyOrdersQuery,
  useGetMyOrderQuery,
  useCreateOrderMutation,
  useCancelOrderMutation,
} = ordersApi;
