import { AlertTriangle } from 'lucide-react';
import { useMemo } from 'react';

import type { AdminProduct } from '@app-types/admin';
import { AdminCard, DataTable, StatusBadge } from '@components/admin';
import { useAdminListProductsQuery } from '@redux/admin';

type InventoryRow = {
  key: string;
  sku: string;
  product: string;
  productId: string;
  available: number;
};

function flattenInventory(products: AdminProduct[]): InventoryRow[] {
  const rows: InventoryRow[] = [];
  for (const p of products) {
    for (const v of p.variants ?? []) {
      rows.push({
        key: v.id,
        sku: v.sku,
        product: p.name,
        productId: p.id,
        available: v.stockQuantity,
      });
    }
  }
  return rows;
}

export function InventoryManagement() {
  const { data, isLoading, isError, refetch } = useAdminListProductsQuery({ page: 1, limit: 50 });
  const rows = useMemo(() => flattenInventory(data?.items ?? []), [data?.items]);

  return (
    <div className="space-y-6">
      <AdminCard
        title="Variant stock"
        description="Rows are built from the first page of GET /products (variants). Use product edit or inventory API to adjust stock."
      >
        {isError ? (
          <div className="mb-4 flex items-center gap-2">
            <p className="text-sm text-red-700">Could not load products.</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="text-sm font-semibold text-primary underline"
            >
              Retry
            </button>
          </div>
        ) : null}
        {isLoading ? (
          <p className="text-sm text-slate-600">Loading…</p>
        ) : (
          <DataTable
            data={rows}
            getRowKey={(row) => row.key}
            emptyMessage="No variants on the first page of results."
            columns={[
              { key: 'sku', header: 'SKU', render: (row) => row.sku },
              { key: 'product', header: 'Product', render: (row) => row.product },
              { key: 'available', header: 'Quantity', render: (row) => String(row.available) },
              {
                key: 'state',
                header: 'State',
                render: (row) => (
                  <StatusBadge
                    label={row.available < 30 ? 'Low stock' : 'OK'}
                    tone={row.available < 30 ? 'warning' : 'success'}
                  />
                ),
              },
            ]}
          />
        )}
      </AdminCard>

       
    </div>
  );
}
