import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { AdminCard, ConfirmModal, DataTable, Pagination, StatusBadge } from '@components/admin';
import { Button } from '@components/ui/Button';
import { formatPrice } from '@lib/formatters';
import type { OrderDto } from '@app-types/storeApi';
import {
  useAdminApproveOrderMutation,
  useAdminDeliverOrderMutation,
  useAdminListAllOrdersQuery,
  useAdminRejectOrderMutation,
  useAdminShipOrderMutation,
} from '@redux/admin';

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
  if (s === 'CONFIRMED' || s === 'PROCESSING') return 'neutral';
  return 'neutral';
}

export function OrdersManagement() {
  const [page, setPage] = useState(1);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);

  const listArg = useMemo(() => ({ page, limit: PAGE_SIZE }), [page]);

  const { data, isLoading, isError, refetch, isFetching } = useAdminListAllOrdersQuery(listArg);
  const [approveOrder] = useAdminApproveOrderMutation();
  const [rejectOrder] = useAdminRejectOrderMutation();
  const [shipOrder] = useAdminShipOrderMutation();
  const [deliverOrder] = useAdminDeliverOrderMutation();

  const items = data?.items ?? [];
  const totalPages = Math.max(1, data?.pagination.pages ?? 1);

  const run = async (id: string, action: () => Promise<unknown>, success: string) => {
    setProcessingId(id);
    try {
      await action();
      toast.success(success);
    } catch {
      toast.error('Action failed');
    } finally {
      setProcessingId(null);
    }
  };

  const confirmReject = async () => {
    if (!rejectId) return;
    const id = rejectId;
    setRejectId(null);
    await run(id, () => rejectOrder(id).unwrap(), 'Order rejected');
  };

  return (
    <div className="space-y-6">
      <AdminCard
        title="Orders"
        description="Review new orders, accept or reject, then mark shipped and delivered so customers see progress on Track orders."
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
          <div className="max-w-full overflow-x-auto">
            <DataTable
              data={items}
              getRowKey={(row) => row.id}
              emptyMessage="No orders yet. Customer checkouts will appear here."
              tableClassName="min-w-[1180px]"
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
                    <div className="min-w-[140px]">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {row.user?.fullName ?? '—'}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {row.user?.email ?? row.userId}
                      </p>
                    </div>
                  ),
                },
                {
                  key: 'ship',
                  header: 'Ship to',
                  render: (row) => (
                    <span className="line-clamp-2 min-w-[120px] max-w-[200px] text-xs text-slate-600">
                      {snapshotRecipient(row)}
                    </span>
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
                {
                  key: 'actions',
                  header: 'Actions',
                  render: (row) => {
                    const busy = processingId === row.id;
                    return (
                      <div className="flex min-w-[260px] flex-wrap items-center gap-1.5">
                        {row.status === 'PENDING' ? (
                          <>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="border-emerald-600/40 text-emerald-800 hover:bg-emerald-50"
                              isLoading={busy}
                              disabled={Boolean(processingId && processingId !== row.id)}
                              onClick={() =>
                                void run(row.id, () => approveOrder(row.id).unwrap(), 'Order accepted')
                              }
                            >
                              Accept
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="border-destructive/40 text-destructive hover:bg-destructive/5"
                              disabled={Boolean(processingId)}
                              onClick={() => setRejectId(row.id)}
                            >
                              Reject
                            </Button>
                          </>
                        ) : null}
                        {row.status === 'CONFIRMED' || row.status === 'PROCESSING' ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            isLoading={busy}
                            disabled={Boolean(processingId && processingId !== row.id)}
                            onClick={() =>
                              void run(row.id, () => shipOrder(row.id).unwrap(), 'Marked as shipped')
                            }
                          >
                            Ship
                          </Button>
                        ) : null}
                        {row.status === 'SHIPPED' ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            isLoading={busy}
                            disabled={Boolean(processingId && processingId !== row.id)}
                            onClick={() =>
                              void run(
                                row.id,
                                () => deliverOrder(row.id).unwrap(),
                                'Marked as delivered',
                              )
                            }
                          >
                            Deliver
                          </Button>
                        ) : null}
                        {['DELIVERED', 'CANCELLED'].includes(row.status) ? (
                          <span className="text-xs text-muted-foreground">—</span>
                        ) : null}
                      </div>
                    );
                  },
                },
              ]}
            />
          </div>
        )}

        <div className="mt-4">
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
        {isFetching && !isLoading ? (
          <p className="mt-2 text-xs text-slate-500">Updating…</p>
        ) : null}
      </AdminCard>

      <ConfirmModal
        isOpen={Boolean(rejectId)}
        title="Reject this order?"
        description="Stock will be returned to inventory and the customer will see this order as cancelled."
        confirmLabel="Reject order"
        onClose={() => setRejectId(null)}
        onConfirm={() => void confirmReject()}
      />
    </div>
  );
}
