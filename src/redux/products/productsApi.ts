import { DEFAULT_PAGE_SIZE } from '@constants/app';
import { baseApi } from '@services/baseApi';
import { MOCK_PRODUCTS, MOCK_REVIEWS } from '@services/mockData';
import type { PaginatedResponse } from '@app-types/common';
import type { Product, ProductFilters, ProductReview } from '@app-types/product';
import { sleep } from '@utils/misc';

const SIMULATED_DELAY = 250;

const sortProducts = (list: Product[], sort: ProductFilters['sort']): Product[] => {
  const cloned = [...list];
  switch (sort) {
    case 'price-asc':
      return cloned.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return cloned.sort((a, b) => b.price - a.price);
    case 'rating':
      return cloned.sort((a, b) => b.rating - a.rating);
    case 'popular':
      return cloned.sort((a, b) => b.reviewsCount - a.reviewsCount);
    case 'new':
    default:
      return cloned.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }
};

const filterProducts = (filters: ProductFilters): Product[] => {
  const search = filters.search?.trim().toLowerCase() ?? '';

  return MOCK_PRODUCTS.filter((product) => {
    if (
      search &&
      !`${product.title} ${product.description} ${product.tags.join(' ')}`
        .toLowerCase()
        .includes(search)
    ) {
      return false;
    }
    if (filters.categories?.length && !filters.categories.includes(product.categorySlug)) {
      return false;
    }
    if (filters.priceMin !== undefined && product.price < filters.priceMin) return false;
    if (filters.priceMax !== undefined && product.price > filters.priceMax) return false;
    if (filters.rating !== undefined && product.rating < filters.rating) return false;
    if (filters.sizes?.length && !product.variants.some((v) => filters.sizes?.includes(v.size))) {
      return false;
    }
    if (
      filters.colors?.length &&
      !product.variants.some((v) => filters.colors?.includes(v.color))
    ) {
      return false;
    }
    return true;
  });
};

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<PaginatedResponse<Product>, ProductFilters | void>({
      queryFn: async (filters) => {
        await sleep(SIMULATED_DELAY);
        const safe: ProductFilters = filters ?? {};
        const filtered = sortProducts(filterProducts(safe), safe.sort);
        const page = safe.page ?? 1;
        const pageSize = safe.pageSize ?? DEFAULT_PAGE_SIZE;
        const start = (page - 1) * pageSize;
        const data = filtered.slice(start, start + pageSize);
        return {
          data: {
            data,
            meta: {
              page,
              pageSize,
              total: filtered.length,
              totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
            },
          },
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product' as const, id: 'LIST' },
            ]
          : [{ type: 'Product' as const, id: 'LIST' }],
    }),
    getProductBySlug: builder.query<Product, string>({
      queryFn: async (slug) => {
        await sleep(SIMULATED_DELAY);
        const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
        if (!product) {
          return { error: { status: 404, data: { message: 'Product not found' } } };
        }
        return { data: product };
      },
      providesTags: (_result, _error, slug) => [{ type: 'Product', id: slug }],
    }),
    getFeaturedProducts: builder.query<Product[], number | void>({
      queryFn: async (limit) => {
        await sleep(SIMULATED_DELAY);
        const featured = MOCK_PRODUCTS.filter((p) => p.isBestseller || p.isNew).slice(0, limit ?? 8);
        return { data: featured };
      },
      providesTags: [{ type: 'Product', id: 'FEATURED' }],
    }),
    getNewArrivals: builder.query<Product[], number | void>({
      queryFn: async (limit) => {
        await sleep(SIMULATED_DELAY);
        const arrivals = sortProducts(MOCK_PRODUCTS, 'new').slice(0, limit ?? 8);
        return { data: arrivals };
      },
      providesTags: [{ type: 'Product', id: 'NEW' }],
    }),
    getRelatedProducts: builder.query<Product[], { slug: string; limit?: number }>({
      queryFn: async ({ slug, limit = 4 }) => {
        await sleep(SIMULATED_DELAY);
        const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
        if (!product) return { data: [] };
        const related = MOCK_PRODUCTS.filter(
          (p) => p.categoryId === product.categoryId && p.id !== product.id,
        ).slice(0, limit);
        return { data: related };
      },
    }),
    getProductReviews: builder.query<ProductReview[], string>({
      queryFn: async () => {
        await sleep(SIMULATED_DELAY);
        return { data: MOCK_REVIEWS };
      },
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useGetFeaturedProductsQuery,
  useGetNewArrivalsQuery,
  useGetRelatedProductsQuery,
  useGetProductReviewsQuery,
} = productsApi;
