import { AdminCard } from '@components/admin';

const SALES_SERIES = [42, 58, 64, 56, 72, 78, 84];

export function AnalyticsOverview() {
  return (
    <AdminCard title="Analytics" description="Weekly revenue momentum and conversion trend.">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Revenue trend</p>
          <div className="mt-3 flex h-36 items-end gap-2">
            {SALES_SERIES.map((value, index) => (
              <span
                key={`${value}-${index}`}
                className="flex-1 rounded-t bg-gradient-to-t from-accent to-secondary"
                style={{ height: `${value}%` }}
              />
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Conversion</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">6.8%</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Avg. Order Value</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">PKR 17,430</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Returning Customers</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">38%</p>
          </div>
        </div>
      </div>
    </AdminCard>
  );
}
