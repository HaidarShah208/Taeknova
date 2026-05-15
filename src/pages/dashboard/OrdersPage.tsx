import { Link } from 'react-router-dom';

import { Breadcrumb } from '@components/shared/Breadcrumb';
import { PageMeta } from '@components/layout/PageMeta';
import { buttonVariants } from '@components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Container } from '@components/ui/Container';
import { EmptyState } from '@components/ui/EmptyState';
import { ErrorState } from '@components/ui/ErrorState';
import { Loader } from '@components/ui/Loader';
import { ROUTES } from '@constants/routes';
import env from '@lib/env';
import { useListMyOrdersQuery } from '@redux/customer';
import { cn } from '@lib/cn';
import { formatPrice } from '@lib/formatters';

export default function OrdersPage() {
  const useApi = !env.enableMockApi;
  const { data, isLoading, isError, refetch } = useListMyOrdersQuery(
    { page: 1, limit: 50 },
    { skip: !useApi },
  );

  if (!useApi) {
    return (
      <>
        <PageMeta title="Orders" />
        <Container className="py-8">
          <EmptyState
            title="Orders (mock mode)"
            description="Set VITE_ENABLE_MOCK_API=false to load your real orders from the API."
            action={
              <Link to={ROUTES.products} className={cn(buttonVariants())}>
                Continue shopping
              </Link>
            }
          />
        </Container>
      </>
    );
  }

  if (isLoading) {
    return (
      <Container className="flex min-h-[40vh] items-center justify-center py-12">
        <Loader size="lg" />
      </Container>
    );
  }

  if (isError || !data) {
    return (
      <Container className="py-8">
        <ErrorState
          title="Could not load orders"
          onRetry={() => {
            void refetch();
          }}
        />
      </Container>
    );
  }

  const orders = data.items;

  return (
    <>
      <PageMeta title="My orders" />
      <div className="mx-auto max-w-5xl py-8">
        <Breadcrumb items={[{ label: 'Orders' }]} />
        <h1 className="mt-4 text-2xl font-bold tracking-tight">My orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {orders.length === 0 ? 'No orders yet.' : `${orders.length} order(s)`}
        </p>

        <div className="mt-8 space-y-4">
          {orders.length === 0 ? (
            <EmptyState
              title="No orders yet"
              description="When you place an order, it will show up here."
              action={
                <Link to={ROUTES.products} className={cn(buttonVariants(),'bg-foreground')}>
                  Browse products
                </Link>
              }
            />
          ) : (
            orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">Order #{order.id.slice(0, 8)}</CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString()} · {order.status}
                    </p>
                  </div>
                  <p className="text-lg font-bold">{formatPrice(Number(order.totalAmount))}</p>
                </CardHeader>
                <CardContent>
                  <Link
                    to={ROUTES.dashboardOrderDetails(order.id)}
                    className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'inline-flex')}
                  >
                    View details
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
}
