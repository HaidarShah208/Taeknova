import { BarChart3, Package, ShoppingCart, Tags } from 'lucide-react';

import {  StatsCard } from '@components/admin';
import { useAdminListCategoriesQuery, useAdminListProductsQuery } from '@redux/admin';
import { useAdminListAllOrdersQuery } from '@redux/admin/orders';
import { useAdminOverviewAnalyticsQuery } from '@redux/analytics';
import { formatPrice } from '@lib/formatters';

export function DashboardOverview() {
  const { data: productsData, isLoading: productsLoading, isError: productsError } =
    useAdminListProductsQuery({ page: 1, limit: 100 });
  const { data: categories, isLoading: categoriesLoading, isError: categoriesError } =
    useAdminListCategoriesQuery();
  const { data: ordersData, isLoading: ordersLoading, isError: ordersError } = useAdminListAllOrdersQuery({
    page: 1,
    limit: 1,
  });
  const { data: analyticsData, isLoading: analyticsLoading, isError: analyticsError } =
    useAdminOverviewAnalyticsQuery();

  const productsTotal = productsData?.pagination.total ?? 0;
  const categoriesCount = categories?.length ?? 0;
  const lowStockProducts =
    productsData?.items.filter(
      (p) => p.stockStatus === 'LOW_STOCK' || p.stockStatus === 'OUT_OF_STOCK',
    ).length ?? 0;
  const ordersTotal = analyticsData?.allOrders ?? ordersData?.pagination.total ?? 0;
  const revenue30d = analyticsData?.revenue30d ?? 0;
  const revenueCurrency = analyticsData?.currency === 'PKR' ? 'PKR' : 'USD';

  const loading = productsLoading || categoriesLoading || ordersLoading || analyticsLoading;
  const hasError = productsError || categoriesError || ordersError || analyticsError;

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
          value={
            loading
              ? '…'
              : formatPrice(revenue30d, {
                  currency: revenueCurrency,
                  locale: revenueCurrency === 'PKR' ? 'en-PK' : 'en-US',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
          }
          delta={`${analyticsData?.ordersLast30d ?? 0} orders in last ${analyticsData?.windowDays ?? 30} days`}
          icon={<BarChart3 className="h-4 w-4" />}
        />
        <StatsCard
          label="Orders (admin)"
          value={loading ? '…' : String(ordersTotal)}
          delta="From admin order records"
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

      

       
    </div>
  );
}
