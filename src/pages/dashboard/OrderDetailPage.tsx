import { Link, useParams } from 'react-router-dom';

import { Breadcrumb } from '@components/shared/Breadcrumb';
import { PageMeta } from '@components/layout/PageMeta';
import { Button, buttonVariants } from '@components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Container } from '@components/ui/Container';
import { ErrorState } from '@components/ui/ErrorState';
import { Loader } from '@components/ui/Loader';
import { ROUTES } from '@constants/routes';
import env from '@lib/env';
import { useCancelOrderMutation, useGetMyOrderQuery } from '@redux/customer';
import { cn } from '@lib/cn';
import { formatPrice } from '@lib/formatters';

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
              {new Date(order.createdAt).toLocaleString()} · {order.status} ·{' '}
              {order.paymentStatus}
            </p>
          </div>
          <p className="text-xl font-bold">{formatPrice(Number(order.totalAmount))}</p>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-base">Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(order.items ?? []).map((line) => (
              <div key={line.id} className="flex justify-between gap-4 text-sm">
                <span className="font-medium">
                  {line.productName} · {line.variantLabel} × {line.quantity}
                </span>
                <span className="shrink-0 font-semibold">
                  {formatPrice(Number(line.lineTotal))}
                </span>
              </div>
            ))}
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
