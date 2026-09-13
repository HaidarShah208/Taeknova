import { Link, useParams } from 'react-router-dom';

import { Breadcrumb } from '@components/shared/Breadcrumb';
import { PageMeta } from '@components/layout/PageMeta';
import { OrderTrackingTimeline } from '@components/shared/OrderTrackingTimeline';
import { Button, buttonVariants } from '@components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Container } from '@components/ui/Container';
import { ErrorState } from '@components/ui/ErrorState';
import { Loader } from '@components/ui/Loader';
import { StatusBadge } from '@components/ui/StatusBadge';
import { ROUTES } from '@constants/routes';
import env from '@lib/env';
import { useCancelOrderMutation, useGetMyOrderQuery } from '@redux/customer';
import { cn } from '@lib/cn';
import { formatPrice } from '@lib/formatters';
import { orderStatusTone, paymentStatusTone } from '@lib/orderStatusTone';

function snapshotField(snapshot: Record<string, unknown> | undefined, key: string): string {
  const value = snapshot?.[key];
  return typeof value === 'string' && value.trim() ? value.trim() : '—';
}

export default function OrderDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const useApi = !env.enableMockApi;
  const { data: order, isLoading, isError, refetch } = useGetMyOrderQuery(id, { skip: !useApi || !id });
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  if (!useApi) {
    return (
      <Container className="py-8">
        <p className="text-sm text-muted-foreground">Enable the real API to view order details.</p>
        <Link to={ROUTES.dashboardOrders} className={cn(buttonVariants({ variant: 'outline' }), 'mt-4 inline-flex')}>
          Back to orders
        </Link>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container className="flex min-h-[40vh] items-center justify-center py-12">
        <Loader size="lg" />
      </Container>
    );
  }

  if (isError || !order) {
    return (
      <Container className="py-8">
        <ErrorState title="Order not found" onRetry={() => void refetch()} />
      </Container>
    );
  }

  const handleCancel = async () => {
    await cancelOrder(order.id).unwrap();
  };

  const money = (value: string | number | undefined) =>
    formatPrice(Number(value ?? 0), {
      currency: order.currency === 'USD' ? 'USD' : 'PKR',
      locale: order.currency === 'USD' ? 'en-US' : 'en-PK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

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
    <>
      <PageMeta title={`Order ${order.id.slice(0, 8)}`} />
      <div className="mx-auto max-w-3xl py-8">
        <Breadcrumb
          items={[
            { label: 'Orders', to: ROUTES.dashboardOrders },
            { label: `Order #${order.id.slice(0, 8)}` },
          ]}
        />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Order details</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {new Date(order.createdAt).toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge label={order.status} tone={orderStatusTone(order.status)} />
              <StatusBadge label={order.paymentStatus} tone={paymentStatusTone(order.paymentStatus)} />
            </div>
          </div>
          <p className="text-xl font-bold">{money(order.totalAmount)}</p>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-base">Order status</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderTrackingTimeline status={order.status} />
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(order.items ?? []).map((line) => (
              <div key={line.id} className="flex justify-between gap-4 text-sm">
                <span className="font-medium">
                  {line.productName} · {line.variantLabel} × {line.quantity}
                </span>
                <span className="shrink-0 font-semibold">{money(line.lineTotal)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Shipping address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-sm font-medium">{snapshotField(snapshot, 'recipientName')}</p>
            {addressLines.map((line) => (
              <p key={line} className="text-sm text-muted-foreground">
                {line}
              </p>
            ))}
            <p className="pt-1 text-xs text-muted-foreground">
              Phone: {snapshotField(snapshot, 'phone')}
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Order summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment method</span>
              <span className="font-medium">{order.paymentMethod ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{money(order.subtotalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{money(order.shippingAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>{money(order.taxAmount)}</span>
            </div>
            {Number(order.codFeeAmount ?? 0) > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">COD fee</span>
                <span>{money(order.codFeeAmount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
              <span>Total</span>
              <span>{money(order.totalAmount)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to={ROUTES.dashboardOrders} className={cn(buttonVariants({ variant: 'outline' }))}>
            Back to orders
          </Link>
          {order.status !== 'CANCELLED' &&
            order.status !== 'SHIPPED' &&
            order.status !== 'DELIVERED' && (
              <Button variant="destructive" isLoading={isCancelling} onClick={() => void handleCancel()}>
                Cancel order
              </Button>
            )}
        </div>
      </div>
    </>
  );
}
