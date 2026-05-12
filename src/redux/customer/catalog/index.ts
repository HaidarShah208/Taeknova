import { baseApi } from '@services/baseApi';
import { unwrapBackendData } from '@services/apiEnvelope';
import type {
  CatalogSortParam,
  PublicCategoryDto,
  PublicProductDto,
  PublicProductListDto,
  ReviewListDto,
} from '@app-types/storeApi';

function buildQuery(params: Record<string, string | number | undefined>): string {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === '') return;
    p.set(key, String(value));
  });
  const qs = p.toString();
  return qs ? `?${qs}` : '';
}

export const catalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listPublicProducts: builder.query<
      PublicProductListDto,
      {
        page: number;
        limit: number;
        search?: string;
        categoryId?: string;
        minPrice?: number;
        maxPrice?: number;
        size?: string;
        color?: string;
        sort?: CatalogSortParam;
      }
    >({
      query: (arg) => ({
        url: `/catalog/products${buildQuery({
          page: arg.page,
          limit: arg.limit,
          search: arg.search,
          categoryId: arg.categoryId,
          minPrice: arg.minPrice,
          maxPrice: arg.maxPrice,
          size: arg.size,
          color: arg.color,
          sort: arg.sort,
        })}`,
      }),
      transformResponse: (raw: unknown) => unwrapBackendData<PublicProductListDto>(raw),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'PublicProduct' as const, id })),
              { type: 'PublicProduct' as const, id: 'LIST' },
            ]
          : [{ type: 'PublicProduct' as const, id: 'LIST' }],
    }),
    listPublicFeatured: builder.query<PublicProductDto[], number>({
      query: (limit) => ({ url: `/catalog/products/featured${buildQuery({ limit })}` }),
      transformResponse: (raw: unknown) => unwrapBackendData<PublicProductDto[]>(raw),
      providesTags: [{ type: 'PublicProduct' as const, id: 'FEATURED' }],
    }),
    getPublicProductBySlug: builder.query<PublicProductDto, string>({
      query: (slug) => ({ url: `/catalog/products/${encodeURIComponent(slug)}` }),
      transformResponse: (raw: unknown) => unwrapBackendData<PublicProductDto>(raw),
      providesTags: (_result, _e, slug) => [{ type: 'PublicProduct' as const, id: `SLUG:${slug}` }],
    }),
    listPublicRelated: builder.query<PublicProductDto[], { slug: string; limit?: number }>({
      query: ({ slug, limit = 8 }) => ({
        url: `/catalog/products/${encodeURIComponent(slug)}/related${buildQuery({ limit })}`,
      }),
      transformResponse: (raw: unknown) => unwrapBackendData<PublicProductDto[]>(raw),
    }),
    listPublicCategories: builder.query<PublicCategoryDto[], void>({
      query: () => ({ url: '/catalog/categories' }),
      transformResponse: (raw: unknown) => unwrapBackendData<PublicCategoryDto[]>(raw),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'PublicCategory' as const, id })),
              { type: 'PublicCategory' as const, id: 'LIST' },
            ]
          : [{ type: 'PublicCategory' as const, id: 'LIST' }],
    }),
    listPublicCategoryProducts: builder.query<
      PublicProductListDto,
      { slug: string; page: number; limit: number; search?: string; sort?: CatalogSortParam; size?: string; color?: string }
    >({
      query: (arg) => ({
        url: `/catalog/categories/${encodeURIComponent(arg.slug)}/products${buildQuery({
          page: arg.page,
          limit: arg.limit,
          search: arg.search,
          sort: arg.sort,
          size: arg.size,
          color: arg.color,
        })}`,
      }),
      transformResponse: (raw: unknown) => unwrapBackendData<PublicProductListDto>(raw),
      providesTags: (result, _e, arg) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'PublicProduct' as const, id })),
              { type: 'PublicProduct' as const, id: `CAT:${arg.slug}` },
            ]
          : [{ type: 'PublicProduct' as const, id: `CAT:${arg.slug}` }],
    }),
    listPublicProductReviews: builder.query<
      ReviewListDto,
      { slug: string; page: number; limit: number }
    >({
      query: (arg) => ({
        url: `/catalog/products/${encodeURIComponent(arg.slug)}/reviews${buildQuery({
          page: arg.page,
          limit: arg.limit,
        })}`,
      }),
      transformResponse: (raw: unknown) => unwrapBackendData<ReviewListDto>(raw),
      providesTags: (_r, _e, arg) => [
        { type: 'ServerReview' as const, id: `PRODUCT:${arg.slug}` },
        { type: 'ServerReview' as const, id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListPublicProductsQuery,
  useListPublicFeaturedQuery,
  useGetPublicProductBySlugQuery,
  useListPublicRelatedQuery,
  useListPublicCategoriesQuery,
  useListPublicCategoryProductsQuery,
  useListPublicProductReviewsQuery,
} = catalogApi;
