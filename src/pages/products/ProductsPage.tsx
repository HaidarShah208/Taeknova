import { Filter } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { Breadcrumb } from '@components/shared/Breadcrumb';
import { FilterSidebar } from '@components/shared/FilterSidebar';
import { ProductGrid } from '@components/shared/ProductGrid';
import { PageMeta } from '@components/layout/PageMeta';
import { Button } from '@components/ui/Button';
import { Container } from '@components/ui/Container';
import { Drawer } from '@components/ui/Drawer';
import { EmptyState } from '@components/ui/EmptyState';
import { ErrorState } from '@components/ui/ErrorState';
import { Pagination } from '@components/ui/Pagination';
import { Select } from '@components/ui/Select';
import { ROUTES } from '@constants/routes';
import env from '@lib/env';
import { useGetCategoriesQuery } from '@redux/categories';
import { useListPublicCategoriesQuery } from '@redux/customer';
import { useProductFiltersFromUrl } from '@redux/products';
import { mapPublicCategoryToUi } from '@services/catalogMappers';
import { useUnifiedProductListing } from '@hooks/commerce/useUnifiedProductListing';

const SORT_OPTIONS = [
  { value: 'new', label: 'Newest' },
  { value: 'popular', label: 'Most popular' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top rated' },
];

const PRICE_SLIDER_STEP = 500;
const DEFAULT_PRICE_CEILING = 10_000;

export default function ProductsPage() {
  const { filters, setFilters, resetFilters, setPage } = useProductFiltersFromUrl();
  const routeParams = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [priceSliderCeiling, setPriceSliderCeiling] = useState(DEFAULT_PRICE_CEILING);

  const exitCategoryRouteToAllProducts = useCallback(() => {
    if (!routeParams.slug) return;
    const q = searchParams.toString();
    navigate({ pathname: ROUTES.products, search: q ? `?${q}` : undefined }, { replace: true });
  }, [navigate, routeParams.slug, searchParams]);

  const useApiCatalog = !env.enableMockApi;
  const { data: publicCategories } = useListPublicCategoriesQuery(undefined, { skip: !useApiCatalog });
  const { data: mockCategories } = useGetCategoriesQuery(undefined, { skip: useApiCatalog });

  const categories = useMemo(() => {
    if (useApiCatalog) return (publicCategories ?? []).map(mapPublicCategoryToUi);
    return mockCategories ?? [];
  }, [mockCategories, publicCategories, useApiCatalog]);

  const { data, isLoading, isError, refetch, isFetching } = useUnifiedProductListing(filters);

  const products = data?.data ?? [];
  const meta = data?.meta;

  /** Grow max-price slider with the highest price seen (current page + URL filter), in PKR steps of 500 */
  useEffect(() => {
    const pageMax = products.reduce((m, p) => Math.max(m, p.price), 0);
    const urlMax = filters.priceMax ?? 0;
    const peak = Math.max(pageMax, urlMax);
    if (peak <= 0) return;
    const snapped = Math.ceil(peak / PRICE_SLIDER_STEP) * PRICE_SLIDER_STEP;
    setPriceSliderCeiling((prev) => Math.max(prev, snapped, DEFAULT_PRICE_CEILING));
  }, [products, filters.priceMax]);

  return (
    <>
      <PageMeta
        title="Shop premium uniforms"
        description="Browse Tiknova's full collection of premium custom team uniforms."
      />
      <Container className="py-8 lg:py-12">
        <Breadcrumb items={[{ label: 'Shop', to: '/products' }]} />
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">All products</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {meta ? `${meta.total} items` : 'Browse our full catalog'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              leftIcon={<Filter className="h-4 w-4" />}
              onClick={() => setFilterOpen(true)}
              className="lg:hidden"
            >
              Filters
            </Button>
            <Select
              aria-label="Sort by"
              size="md"
              options={SORT_OPTIONS}
              value={filters.sort ?? 'new'}
              onChange={(event) =>
                setFilters({ ...filters, sort: event.target.value as never })
              }
              containerClassName="min-w-[180px]"
            />
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
          <div className="hidden lg:block">
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              onReset={resetFilters}
              categories={categories}
              priceSliderMax={priceSliderCeiling}
              onExitCategoryRoute={exitCategoryRouteToAllProducts}
            />
          </div>

          <div>
            {isError ? (
              <ErrorState
                onRetry={() => {
                  void refetch();
                }}
              />
            ) : !isLoading && products.length === 0 ? (
              <EmptyState
                title="No products match your filters"
                description="Try adjusting your filters or clearing them to see more results."
                action={<Button onClick={resetFilters}>Clear filters</Button>}
              />
            ) : (
              <>
                <ProductGrid
                  products={products}
                  isLoading={isLoading || isFetching}
                  columns={3}
                  skeletonCount={9}
                />
                {meta && meta.totalPages > 1 && (
                  <div className="mt-10">
                    <Pagination
                      page={meta.page}
                      totalPages={meta.totalPages}
                      onChange={setPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Container>

      <Drawer
        isOpen={isFilterOpen}
        onClose={() => setFilterOpen(false)}
        title="Filters"
        side="left"
        size="lg"
      >
        <FilterSidebar
          filters={filters}
          onChange={(next) => {
            setFilters(next);
          }}
          onReset={() => {
            resetFilters();
            setFilterOpen(false);
          }}
          categories={categories}
          priceSliderMax={priceSliderCeiling}
          onExitCategoryRoute={exitCategoryRouteToAllProducts}
          className="border-0 p-0"
        />
      </Drawer>
    </>
  );
}
