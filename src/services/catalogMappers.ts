import type { Product, Category, ProductFilters } from '@app-types/product';
import type { PublicCategoryDto, PublicProductDto } from '@app-types/storeApi';

export function mapPublicCategoryToUi(dto: PublicCategoryDto): Category {
  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    description: dto.description ?? '',
    image: '',
    productCount: 0,
  };
}

export function mapPublicProductToUi(dto: PublicProductDto): Product {
  const price = Number(dto.basePrice);
  const images = (dto.imageUrls ?? []).map((url) => ({ url, alt: dto.name }));
  return {
    id: dto.id,
    slug: dto.slug,
    title: dto.name,
    description: dto.description ?? '',
    brand: '',
    categoryId: dto.categoryId,
    categorySlug: dto.category?.slug ?? '',
    price,
    currency: 'USD',
    rating: 0,
    reviewsCount: 0,
    inStock: dto.stockStatus !== 'OUT_OF_STOCK',
    images: images.length ? images : [{ url: '/favicon.svg', alt: dto.name }],
    variants: (dto.variants ?? []).map((v) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      sku: v.sku,
      stock: v.stockQuantity,
    })),
    tags: [],
    isNew: false,
    isBestseller: dto.isFeatured,
    createdAt: dto.createdAt,
  };
}

export function mapProductFiltersToCatalogSort(filters: ProductFilters): 'newest' | 'price_asc' | 'price_desc' | 'name_asc' {
  switch (filters.sort) {
    case 'price-asc':
      return 'price_asc';
    case 'price-desc':
      return 'price_desc';
    case 'popular':
    case 'rating':
    case 'new':
    default:
      return 'newest';
  }
}

export function buildCatalogListArg(
  filters: ProductFilters,
  categorySlugToId: ReadonlyMap<string, string>,
): {
  page: number;
  limit: number;
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort: 'newest' | 'price_asc' | 'price_desc' | 'name_asc';
} {
  const page = filters.page ?? 1;
  const limit = filters.pageSize ?? 12;
  let categoryId: string | undefined;
  if (filters.categories?.length) {
    const slug = filters.categories[0];
    if (slug) categoryId = categorySlugToId.get(slug);
  }
  return {
    page,
    limit,
    search: filters.search?.trim() || undefined,
    categoryId,
    minPrice: filters.priceMin,
    maxPrice: filters.priceMax,
    sort: mapProductFiltersToCatalogSort(filters),
  };
}
