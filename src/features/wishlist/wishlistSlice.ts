import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { STORAGE_KEYS } from '@constants/app';
import { localStore } from '@utils/storage';

interface WishlistState {
  productIds: string[];
}

const initialState: WishlistState = {
  productIds: localStore.get<string[]>(STORAGE_KEYS.wishlist, []),
};

const persist = (state: WishlistState): void => {
  localStore.set(STORAGE_KEYS.wishlist, state.productIds);
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist(state, action: PayloadAction<string>) {
      const id = action.payload;
      const idx = state.productIds.indexOf(id);
      if (idx === -1) state.productIds.push(id);
      else state.productIds.splice(idx, 1);
      persist(state);
    },
    addToWishlist(state, action: PayloadAction<string>) {
      if (!state.productIds.includes(action.payload)) {
        state.productIds.push(action.payload);
        persist(state);
      }
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.productIds = state.productIds.filter((id) => id !== action.payload);
      persist(state);
    },
    clearWishlist(state) {
      state.productIds = [];
      persist(state);
    },
  },
});

export const { toggleWishlist, addToWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;
export const wishlistReducer = wishlistSlice.reducer;

const selectWishlistState = (state: { wishlist: WishlistState }): WishlistState => state.wishlist;

export const selectWishlistIds = createSelector(selectWishlistState, (s) => s.productIds);

export const selectIsInWishlist = (productId: string) =>
  createSelector(selectWishlistIds, (ids) => ids.includes(productId));
