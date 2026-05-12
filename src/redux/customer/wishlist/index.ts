import { baseApi } from '@services/baseApi';
import { assertBackendSuccess, unwrapBackendData } from '@services/apiEnvelope';
import type { WishlistItemDto } from '@app-types/storeApi';

const OPTIMISTIC_PREFIX = '__optimistic__:';

function optimisticWishlistItem(productId: string): WishlistItemDto {
  const now = new Date().toISOString();
  return {
    id: `${OPTIMISTIC_PREFIX}${productId}`,
    userId: '',
    productId,
    createdAt: now,
    updatedAt: now,
  };
}

/** Injected endpoint name is not on `baseApi`’s static types; patch at runtime. */
function patchWishlistCache(
  dispatch: (action: unknown) => { undo: () => void },
  recipe: (draft: WishlistItemDto[]) => void,
) {
  return dispatch((baseApi as any).util.updateQueryData('getWishlist', undefined, recipe));
}

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
      async onQueryStarted({ productId }, { dispatch, queryFulfilled }) {
        const patchResult = patchWishlistCache(dispatch, (draft) => {
          if (draft.some((w) => w.productId === productId)) return;
          draft.push(optimisticWishlistItem(productId));
        });
        try {
          const { data } = await queryFulfilled;
          patchWishlistCache(dispatch, (draft) => {
            const idx = draft.findIndex((w) => w.productId === productId);
            if (idx >= 0) draft[idx] = data;
          });
        } catch {
          patchResult.undo();
        }
      },
    }),
    removeWishlistItem: builder.mutation<void, string>({
      query: (productId) => ({ url: `/wishlist/items/${productId}`, method: 'DELETE' }),
      transformResponse: (raw: unknown) => {
        assertBackendSuccess(raw);
        return undefined;
      },
      async onQueryStarted(productId, { dispatch, queryFulfilled }) {
        const patchResult = patchWishlistCache(dispatch, (draft) => {
          const idx = draft.findIndex((w) => w.productId === productId);
          if (idx >= 0) draft.splice(idx, 1);
        });
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const { useGetWishlistQuery, useAddWishlistItemMutation, useRemoveWishlistItemMutation } = wishlistApi;
