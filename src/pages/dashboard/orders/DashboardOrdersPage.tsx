import { Package } from 'lucide-react';

import { PageMeta } from '@components/layout/PageMeta';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { EmptyState } from '@components/ui/EmptyState';

export default function DashboardOrdersPage() {
  return (
    <>
      <PageMeta title="My Orders" />
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Dashboard
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">My Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track all your placed orders and delivery progress.
        </p>
      </header>

      <Card className="mt-8" padding="lg">
        <CardHeader>
          <CardTitle>Order history</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="Your orders will appear here once you place your first order."
          />
        </CardContent>
      </Card>
    </>
  );
}
