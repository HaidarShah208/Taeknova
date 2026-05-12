import type { Product } from '@app-types/product';
import env from '@lib/env';
import { useGetProductBySlugQuery, useGetRelatedProductsQuery } from '@redux/products';
import { useGetPublicProductBySlugQuery, useListPublicRelatedQuery } from '@redux/customer';
import { mapPublicProductToUi } from '@services/catalogMappers';

export function useUnifiedProductBySlug(slug: string) {
  const useApi = !env.enableMockApi;
  const api = useGetPublicProductBySlugQuery(slug, { skip: !useApi || !slug });
  const mock = useGetProductBySlugQuery(slug, { skip: useApi || !slug });

  if (useApi) {
    const product = api.data ? mapPublicProductToUi(api.data) : undefined;
    return {
      product,
      isLoading: api.isLoading,
      isError: api.isError,
      refetch: api.refetch,
      mode: 'api' as const,
    };
  }

  return {
    product: mock.data,
    isLoading: mock.isLoading,
    isError: mock.isError,
    refetch: mock.refetch,
    mode: 'mock' as const,
  };
}

export function useUnifiedRelatedProducts(slug: string, limit = 4): Product[] {
  const useApi = !env.enableMockApi;
  const api = useListPublicRelatedQuery({ slug, limit }, { skip: !useApi || !slug });
  const mock = useGetRelatedProductsQuery({ slug, limit }, { skip: useApi || !slug });

  if (useApi) return (api.data ?? []).map(mapPublicProductToUi);
  return mock.data ?? [];
}
