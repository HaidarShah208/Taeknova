import type { ID } from '@app-types/common';

/** Backend `UserRole` enum values. */
export type BackendUserRole = 'ADMIN' | 'USER';

export interface BackendAuthUser {
  id: ID;
  email: string;
  fullName: string;
  role: BackendUserRole;
}

export type ProductStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export interface AdminProductVariant {
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

export interface AdminCategorySummary {
  id: ID;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProduct {
  id: ID;
  name: string;
  slug: string;
  description?: string;
  basePrice: string | number;
  isFeatured: boolean;
  imageUrls: string[];
  status: ProductStatus;
  stockStatus: StockStatus;
  categoryId: ID;
  createdById: ID;
  createdAt: string;
  updatedAt: string;
  category?: AdminCategorySummary;
  variants?: AdminProductVariant[];
}

export interface AdminPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface AdminProductListResponse {
  items: AdminProduct[];
  pagination: AdminPagination;
}

export interface AdminListProductsQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: ProductStatus;
}

export interface AdminCategory {
  id: ID;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCreateCategoryBody {
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
}

export interface AdminUpdateCategoryBody {
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
}

export interface AdminCreateProductVariantInput {
  size: string;
  color: string;
  sku: string;
  stockQuantity: number;
  variantPrice?: number;
}

export interface AdminCreateProductBody {
  name: string;
  slug: string;
  description?: string;
  basePrice: number;
  categoryId: ID;
  isFeatured?: boolean;
  variants: AdminCreateProductVariantInput[];
}

export interface AdminUpdateProductBody {
  name?: string;
  slug?: string;
  description?: string;
  basePrice?: number;
  categoryId?: ID;
  isFeatured?: boolean;
  status?: ProductStatus;
}

export interface AdminLoginResponse {
  accessToken: string;
  user: BackendAuthUser;
}

export interface AdminRefreshResponse {
  accessToken: string;
}

export interface AdminCreateAdminBody {
  fullName: string;
  email: string;
  password: string;
  role?: BackendUserRole;
}

/** User row returned after `POST /users/admins` (no password). */
export interface AdminUserRecord {
  id: ID;
  email: string;
  fullName: string;
  role: BackendUserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUpdateStockBody {
  variantId: ID;
  newQuantity: number;
  reason?: string;
}

export interface AdminUpdateStockResponse {
  variant: AdminProductVariant;
  totalStock: number;
  stockStatus?: StockStatus;
}

export interface AdminInventoryLog {
  id: ID;
  productId: ID;
  variantId?: ID;
  previousQuantity: number;
  newQuantity: number;
  reason?: string;
  createdAt: string;
  updatedAt: string;
}
