import { useMemo } from 'react';

import type { Category } from '@app-types/product';
import env from '@lib/env';
import { useGetCategoriesQuery } from '@redux/categories';
import { useListPublicCategoriesQuery } from '@redux/customer';
import { mapPublicCategoryToUi } from '@services/catalogMappers';

type Result = {
  categories: Category[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => unknown;
};

export function useUnifiedCategories(): Result {
  const useApi = !env.enableMockApi;
  const mock = useGetCategoriesQuery(undefined, { skip: useApi });
  const api = useListPublicCategoriesQuery(undefined, { skip: !useApi });

  const categories = useMemo((): Category[] => {
    if (useApi) return (api.data ?? []).map(mapPublicCategoryToUi);
    return mock.data ?? [];
  }, [api.data, mock.data, useApi]);

  return {
    categories,
    isLoading: useApi ? api.isLoading : mock.isLoading,
    isError: useApi ? api.isError : mock.isError,
    refetch: useApi ? api.refetch : mock.refetch,
  };
}
