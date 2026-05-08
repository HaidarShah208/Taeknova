import { AlertTriangle } from 'lucide-react';

import { AdminCard, DataTable, StatusBadge } from '@components/admin';
import { ADMIN_INVENTORY } from '@features/admin/data/mockAdminData';

export function InventoryManagement() {
  return (
    <div className="space-y-6">
      <AdminCard title="Stock Management" description="Warehouse-level available and reserved stock.">
        <DataTable
          data={ADMIN_INVENTORY}
          getRowKey={(row) => row.sku}
          columns={[
            { key: 'sku', header: 'SKU', render: (row) => row.sku },
            { key: 'product', header: 'Product', render: (row) => row.product },
            { key: 'warehouse', header: 'Warehouse', render: (row) => row.warehouse },
            { key: 'available', header: 'Available', render: (row) => row.available },
            { key: 'reserved', header: 'Reserved', render: (row) => row.reserved },
            {
              key: 'state',
              header: 'State',
              render: (row) => (
                <StatusBadge
                  label={row.available < 30 ? 'low stock' : 'healthy'}
                  tone={row.available < 30 ? 'warning' : 'success'}
                />
              ),
            },
          ]}
        />
      </AdminCard>

      <AdminCard title="Inventory Alerts">
        <div className="flex items-start gap-2 rounded-lg border border-amber-400/30 bg-amber-500/10 p-3 text-sm text-amber-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          Enable automated re-order points at 25 units to avoid stockouts in peak season.
        </div>
      </AdminCard>
    </div>
  );
}
