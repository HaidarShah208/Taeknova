import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';

import type { Product, ProductVariant } from '@app-types/product';
import env from '@lib/env';
import { useAppDispatch, useAppSelector } from '@redux';
import { selectIsAuthenticated } from '@redux/auth';
import { addItem } from '@redux/cart';
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

  const toggleWishlistForProduct = useCallback(async () => {
    if (!product) return;
    if (apiMode) {
      if (!isAuthed) {
        toast.error('Sign in to use your wishlist');
        return;
      }
      try {
        if (isWishlisted) {
          await removeWish(product.id).unwrap();
          toast.success('Removed from wishlist');
        } else {
          await addWish({ productId: product.id }).unwrap();
          toast.success('Saved to wishlist');
        }
      } catch {
        toast.error('Wishlist could not be updated');
      }
      return;
    }
    dispatch(toggleWishlist(product.id));
    toast.success(mockWishlisted ? 'Removed from wishlist' : 'Saved to wishlist');
  }, [addWish, apiMode, dispatch, isAuthed, isWishlisted, mockWishlisted, product, removeWish]);

  const addToCart = useCallback(
    async ({ product: p, variant, quantity = 1 }: QuickAddPayload) => {
      if (!p) return;
      if (apiMode) {
        if (!isAuthed) {
          toast.error('Sign in to add items to your cart');
          return;
        }
        try {
          await addCartLine({ variantId: variant.id, quantity }).unwrap();
          toast.success(`${p.title} added to cart`);
        } catch {
          toast.error('Could not add to cart');
        }
        return;
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
    },
    [addCartLine, apiMode, dispatch, isAuthed],
  );

  return { apiMode, isWishlisted, toggleWishlistForProduct, addToCart };
}
