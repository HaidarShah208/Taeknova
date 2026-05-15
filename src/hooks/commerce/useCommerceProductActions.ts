import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import type { Product, ProductVariant } from '@app-types/product';
import env from '@lib/env';
import { ROUTES } from '@constants/routes';
import { useAppDispatch, useAppSelector } from '@redux';
import { selectIsAuthenticated } from '@redux/auth';
import { addItem } from '@redux/cart';
import { startDirectCheckout } from '@redux/checkoutSession/checkoutSessionSlice';
import {
  useAddCartItemMutation,
  useAddWishlistItemMutation,
  useGetWishlistQuery,
  useRemoveWishlistItemMutation,
} from '@redux/customer';
import { selectIsInWishlist, toggleWishlist } from '@redux/wishlist';

interface QuickAddPayload {
  product: Product;
  variant: ProductVariant;
  quantity?: number;
}

export function useCommerceProductActions(product: Product | null) {
  const apiMode = !env.enableMockApi;
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isAuthed = useAppSelector(selectIsAuthenticated);
  const mockWishlisted = useAppSelector(selectIsInWishlist(product?.id ?? '__none__'));

  const { data: wishlist = [] } = useGetWishlistQuery(undefined, {
    skip: !apiMode || !isAuthed || !product,
  });
  const [addCartLine] = useAddCartItemMutation();
  const [addWish] = useAddWishlistItemMutation();
  const [removeWish] = useRemoveWishlistItemMutation();

  const isWishlisted = useMemo(() => {
    if (!product) return false;
    if (!apiMode) return mockWishlisted;
    return wishlist.some((w) => w.productId === product.id);
  }, [apiMode, mockWishlisted, product, wishlist]);

  const toggleWishlistForProduct = useCallback(() => {
    if (!product) return;
    if (apiMode) {
      if (!isAuthed) {
        toast.error('Sign in to use your wishlist');
        return;
      }
      if (isWishlisted) {
        void removeWish(product.id)
          .unwrap()
          .catch(() => toast.error('Could not update wishlist'));
      } else {
        void addWish({ productId: product.id })
          .unwrap()
          .catch(() => toast.error('Could not update wishlist'));
      }
      return;
    }
    dispatch(toggleWishlist(product.id));
    toast.success(mockWishlisted ? 'Removed from wishlist' : 'Saved to wishlist');
  }, [addWish, apiMode, dispatch, isAuthed, isWishlisted, mockWishlisted, product, removeWish]);

  const addToCart = useCallback(
    async ({ product: p, variant, quantity = 1 }: QuickAddPayload): Promise<boolean> => {
      if (!p) return false;
      if (apiMode) {
        if (!isAuthed) {
          toast.info('Please sign in to add items to your cart');
          navigate(ROUTES.login, { state: { from: location.pathname }, replace: false });
          return false;
        }
        try {
          await addCartLine({ variantId: variant.id, quantity }).unwrap();
          toast.success(`${p.title} added to cart`);
          return true;
        } catch {
          toast.error('Could not add to cart');
          return false;
        }
      }
      dispatch(
        addItem({
          product: {
            id: p.id,
            slug: p.slug,
            title: p.title,
            price: p.price,
            ...(p.comparePrice !== undefined ? { comparePrice: p.comparePrice } : {}),
            images: p.images,
            currency: p.currency,
          },
          variant,
          quantity,
        }),
      );
      toast.success(`${p.title} added to cart`);
      return true;
    },
    [addCartLine, apiMode, dispatch, isAuthed, location.pathname, navigate],
  );

  const buyNow = useCallback(
    async ({ product: p, variant, quantity = 1 }: QuickAddPayload): Promise<boolean> => {
      if (!p) return false;
      if (apiMode && !isAuthed) {
        toast.info('Please sign in to complete your order');
        navigate(ROUTES.login, {
          state: {
            from: ROUTES.checkout,
            pendingBuyNow: { product: p, variant, quantity },
          },
          replace: false,
        });
        return false;
      }
      dispatch(startDirectCheckout([{ product: p, variant, quantity }]));
      navigate(ROUTES.checkout);
      return true;
    },
    [apiMode, dispatch, isAuthed, navigate],
  );

  return { apiMode, isWishlisted, toggleWishlistForProduct, addToCart, buyNow };
}
