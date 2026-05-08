import { useMemo, useState } from 'react';

import { AdminCard, DataTable, Filters, Pagination, SearchBar, StatusBadge } from '@components/admin';
import { ADMIN_ORDERS, type AdminOrder } from '@features/admin/data/mockAdminData';
import { formatPrice } from '@lib/formatters';

const PAGE_SIZE = 6;

export function OrdersManagement() {
  const [orders, setOrders] = useState<AdminOrder[]>(ADMIN_ORDERS);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);

  const handleOrderDecision = (id: string, nextStatus: AdminOrder['status']) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status: nextStatus } : order)),
    );
  };

  const filtered = useMemo(
    () =>
      orders.filter((order) => {
        const search = `${order.id} ${order.customer}`.toLowerCase().includes(query.toLowerCase());
        const matchStatus = status === 'all' || order.status === status;
        return search && matchStatus;
      }),
    [orders, query, status],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <AdminCard title="Order Management" description="Track order flow and fulfillment states.">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="w-full max-w-md">
          <SearchBar value={query} onChange={setQuery} placeholder="Search by order or customer..." />
        </div>
        <Filters
          value={status}
          onChange={setStatus}
          options={[
            { label: 'All status', value: 'all' },
            { label: 'Processing', value: 'processing' },
            { label: 'Shipped', value: 'shipped' },
            { label: 'Delivered', value: 'delivered' },
            { label: 'Cancelled', value: 'cancelled' },
          ]}
        />
      </div>

      <DataTable
        data={paginated}
        getRowKey={(row) => row.id}
        columns={[
          { key: 'id', header: 'Order', render: (row) => row.id },
          { key: 'customer', header: 'Customer', render: (row) => row.customer },
          { key: 'items', header: 'Items', render: (row) => row.items },
          { key: 'date', header: 'Date', render: (row) => row.date },
          {
            key: 'amount',
            header: 'Amount',
            render: (row) =>
              formatPrice(row.amount, {
                currency: 'PKR',
                locale: 'en-PK',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
          },
          {
            key: 'status',
            header: 'Status',
            render: (row) => (
              <StatusBadge
                label={row.status}
                tone={
                  row.status === 'delivered'
                    ? 'success'
                    : row.status === 'cancelled'
                      ? 'danger'
                      : row.status === 'shipped'
                        ? 'info'
                        : 'warning'
                }
              />
            ),
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (row) => {
              const isFinal = row.status === 'delivered' || row.status === 'cancelled';

              return (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isFinal}
                    onClick={() => handleOrderDecision(row.id, 'delivered')}
                    className="rounded-md border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    disabled={isFinal}
                    onClick={() => handleOrderDecision(row.id, 'cancelled')}
                    className="rounded-md border border-rose-300 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              );
            },
          },
        ]}
      />

      <div className="mt-4">
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </AdminCard>
  );
}
