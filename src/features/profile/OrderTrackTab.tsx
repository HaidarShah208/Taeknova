import { Check, Package } from 'lucide-react';
import { Fragment } from 'react';

import type { OrderDto } from '@app-types/storeApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/Card';
import { Loader } from '@components/ui/Loader';
import { formatPrice } from '@lib/formatters';
import { cn } from '@lib/cn';
import env from '@lib/env';
import { useListMyOrdersQuery } from '@redux/customer';

const STEPS = [
  { label: 'Order placed', hint: 'Checkout complete' },
  { label: 'Approved', hint: 'Store accepted your order' },
  { label: 'On the way', hint: 'Shipped to you' },
  { label: 'Delivered', hint: 'Arrived' },
] as const;

function lastCompletedStepIndex(status: string): number {
  if (status === 'CANCELLED') return -1;
  if (status === 'PENDING') return 0;
  if (status === 'CONFIRMED' || status === 'PROCESSING') return 1;
  if (status === 'SHIPPED') return 2;
  if (status === 'DELIVERED') return 3;
  return 0;
}

function OrderTimeline({ status }: { status: string }) {
  if (status === 'CANCELLED') {
    return (
      <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm font-medium text-destructive">
        This order was cancelled. If you were charged, contact support.
      </p>
    );
  }

  const lastDone = lastCompletedStepIndex(status);

  return (
    <div className="overflow-x-auto pb-1 pt-1">
      <div className="min-w-[480px] space-y-3">
        <div className="flex items-center px-1">
          {STEPS.map((step, i) => {
            const complete = i <= lastDone;
            const current = !complete && i === lastDone + 1;
            return (
              <Fragment key={step.label}>
                {i > 0 ? (
                  <div
                    className={cn(
                      'h-0.5 min-w-[8px] flex-1',
                      lastDone >= i ? 'bg-primary' : 'bg-border',
                    )}
                    aria-hidden
                  />
                ) : null}
                <div
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors',
                    complete && 'border-primary bg-primary text-primary-foreground',
                    current && 'border-primary bg-background text-primary ring-2 ring-primary/30',
                    !complete && !current && 'border-muted-foreground/25 bg-muted/40 text-muted-foreground',
                  )}
                >
                  {complete ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
                </div>
              </Fragment>
            );
          })}
        </div>
        <div className="flex justify-between gap-1 px-0.5 text-center">
          {STEPS.map((step, i) => {
            const complete = i <= lastDone;
            const current = !complete && i === lastDone + 1;
            return (
              <div key={`${step.label}-lbl`} className="min-w-0 flex-1 px-0.5">
                <p
                  className={cn(
                    'text-[11px] font-semibold leading-tight sm:text-xs',
                    complete || current ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {step.label}
                </p>
                <p className="mt-0.5 hidden text-[10px] text-muted-foreground sm:line-clamp-2">{step.hint}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: OrderDto }) {
  return (
    <Card className="overflow-hidden border-border/80">
      <CardHeader className="border-b border-border/60 bg-muted/20 py-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base font-semibold">Order #{order.id.slice(0, 8)}</CardTitle>
            <CardDescription className="mt-1">
              {new Date(order.createdAt).toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
              {' · '}
              <span className="font-medium text-foreground">{order.status.replace(/_/g, ' ')}</span>
            </CardDescription>
          </div>
          <p className="text-lg font-bold tabular-nums">
            {formatPrice(Number(order.totalAmount), {
              currency: order.currency === 'USD' ? 'USD' : 'PKR',
              locale: order.currency === 'USD' ? 'en-US' : 'en-PK',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        <OrderTimeline status={order.status} />
        {order.items && order.items.length > 0 ? (
          <ul className="space-y-2 border-t border-border/60 pt-4 text-sm">
            {order.items.map((line) => (
              <li key={line.id} className="flex justify-between gap-3 text-muted-foreground">
                <span className="min-w-0 truncate">
                  {line.productName}{' '}
                  <span className="text-xs">({line.variantLabel}) × {line.quantity}</span>
                </span>
                <span className="shrink-0 font-medium text-foreground tabular-nums">
                  {formatPrice(Number(line.lineTotal), {
                    currency: order.currency === 'USD' ? 'USD' : 'PKR',
                    locale: order.currency === 'USD' ? 'en-US' : 'en-PK',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function OrderTrackTab() {
  const apiMode = !env.enableMockApi;

  const { data, isLoading, isError, refetch } = useListMyOrdersQuery(
    { page: 1, limit: 25 },
    { skip: !apiMode },
  );

  if (!apiMode) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Track orders</CardTitle>
          <CardDescription>Connect to the live API to sync orders from checkout.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center py-12">
        <Loader size="md" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Could not load orders</CardTitle>
          <CardDescription>Try again in a moment.</CardDescription>
        </CardHeader>
        <CardContent>
          <button
            type="button"
            className="text-sm font-semibold text-primary underline"
            onClick={() => void refetch()}
          >
            Retry
          </button>
        </CardContent>
      </Card>
    );
  }

  const items = data?.items ?? [];

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" aria-hidden />
            No orders yet
          </CardTitle>
          <CardDescription>When you place an order, progress appears here automatically.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Follow each order from checkout through store approval, shipping, and delivery.
      </p>
      <ul className="space-y-5">
        {items.map((order) => (
          <li key={order.id}>
            <OrderCard order={order} />
          </li>
        ))}
      </ul>
    </div>
  );
}
