import type { ID } from '@app-types/common';

export type Currency = 'USD' | 'EUR' | 'GBP';

export interface ProductImage {
  url: string;
  alt: string;
}

export interface ProductVariant {
  id: ID;
  size: string;
  color: string;
  sku: string;
  stock: number;
}

export interface ProductReview {
  id: ID;
  author: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
}

export interface Product {
  id: ID;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  brand: string;
  categoryId: ID;
  categorySlug: string;
  price: number;
  comparePrice?: number;
  currency: Currency;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  tags: string[];
  badges?: string[];
  isNew?: boolean;
  isBestseller?: boolean;
  createdAt: string;
}

export interface Category {
  id: ID;
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export interface ProductFilters {
  search?: string;
  categories?: string[];
  sizes?: string[];
  colors?: string[];
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  sort?: 'new' | 'popular' | 'price-asc' | 'price-desc' | 'rating';
  page?: number;
  pageSize?: number;
}
