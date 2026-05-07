import { baseApi } from '@services/baseApi';
import { MOCK_CATEGORIES } from '@services/mockData';
import type { Category } from '@app-types/product';
import { sleep } from '@utils/misc';

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      queryFn: async () => {
        await sleep(150);
        return { data: MOCK_CATEGORIES };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Category' as const, id })),
              { type: 'Category' as const, id: 'LIST' },
            ]
          : [{ type: 'Category' as const, id: 'LIST' }],
    }),
    getCategoryBySlug: builder.query<Category, string>({
      queryFn: async (slug) => {
        await sleep(120);
        const category = MOCK_CATEGORIES.find((c) => c.slug === slug);
        if (!category) {
          return { error: { status: 404, data: { message: 'Category not found' } } };
        }
        return { data: category };
      },
      providesTags: (_result, _error, slug) => [{ type: 'Category', id: slug }],
    }),
  }),
});

export const { useGetCategoriesQuery, useGetCategoryBySlugQuery } = categoriesApi;
