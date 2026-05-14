import { useCallback, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { DEFAULT_PAGE_SIZE } from '@constants/app';
import type { ProductFilters } from '@app-types/product';

const ARRAY_KEYS = ['categories', 'sizes', 'colors'] as const;

export function useProductFiltersFromUrl(): {
  filters: ProductFilters;
  setFilters: (next: ProductFilters) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
} {
  const [params, setParams] = useSearchParams();
  const routeParams = useParams<{ slug?: string }>();
  const slugCategory = routeParams.slug;

  const filters = useMemo<ProductFilters>(() => {
    const out: ProductFilters = {};
    const search = params.get('search');
    if (search) out.search = search;

    for (const key of ARRAY_KEYS) {
      if (key === 'categories') continue;
      const values = params.getAll(key);
      if (values.length > 0) out[key] = values;
    }

    if (slugCategory) {
      out.categories = [slugCategory];
    } else {
      const [firstCategory] = params.getAll('categories');
      if (firstCategory) out.categories = [firstCategory];
    }

    const priceMin = params.get('priceMin');
    if (priceMin !== null) out.priceMin = Number(priceMin);
    const priceMax = params.get('priceMax');
    if (priceMax !== null) out.priceMax = Number(priceMax);

    const rating = params.get('rating');
    if (rating !== null) out.rating = Number(rating);

    const sort = params.get('sort');
    if (sort) out.sort = sort as ProductFilters['sort'];

    const page = Number(params.get('page') ?? '1');
    out.page = Number.isFinite(page) && page > 0 ? page : 1;
    out.pageSize = DEFAULT_PAGE_SIZE;

    return out;
  }, [params, slugCategory]);

  const setFilters = useCallback(
    (next: ProductFilters) => {
      const updated = new URLSearchParams();
      if (next.search) updated.set('search', next.search);

      for (const key of ARRAY_KEYS) {
        const values = next[key];
        if (values?.length) {
          for (const value of values) updated.append(key, value);
        }
      }

      if (next.priceMin !== undefined) updated.set('priceMin', String(next.priceMin));
      if (next.priceMax !== undefined) updated.set('priceMax', String(next.priceMax));
      if (next.rating !== undefined) updated.set('rating', String(next.rating));
      if (next.sort) updated.set('sort', next.sort);

      updated.set('page', '1');
      setParams(updated, { replace: true });
    },
    [setParams],
  );

  const resetFilters = useCallback(() => {
    setParams(new URLSearchParams(), { replace: true });
  }, [setParams]);

  const setPage = useCallback(
    (page: number) => {
      const updated = new URLSearchParams(params);
      updated.set('page', String(page));
      setParams(updated, { replace: true });
    },
    [params, setParams],
  );

  return { filters, setFilters, resetFilters, setPage };
}
