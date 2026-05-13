import { AdminCard } from '@components/admin';

export interface AnalyticsOverviewProps {
  productsTotal: number;
  categoriesCount: number;
  lowStockProducts: number;
  productStatusSeries: Array<{ label: string; value: number; toneClass: string }>;
  isLoading?: boolean;
}

export function AnalyticsOverview({
  productsTotal,
  categoriesCount,
  lowStockProducts,
  productStatusSeries,
  isLoading = false,
}: AnalyticsOverviewProps) {
  const display = (n: number) => (isLoading ? '…' : String(n));
  const maxSeriesValue = Math.max(1, ...productStatusSeries.map((s) => s.value));

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
      <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
        <p className="mb-3 text-sm font-semibold text-slate-900">Product status chart</p>
        {isLoading ? (
          <p className="text-xs text-slate-500">Loading chart…</p>
        ) : (
          <div className="space-y-3">
            {productStatusSeries.map((point) => {
              const widthPct = Math.max(6, Math.round((point.value / maxSeriesValue) * 100));
              return (
                <div key={point.label} className="grid grid-cols-[90px_1fr_40px] items-center gap-3">
                  <span className="text-xs font-medium text-slate-600">{point.label}</span>
                  <div className="h-2.5 rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${point.toneClass}`} style={{ width: `${widthPct}%` }} />
                  </div>
                  <span className="text-right text-xs font-semibold text-slate-700">{point.value}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminCard>
  );
}
