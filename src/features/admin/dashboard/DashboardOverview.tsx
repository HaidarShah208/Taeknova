import { BarChart3, Package, ShoppingCart, Users } from 'lucide-react';

import { AdminCard, StatsCard } from '@components/admin';
import { AnalyticsOverview } from '@features/admin/analytics/AnalyticsOverview';
import { ADMIN_ORDERS, ADMIN_PRODUCTS, ADMIN_USERS } from '@features/admin/data/mockAdminData';

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-white sm:text-3xl">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          Monitor ecommerce operations, stock, and team activity.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Revenue (30d)" value="PKR 2.84M" delta="+12.3%" icon={<BarChart3 className="h-4 w-4" />} />
        <StatsCard label="Orders" value={String(ADMIN_ORDERS.length)} delta="+8 today" icon={<ShoppingCart className="h-4 w-4" />} />
        <StatsCard label="Products" value={String(ADMIN_PRODUCTS.length)} delta="3 low stock" icon={<Package className="h-4 w-4" />} />
        <StatsCard label="Users" value={String(ADMIN_USERS.length)} delta="+1 pending invite" icon={<Users className="h-4 w-4" />} />
      </section>

      <AnalyticsOverview />

      <AdminCard title="Operational Notes">
        <ul className="space-y-2 text-sm text-slate-300">
          <li>- Bulk uniform order queue peaks on weekends; keep fulfillment slots open.</li>
          <li>- Inventory threshold alert recommended for stock below 25 units.</li>
          <li>- Enable daily export of order events for audit traceability.</li>
        </ul>
      </AdminCard>
    </div>
  );
}
