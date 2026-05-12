import type { Product, ProductFilters } from '@app-types/product';
import type { PaginatedResponse } from '@app-types/common';
import env from '@lib/env';
import { useGetProductsQuery } from '@redux/products';
import { useListPublicCategoriesQuery, useListPublicProductsQuery } from '@redux/customer';
import { buildCatalogListArg, mapPublicProductToUi } from '@services/catalogMappers';
import { useMemo } from 'react';

type UnifiedListingResult = {
  data: PaginatedResponse<Product> | undefined;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  refetch: () => unknown;
  mode: 'api' | 'mock';
};

export function useUnifiedProductListing(filters: ProductFilters): UnifiedListingResult {
  const useApi = !env.enableMockApi;
  const { data: categoriesDto } = useListPublicCategoriesQuery(undefined, { skip: !useApi });

  const slugToId = useMemo(() => {
    const m = new Map<string, string>();
    for (const c of categoriesDto ?? []) m.set(c.slug, c.id);
    return m;
  }, [categoriesDto]);

  const listArg = useMemo(() => buildCatalogListArg(filters, slugToId), [filters, slugToId]);

  const api = useListPublicProductsQuery(listArg, { skip: !useApi });
  const mock = useGetProductsQuery(filters, { skip: useApi });

  if (useApi) {
    const dto = api.data;
    const data: PaginatedResponse<Product> | undefined = dto
      ? {
          data: dto.items.map(mapPublicProductToUi),
          meta: {
            page: dto.pagination.page,
            pageSize: dto.pagination.limit,
            total: dto.pagination.total,
            totalPages: dto.pagination.pages,
          },
        }
      : undefined;
    return {
      data,
      isLoading: api.isLoading,
      isError: api.isError,
      isFetching: api.isFetching,
      refetch: api.refetch,
      mode: 'api',
    };
  }

  return {
    data: mock.data,
    isLoading: mock.isLoading,
    isError: mock.isError,
    isFetching: mock.isFetching,
    refetch: mock.refetch,
    mode: 'mock',
  };
}
