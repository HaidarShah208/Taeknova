import { ArrowLeft, ImageOff } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { AdminCard, StatusBadge } from '@components/admin';
import { Button } from '@components/ui/Button';
import { ROUTES } from '@constants/routes';
import { formatPrice } from '@lib/formatters';
import { orderStatusTone, paymentStatusTone } from '@lib/orderStatusTone';
import { useAdminGetOrderQuery } from '@redux/admin';

function snapshotField(snapshot: Record<string, unknown> | undefined, key: string): string {
  const value = snapshot?.[key];
  return typeof value === 'string' && value.trim() ? value.trim() : '—';
}

function money(value: string | number | undefined, currency: string): string {
  return formatPrice(Number(value ?? 0), {
    currency: currency === 'USD' ? 'USD' : 'PKR',
    locale: currency === 'USD' ? 'en-US' : 'en-PK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function OrderDetailView() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, isError, refetch } = useAdminGetOrderQuery(id, { skip: !id });

  if (isLoading) {
    return <p className="text-sm text-slate-600">Loading order…</p>;
  }

  if (isError || !order) {
    return (
      <div className="flex items-center gap-3">
        <p className="text-sm text-red-700">Could not load this order.</p>
        <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const snapshot = order.shippingAddressSnapshot as Record<string, unknown> | undefined;
  const addressLines = [
    [snapshotField(snapshot, 'line1'), snapshotField(snapshot, 'line2')]
      .filter((v) => v !== '—')
      .join(', '),
    [snapshotField(snapshot, 'city'), snapshotField(snapshot, 'state'), snapshotField(snapshot, 'postalCode')]
      .filter((v) => v !== '—')
      .join(', '),
    snapshotField(snapshot, 'country'),
  ].filter((line) => line && line !== '—');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="-ml-3 mb-2 text-slate-600"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate(ROUTES.adminOrders)}
          >
            Back to orders
          </Button>
          <h1 className="text-xl font-semibold text-slate-900">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Placed{' '}
            {new Date(order.createdAt).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge label={order.status} tone={orderStatusTone(order.status)} />
          <StatusBadge label={order.paymentStatus} tone={paymentStatusTone(order.paymentStatus)} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <AdminCard title="Items">
            <div className="divide-y divide-slate-100">
              {(order.items ?? []).map((line) => {
                const thumb = line.variant?.product?.imageUrls?.[0];
                return (
                  <div key={line.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                      {thumb ? (
                        <img src={thumb} alt={line.productName} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-300">
                          <ImageOff className="h-5 w-5" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">{line.productName}</p>
                      <p className="text-xs text-slate-500">
                        {line.variantLabel} · SKU {line.sku} · Qty {line.quantity}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-slate-900">
                      {money(line.lineTotal, order.currency)}
                    </p>
                  </div>
                );
              })}
              {(order.items ?? []).length === 0 && (
                <p className="py-3 text-sm text-slate-500">No items on this order.</p>
              )}
            </div>
          </AdminCard>

          <AdminCard title="Shipping address">
            <p className="text-sm font-medium text-slate-900">
              {snapshotField(snapshot, 'recipientName')}
            </p>
            {addressLines.map((line) => (
              <p key={line} className="text-sm text-slate-600">
                {line}
              </p>
            ))}
            <p className="mt-2 text-xs text-slate-500">Phone: {snapshotField(snapshot, 'phone')}</p>
            {order.customerNotes && (
              <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
                <span className="font-semibold text-slate-700">Customer note: </span>
                {order.customerNotes}
              </p>
            )}
          </AdminCard>

          {order.paymentProofUrl && (
            <AdminCard title="Payment proof">
              <a href={order.paymentProofUrl} target="_blank" rel="noreferrer" className="inline-block">
                <img
                  src={order.paymentProofUrl}
                  alt="Payment proof uploaded by customer"
                  className="max-h-96 w-full rounded-lg border border-slate-200 object-contain"
                />
              </a>
              <p className="mt-2 text-xs text-slate-500">Click the image to view full size.</p>
            </AdminCard>
          )}
        </div>

        <div className="space-y-6">
          <AdminCard title="Customer">
            <p className="text-sm font-medium text-slate-900">{order.user?.fullName ?? '—'}</p>
            <p className="text-xs text-slate-500">{order.user?.email ?? order.userId}</p>
          </AdminCard>

          <AdminCard title="Payment">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Method</dt>
                <dd className="font-medium text-slate-900">{order.paymentMethod ?? '—'}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Status</dt>
                <dd>
                  <StatusBadge label={order.paymentStatus} tone={paymentStatusTone(order.paymentStatus)} />
                </dd>
              </div>
            </dl>
          </AdminCard>

          <AdminCard title="Order summary">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Subtotal</dt>
                <dd className="text-slate-900">{money(order.subtotalAmount, order.currency)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Shipping</dt>
                <dd className="text-slate-900">{money(order.shippingAmount, order.currency)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Tax</dt>
                <dd className="text-slate-900">{money(order.taxAmount, order.currency)}</dd>
              </div>
              {Number(order.codFeeAmount ?? 0) > 0 && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">COD fee</dt>
                  <dd className="text-slate-900">{money(order.codFeeAmount, order.currency)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-semibold">
                <dt className="text-slate-900">Total</dt>
                <dd className="text-slate-900">{money(order.totalAmount, order.currency)}</dd>
              </div>
            </dl>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
