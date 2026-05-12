import { useMemo, useState } from 'react';

import { AdminCard, DataTable, Pagination, StatusBadge } from '@components/admin';
import { Button } from '@components/ui/Button';
import { formatPrice } from '@lib/formatters';
import type { OrderDto } from '@app-types/storeApi';
import { useAdminListAllOrdersQuery } from '@redux/admin';

const PAGE_SIZE = 15;

function snapshotRecipient(o: OrderDto): string {
  const s = o.shippingAddressSnapshot as Record<string, unknown> | undefined;
  if (!s || typeof s !== 'object') return '—';
  const name = s.recipientName;
  if (typeof name === 'string' && name.trim()) return name.trim();
  const line1 = s.line1;
  if (typeof line1 === 'string' && line1.trim()) return line1.trim();
  return '—';
}

function orderStatusTone(s: string): 'success' | 'warning' | 'danger' | 'neutral' {
  if (s === 'DELIVERED') return 'success';
  if (s === 'SHIPPED') return 'success';
  if (s === 'CANCELLED') return 'danger';
  if (s === 'PENDING') return 'warning';
  return 'neutral';
}

export function OrdersManagement() {
  const [page, setPage] = useState(1);

  const listArg = useMemo(() => ({ page, limit: PAGE_SIZE }), [page]);

  const { data, isLoading, isError, refetch, isFetching } = useAdminListAllOrdersQuery(listArg);

  const items = data?.items ?? [];
  const totalPages = Math.max(1, data?.pagination.pages ?? 1);

  return (
    <div className="space-y-6">
      <AdminCard
        title="Orders"
        description="All customer orders, newest first. Use your database or future filters for large volumes."
      >
        {isError ? (
          <div className="mb-4 flex items-center gap-3">
            <p className="text-sm text-red-700">Could not load orders.</p>
            <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
              Retry
            </Button>
          </div>
        ) : null}

        {isLoading ? (
          <p className="text-sm text-slate-600">Loading orders…</p>
        ) : (
          <DataTable
            data={items}
            getRowKey={(row) => row.id}
            emptyMessage="No orders yet. Customer checkouts will appear here."
            columns={[
              {
                key: 'id',
                header: 'Order',
                render: (row) => (
                  <span className="font-mono text-xs text-slate-700">{row.id.slice(0, 8)}…</span>
                ),
              },
              {
                key: 'customer',
                header: 'Customer',
                render: (row) => (
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {row.user?.fullName ?? '—'}
                    </p>
                    <p className="truncate text-xs text-slate-500">{row.user?.email ?? row.userId}</p>
                  </div>
                ),
              },
              {
                key: 'ship',
                header: 'Ship to',
                render: (row) => (
                  <span className="line-clamp-2 text-xs text-slate-600">{snapshotRecipient(row)}</span>
                ),
              },
              {
                key: 'items',
                header: 'Lines',
                render: (row) => String(row.items?.length ?? 0),
              },
              {
                key: 'total',
                header: 'Total',
                render: (row) =>
                  formatPrice(Number(row.totalAmount), {
                    currency: row.currency === 'USD' ? 'USD' : 'PKR',
                    locale: row.currency === 'USD' ? 'en-US' : 'en-PK',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }),
              },
              {
                key: 'status',
                header: 'Status',
                render: (row) => (
                  <StatusBadge label={row.status} tone={orderStatusTone(row.status)} />
                ),
              },
              {
                key: 'date',
                header: 'Placed',
                render: (row) => (
                  <span className="whitespace-nowrap text-xs text-slate-600">
                    {new Date(row.createdAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                ),
              },
            ]}
          />
        )}

        <div className="mt-4">
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
        {isFetching && !isLoading ? (
          <p className="mt-2 text-xs text-slate-500">Updating…</p>
        ) : null}
      </AdminCard>
    </div>
  );
}
