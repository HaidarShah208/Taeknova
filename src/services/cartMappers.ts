import type { CartItem } from '@app-types/cart';
import type { CartLineDto } from '@app-types/storeApi';

export function mapCartLineDtoToCartItem(line: CartLineDto): CartItem {
  const variant = line.variant;
  const product = variant?.product;
  const unitPrice =
    variant?.variantPrice != null && variant.variantPrice !== ''
      ? Number(variant.variantPrice)
      : Number(product?.basePrice ?? 0);
  const imageUrl = product?.imageUrls?.[0] ?? '/favicon.svg';

  return {
    id: line.id,
    productId: product?.id ?? variant?.productId ?? '',
    variantId: line.variantId,
    slug: product?.slug ?? '',
    title: product?.name ?? 'Product',
    image: imageUrl,
    price: unitPrice,
    quantity: line.quantity,
    size: variant?.size ?? '',
    color: variant?.color ?? '',
    maxStock: variant?.stockQuantity ?? 999,
  };
}
