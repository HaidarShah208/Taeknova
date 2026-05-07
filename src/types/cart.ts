import type { ID } from '@app-types/common';
import type { Product, ProductVariant } from '@app-types/product';

export interface CartItem {
  id: ID;
  productId: ID;
  variantId: ID;
  slug: string;
  title: string;
  image: string;
  price: number;
  comparePrice?: number;
  quantity: number;
  size: string;
  color: string;
  maxStock: number;
}

export interface AddToCartPayload {
  product: Pick<
    Product,
    'id' | 'slug' | 'title' | 'price' | 'comparePrice' | 'images' | 'currency'
  >;
  variant: ProductVariant;
  quantity: number;
}
