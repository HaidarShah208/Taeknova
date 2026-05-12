import { useCallback, useMemo } from 'react';

import type { CartItem } from '@app-types/cart';
import env from '@lib/env';
import { useAppDispatch, useAppSelector } from '@redux';
import { selectIsAuthenticated } from '@redux/auth';
import {
  clearCart,
  removeItem,
  selectCartItems,
  selectCartSubtotal,
  updateQuantity,
} from '@redux/cart';
import {
  useClearCartMutation,
  useGetCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from '@redux/customer';
import { mapCartLineDtoToCartItem } from '@services/cartMappers';

export function useUnifiedCart() {
  const apiMode = !env.enableMockApi;
  const dispatch = useAppDispatch();
  const isAuthed = useAppSelector(selectIsAuthenticated);
  const localItems = useAppSelector(selectCartItems);
  const localSubtotal = useAppSelector(selectCartSubtotal);

  const { data: lines, isLoading, isFetching, refetch } = useGetCartQuery(undefined, {
    skip: !apiMode || !isAuthed,
  });
  const [patchItem] = useUpdateCartItemMutation();
  const [delItem] = useRemoveCartItemMutation();
  const [clearServer] = useClearCartMutation();

  const items = useMemo(() => {
    if (!apiMode) return localItems;
    return (lines ?? []).map(mapCartLineDtoToCartItem);
  }, [apiMode, lines, localItems]);

  const subtotal = useMemo(() => {
    if (!apiMode) return localSubtotal;
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [apiMode, items, localSubtotal]);

  const adjustQuantity = useCallback(
    async (item: CartItem, quantity: number) => {
      if (!apiMode) {
        dispatch(updateQuantity({ id: item.id, quantity }));
        return;
      }
      await patchItem({ variantId: item.variantId, quantity }).unwrap();
    },
    [apiMode, dispatch, patchItem],
  );

  const removeLine = useCallback(
    async (item: CartItem) => {
      if (!apiMode) {
        dispatch(removeItem(item.id));
        return;
      }
      await delItem(item.variantId).unwrap();
    },
    [apiMode, delItem, dispatch],
  );

  const clearAll = useCallback(async () => {
    if (!apiMode) {
      dispatch(clearCart());
      return;
    }
    await clearServer().unwrap();
  }, [apiMode, clearServer, dispatch]);

  return {
    items,
    subtotal,
    isLoading: apiMode ? isLoading : false,
    isFetching: apiMode ? isFetching : false,
    refetch,
    apiMode,
    isAuthenticated: isAuthed,
    adjustQuantity,
    removeLine,
    clearAll,
  };
}
