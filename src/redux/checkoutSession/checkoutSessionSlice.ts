import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { AddToCartPayload, CartItem } from '@app-types/cart';
import { cartItemFromPayload } from '@redux/cart/cartSlice';

interface CheckoutSessionState {
  /** Buy-now lines — shown at checkout without adding to the saved cart. */
  directItems: CartItem[] | null;
}

const initialState: CheckoutSessionState = {
  directItems: null,
};

const checkoutSessionSlice = createSlice({
  name: 'checkoutSession',
  initialState,
  reducers: {
    startDirectCheckout(state, action: PayloadAction<AddToCartPayload[]>) {
      state.directItems = action.payload.map(cartItemFromPayload);
    },
    clearDirectCheckout(state) {
      state.directItems = null;
    },
  },
});

export const { startDirectCheckout, clearDirectCheckout } = checkoutSessionSlice.actions;
export const checkoutSessionReducer = checkoutSessionSlice.reducer;

const selectCheckoutSession = (state: { checkoutSession: CheckoutSessionState }) =>
  state.checkoutSession;

export const selectDirectCheckoutItems = createSelector(
  selectCheckoutSession,
  (session) => session.directItems,
);

export const selectIsDirectCheckout = createSelector(
  selectDirectCheckoutItems,
  (items) => items !== null && items.length > 0,
);

export const selectDirectCheckoutLines = createSelector(selectDirectCheckoutItems, (items) =>
  (items ?? []).map((item) => ({ variantId: item.variantId, quantity: item.quantity })),
);
