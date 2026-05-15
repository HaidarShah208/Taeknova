import { useMemo } from 'react';

import { useAppSelector } from '@redux';
import { selectCartItems, selectCartSubtotal } from '@redux/cart';
import {
  selectDirectCheckoutItems,
  selectIsDirectCheckout,
} from '@redux/checkoutSession/checkoutSessionSlice';
import { useUnifiedCart } from '@hooks/commerce/useUnifiedCart';

/** Items and subtotal for checkout — buy-now session overrides the saved cart. */
export function useCheckoutDisplay() {
  const isDirectCheckout = useAppSelector(selectIsDirectCheckout);
  const directItems = useAppSelector(selectDirectCheckoutItems);
  const mockCartItems = useAppSelector(selectCartItems);
  const mockCartSubtotal = useAppSelector(selectCartSubtotal);
  const { items: cartItems, subtotal: cartSubtotal, isAuthenticated, apiMode } = useUnifiedCart();

  const items = useMemo(() => {
    if (isDirectCheckout && directItems?.length) return directItems;
    return apiMode ? cartItems : mockCartItems;
  }, [apiMode, cartItems, directItems, isDirectCheckout, mockCartItems]);

  const subtotal = useMemo(() => {
    if (isDirectCheckout && directItems?.length) {
      return directItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
    return apiMode ? cartSubtotal : mockCartSubtotal;
  }, [apiMode, cartSubtotal, directItems, isDirectCheckout, mockCartSubtotal]);

  return {
    items,
    subtotal,
    isDirectCheckout,
    isAuthenticated,
    apiMode,
  };
}
