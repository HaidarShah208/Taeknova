import { PageMeta } from '@components/layout/PageMeta';
import { AnalyticsOverview } from '@features/admin/analytics/AnalyticsOverview';
import { useAdminListCategoriesQuery, useAdminListProductsQuery } from '@redux/admin';

export default function AdminAnalyticsPage() {
  const { data: productsData, isLoading: productsLoading } = useAdminListProductsQuery({
    page: 1,
    limit: 100,
  });
  const { data: categories, isLoading: categoriesLoading } = useAdminListCategoriesQuery();

  const productsTotal = productsData?.pagination.total ?? 0;
  const categoriesCount = categories?.length ?? 0;
  const lowStockProducts =
    productsData?.items.filter(
      (p) => p.stockStatus === 'LOW_STOCK' || p.stockStatus === 'OUT_OF_STOCK',
    ).length ?? 0;
  const productStatusSeries = [
    {
      label: 'Approved',
      value: productsData?.items.filter((p) => p.status === 'APPROVED').length ?? 0,
      toneClass: 'bg-emerald-500',
    },
    {
      label: 'Pending',
      value: productsData?.items.filter((p) => p.status === 'PENDING').length ?? 0,
      toneClass: 'bg-amber-500',
    },
    {
      label: 'Rejected',
      value: productsData?.items.filter((p) => p.status === 'REJECTED').length ?? 0,
      toneClass: 'bg-rose-500',
    },
  ];

  return (
    <>
      <PageMeta title="Admin Analytics" />
      <div className="space-y-4">
        <header>
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Analytics</h1>
          <p className="mt-1 text-sm text-slate-600">
            Catalog snapshot from live APIs. Add backend reporting endpoints for revenue and funnels.
          </p>
        </header>
        <AnalyticsOverview
          productsTotal={productsTotal}
          categoriesCount={categoriesCount}
          lowStockProducts={lowStockProducts}
          productStatusSeries={productStatusSeries}
          isLoading={productsLoading || categoriesLoading}
        />
      </div>
    </>
  );
}
