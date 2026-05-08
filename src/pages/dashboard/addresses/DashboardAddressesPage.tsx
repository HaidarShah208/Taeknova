import { MapPin } from 'lucide-react';

import { PageMeta } from '@components/layout/PageMeta';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { EmptyState } from '@components/ui/EmptyState';

export default function DashboardAddressesPage() {
  return (
    <>
      <PageMeta title="My Addresses" />
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Dashboard
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Saved Addresses</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your shipping and billing addresses.
        </p>
      </header>

      <Card className="mt-8" padding="lg">
        <CardHeader>
          <CardTitle>Address book</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={MapPin}
            title="No addresses added"
            description="Save an address to speed up checkout."
          />
        </CardContent>
      </Card>
    </>
  );
}
