import type { ID } from '@app-types/common';

export interface PublicCategoryDto {
  id: ID;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PublicProductVariantDto {
  id: ID;
  productId: ID;
  size: string;
  color: string;
  sku: string;
  stockQuantity: number;
  variantPrice?: string | number;
  createdAt: string;
  updatedAt: string;
}

export type PublicProductStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type PublicStockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export interface PublicProductDto {
  id: ID;
  name: string;
  slug: string;
  description?: string;
  basePrice: string | number;
  isFeatured: boolean;
  imageUrls: string[];
  status: PublicProductStatus;
  stockStatus: PublicStockStatus;
  categoryId: ID;
  createdById: ID;
  createdAt: string;
  updatedAt: string;
  category?: PublicCategoryDto;
  variants?: PublicProductVariantDto[];
}

export interface PublicPaginationDto {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PublicProductListDto {
  items: PublicProductDto[];
  pagination: PublicPaginationDto;
}

export type CatalogSortParam = 'newest' | 'price_asc' | 'price_desc' | 'name_asc';

export interface CartLineDto {
  id: ID;
  userId: ID;
  variantId: ID;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  variant?: PublicProductVariantDto & { product?: PublicProductDto };
}

export interface CheckoutSummaryDto {
  lines: Array<{
    variantId: string;
    productId: string;
    productName: string;
    sku: string;
    variantLabel: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
  subtotalAmount: number;
  shippingAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
}

export interface OrderDto {
  id: ID;
  userId: ID;
  status: string;
  paymentStatus: string;
  shippingAddressSnapshot: Record<string, unknown>;
  currency: string;
  subtotalAmount: string;
  shippingAmount: string;
  taxAmount: string;
  totalAmount: string;
  shippingMethod?: string;
  customerNotes?: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItemDto[];
}

export interface OrderItemDto {
  id: ID;
  orderId: ID;
  variantId: ID;
  productId: ID;
  productName: string;
  sku: string;
  variantLabel: string;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
}

export interface ReviewDto {
  id: ID;
  userId: ID;
  productId: ID;
  rating: number;
  title?: string;
  body?: string;
  createdAt: string;
  updatedAt: string;
  user?: { id: ID; fullName: string; email: string };
}

export interface ReviewListDto {
  items: ReviewDto[];
  pagination: PublicPaginationDto;
}

export interface ProfileDto {
  id: ID;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddressDto {
  id: ID;
  userId: ID;
  label: string;
  recipientName: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItemDto {
  id: ID;
  userId: ID;
  productId: ID;
  createdAt: string;
  updatedAt: string;
  product?: PublicProductDto;
}
