import { baseApi } from '@services/baseApi';
import { assertBackendSuccess, unwrapBackendData } from '@services/apiEnvelope';
import type { WishlistItemDto } from '@app-types/storeApi';

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query<WishlistItemDto[], void>({
      query: () => ({ url: '/wishlist' }),
      transformResponse: (raw: unknown) => unwrapBackendData<WishlistItemDto[]>(raw),
      providesTags: (result) =>
        result
          ? [
              ...result.map((w) => ({ type: 'ServerWishlist' as const, id: w.productId })),
              { type: 'ServerWishlist' as const, id: 'LIST' },
            ]
          : [{ type: 'ServerWishlist' as const, id: 'LIST' }],
    }),
    addWishlistItem: builder.mutation<WishlistItemDto, { productId: string }>({
      query: (body) => ({ url: '/wishlist/items', method: 'POST', body }),
      transformResponse: (raw: unknown) => unwrapBackendData<WishlistItemDto>(raw),
      invalidatesTags: [{ type: 'ServerWishlist', id: 'LIST' }],
    }),
    removeWishlistItem: builder.mutation<void, string>({
      query: (productId) => ({ url: `/wishlist/items/${productId}`, method: 'DELETE' }),
      transformResponse: (raw: unknown) => {
        assertBackendSuccess(raw);
        return undefined;
      },
      invalidatesTags: (_r, _e, productId) => [
        { type: 'ServerWishlist', id: 'LIST' },
        { type: 'ServerWishlist', id: productId },
      ],
    }),
  }),
  overrideExisting: true,
});

export const { useGetWishlistQuery, useAddWishlistItemMutation, useRemoveWishlistItemMutation } = wishlistApi;
