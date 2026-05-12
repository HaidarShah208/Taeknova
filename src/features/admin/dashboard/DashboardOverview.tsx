import { BarChart3, Package, ShoppingCart, Tags } from 'lucide-react';

import { AdminCard, StatsCard } from '@components/admin';
import { AnalyticsOverview } from '@features/admin/analytics/AnalyticsOverview';
import { useAdminListCategoriesQuery, useAdminListProductsQuery } from '@redux/admin';

export function DashboardOverview() {
  const { data: productsData, isLoading: productsLoading, isError: productsError } =
    useAdminListProductsQuery({ page: 1, limit: 100 });
  const { data: categories, isLoading: categoriesLoading, isError: categoriesError } =
    useAdminListCategoriesQuery();

  const productsTotal = productsData?.pagination.total ?? 0;
  const categoriesCount = categories?.length ?? 0;
  const lowStockProducts =
    productsData?.items.filter(
      (p) => p.stockStatus === 'LOW_STOCK' || p.stockStatus === 'OUT_OF_STOCK',
    ).length ?? 0;

  const loading = productsLoading || categoriesLoading;
  const hasError = productsError || categoriesError;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Live metrics from your catalog API. Revenue and order rollups require additional reporting
          endpoints.
        </p>
      </header>

      {hasError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Some dashboard data could not be loaded. Check your session and API configuration.
        </p>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Revenue (30d)"
          value={loading ? '…' : '—'}
          delta="Reporting API not configured"
          icon={<BarChart3 className="h-4 w-4" />}
        />
        <StatsCard
          label="Orders (admin)"
          value={loading ? '…' : '—'}
          delta="Admin order list API not available"
          icon={<ShoppingCart className="h-4 w-4" />}
        />
        <StatsCard
          label="Products"
          value={loading ? '…' : String(productsTotal)}
          delta={`${lowStockProducts} low / out of stock (in first 100 rows)`}
          icon={<Package className="h-4 w-4" />}
        />
        <StatsCard
          label="Categories"
          value={loading ? '…' : String(categoriesCount)}
          delta="From /categories"
          icon={<Tags className="h-4 w-4" />}
        />
      </section>

      

      <AdminCard title="Operational notes">
        <p className="text-sm text-slate-700">
          Dashboard counts use authenticated admin APIs (<code className="text-xs">/products</code>,{' '}
          <code className="text-xs">/categories</code>). Extend the backend with admin analytics and
          order listing when you need full operations visibility.
        </p>
      </AdminCard>
    </div>
  );
}
