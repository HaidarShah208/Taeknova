import { baseApi } from '@services/baseApi';
import { assertBackendSuccess, unwrapBackendData } from '@services/apiEnvelope';
import type { CartLineDto } from '@app-types/storeApi';

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<CartLineDto[], void>({
      query: () => ({ url: '/cart' }),
      transformResponse: (raw: unknown) => unwrapBackendData<CartLineDto[]>(raw),
      providesTags: (result) =>
        result
          ? [
              ...result.map((line) => ({ type: 'ServerCart' as const, id: line.variantId })),
              { type: 'ServerCart' as const, id: 'LIST' },
            ]
          : [{ type: 'ServerCart' as const, id: 'LIST' }],
    }),
    addCartItem: builder.mutation<CartLineDto, { variantId: string; quantity?: number }>({
      query: (body) => ({ url: '/cart/items', method: 'POST', body: { quantity: 1, ...body } }),
      transformResponse: (raw: unknown) => unwrapBackendData<CartLineDto>(raw),
      invalidatesTags: [{ type: 'ServerCart', id: 'LIST' }, 'CheckoutSummary'],
    }),
    updateCartItem: builder.mutation<CartLineDto, { variantId: string; quantity: number }>({
      query: ({ variantId, quantity }) => ({
        url: `/cart/items/${variantId}`,
        method: 'PATCH',
        body: { quantity },
      }),
      transformResponse: (raw: unknown) => unwrapBackendData<CartLineDto>(raw),
      /** Optimistic quantity so +/- feels instant; do not invalidate ServerCart (avoids refetch flicker). */
      async onQueryStarted({ variantId, quantity }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          cartApi.util.updateQueryData('getCart', undefined, (draft) => {
            const line = draft?.find((l) => l.variantId === variantId);
            if (line) line.quantity = quantity;
          }),
        );
        try {
          const { data } = await queryFulfilled;
          dispatch(
            cartApi.util.updateQueryData('getCart', undefined, (draft) => {
              const idx = draft?.findIndex((l) => l.variantId === variantId) ?? -1;
              if (draft && idx >= 0) draft[idx] = data;
            }),
          );
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: ['CheckoutSummary'],
    }),
    removeCartItem: builder.mutation<void, string>({
      query: (variantId) => ({ url: `/cart/items/${variantId}`, method: 'DELETE' }),
      transformResponse: (raw: unknown) => {
        assertBackendSuccess(raw);
        return undefined;
      },
      invalidatesTags: (_r, _e, variantId) => [
        { type: 'ServerCart', id: 'LIST' },
        { type: 'ServerCart', id: variantId },
        'CheckoutSummary',
      ],
    }),
    clearCart: builder.mutation<void, void>({
      query: () => ({ url: '/cart', method: 'DELETE' }),
      transformResponse: (raw: unknown) => {
        assertBackendSuccess(raw);
        return undefined;
      },
      invalidatesTags: [{ type: 'ServerCart', id: 'LIST' }, 'CheckoutSummary'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCartQuery,
  useLazyGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} = cartApi;
