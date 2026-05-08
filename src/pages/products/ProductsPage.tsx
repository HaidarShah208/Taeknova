import { Filter } from 'lucide-react';
import { useState } from 'react';

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
import { useGetCategoriesQuery } from '@redux/categories';
import { useGetProductsQuery, useProductFiltersFromUrl } from '@redux/products';

const SORT_OPTIONS = [
  { value: 'new', label: 'Newest' },
  { value: 'popular', label: 'Most popular' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top rated' },
];

export default function ProductsPage() {
  const { filters, setFilters, resetFilters, setPage } = useProductFiltersFromUrl();
  const [isFilterOpen, setFilterOpen] = useState(false);

  const { data: categoriesData } = useGetCategoriesQuery();
  const { data, isLoading, isError, refetch, isFetching } = useGetProductsQuery(filters);

  const products = data?.data ?? [];
  const meta = data?.meta;
  const categories = categoriesData ?? [];

  return (
    <>
      <PageMeta
        title="Shop premium uniforms"
        description="Browse Tikwando's full collection of premium custom team uniforms."
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
          className="border-0 p-0"
        />
      </Drawer>
    </>
  );
}
