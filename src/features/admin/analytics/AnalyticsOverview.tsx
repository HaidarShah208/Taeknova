import { AdminCard } from '@components/admin';

export interface AnalyticsOverviewProps {
  productsTotal: number;
  categoriesCount: number;
  lowStockProducts: number;
  isLoading?: boolean;
}

export function AnalyticsOverview({
  productsTotal,
  categoriesCount,
  lowStockProducts,
  isLoading = false,
}: AnalyticsOverviewProps) {
  const display = (n: number) => (isLoading ? '…' : String(n));

  return (
    <AdminCard title="Catalog snapshot" description="Figures from the same APIs as the dashboard.">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Total products</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">{display(productsTotal)}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Categories</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">{display(categoriesCount)}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Low / out of stock (sample)</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">{display(lowStockProducts)}</p>
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-500">
        Trend and conversion charts are not wired yet; they need dedicated analytics endpoints.
      </p>
    </AdminCard>
  );
}
