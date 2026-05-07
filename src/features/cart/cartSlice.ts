import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { STORAGE_KEYS } from '@constants/app';
import type { AddToCartPayload, CartItem } from '@app-types/cart';
import { clamp } from '@utils/misc';
import { localStore } from '@utils/storage';

interface CartState {
  items: CartItem[];
}

const buildCartItem = ({ product, variant, quantity }: AddToCartPayload): CartItem => ({
  id: `${product.id}:${variant.id}`,
  productId: product.id,
  variantId: variant.id,
  slug: product.slug,
  title: product.title,
  image: product.images[0]?.url ?? '',
  price: product.price,
  ...(product.comparePrice !== undefined ? { comparePrice: product.comparePrice } : {}),
  quantity,
  size: variant.size,
  color: variant.color,
  maxStock: variant.stock,
});

const initialState: CartState = {
  items: localStore.get<CartItem[]>(STORAGE_KEYS.cart, []),
};

const persist = (state: CartState): void => {
  localStore.set(STORAGE_KEYS.cart, state.items);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<AddToCartPayload>) {
      const incoming = buildCartItem(action.payload);
      const existing = state.items.find((item) => item.id === incoming.id);
      if (existing) {
        existing.quantity = clamp(existing.quantity + incoming.quantity, 1, existing.maxStock);
      } else {
        state.items.push(incoming);
      }
      persist(state);
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.items.find((entry) => entry.id === action.payload.id);
      if (item) {
        item.quantity = clamp(action.payload.quantity, 1, item.maxStock);
        persist(state);
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      persist(state);
    },
    clearCart(state) {
      state.items = [];
      persist(state);
    },
  },
});

export const { addItem, updateQuantity, removeItem, clearCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;

const selectCartState = (state: { cart: CartState }): CartState => state.cart;

export const selectCartItems = createSelector(selectCartState, (cart) => cart.items);

export const selectCartCount = createSelector(selectCartItems, (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0),
);

export const selectCartSubtotal = createSelector(selectCartItems, (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0),
);

export const selectCartItemById = (id: string) =>
  createSelector(selectCartItems, (items) => items.find((item) => item.id === id) ?? null);
