import { CheckCircle2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { PageMeta } from '@components/layout/PageMeta';
import { buttonVariants } from '@components/ui/Button';
import { Card, CardContent } from '@components/ui/Card';
import { Container } from '@components/ui/Container';
import { ROUTES } from '@constants/routes';
import { cn } from '@lib/cn';
import { formatPrice } from '@lib/formatters';

export interface OrderSuccessLocationState {
  orderId?: string;
  total?: number;
  currency?: string;
}

export default function OrderSuccessPage() {
  const location = useLocation();
  const state = (location.state as OrderSuccessLocationState | null) ?? null;

  return (
    <>
      <PageMeta title="Order placed" />
      <Container className="flex min-h-[60vh] items-center justify-center py-12">
        <Card className="w-full max-w-md border-border/80 text-center">
          <CardContent className="space-y-5 p-8">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Order placed!</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Thanks for shopping with us. We&apos;ve received your order
                {state?.orderId ? (
                  <>
                    {' '}
                    <span className="font-semibold text-foreground">
                      #{state.orderId.slice(0, 8).toUpperCase()}
                    </span>
                  </>
                ) : null}{' '}
                and will keep you updated on its progress.
              </p>
            </div>

            {state?.total != null && (
              <div className="rounded-xl bg-muted/40 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Order total
                </p>
                <p className="mt-1 text-xl font-bold tabular-nums">
                  {formatPrice(state.total, {
                    currency: state.currency === 'USD' ? 'USD' : 'PKR',
                    locale: state.currency === 'USD' ? 'en-US' : 'en-PK',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-center">
              <Link to={ROUTES.products} className={cn(buttonVariants({ size: 'lg' }), 'bg-foreground')}>
                Continue shopping
              </Link>
              {state?.orderId && (
                <Link
                  to={ROUTES.dashboardOrderDetails(state.orderId)}
                  className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
                >
                  View order
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
