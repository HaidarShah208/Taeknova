import { Link } from 'react-router-dom';

import { PageMeta } from '@components/layout/PageMeta';
import { buttonVariants } from '@components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Container } from '@components/ui/Container';
import { EmptyState } from '@components/ui/EmptyState';
import { ErrorState } from '@components/ui/ErrorState';
import { Loader } from '@components/ui/Loader';
import { ROUTES } from '@constants/routes';
import env from '@lib/env';
import { useListAddressesQuery } from '@redux/customer';
import { cn } from '@lib/cn';

export default function AddressesPage() {
  const useApi = !env.enableMockApi;
  const { data, isLoading, isError, refetch } = useListAddressesQuery(undefined, { skip: !useApi });

  if (!useApi) {
    return (
      <>
        <PageMeta title="Addresses" />
        <Container className="py-8">
          <EmptyState
            title="Addresses (mock mode)"
            description="Set VITE_ENABLE_MOCK_API=false to manage saved addresses via the API."
            action={
              <Link to={ROUTES.dashboardProfile} className={cn(buttonVariants())}>
                Back to profile
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
        <ErrorState title="Could not load addresses" onRetry={() => void refetch()} />
      </Container>
    );
  }

  return (
    <>
      <PageMeta title="Saved addresses" />
      <div className="mx-auto max-w-5xl py-8">
        <h1 className="text-2xl font-bold tracking-tight">Saved addresses</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Addresses used at checkout. Full create/edit flows can extend this screen.
        </p>
        <div className="mt-8 space-y-4">
          {data.length === 0 ? (
            <EmptyState title="No addresses saved" description="Add an address at checkout first." />
          ) : (
            data.map((a) => (
              <Card key={a.id}>
                <CardHeader>
                  <CardTitle className="text-base">{a.label}</CardTitle>
                  {a.isDefault && (
                    <p className="text-xs font-semibold text-primary">Default shipping address</p>
                  )}
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">{a.recipientName}</p>
                  <p>
                    {a.line1}
                    {a.line2 ? `, ${a.line2}` : ''}
                  </p>
                  <p>
                    {a.city}
                    {a.state ? `, ${a.state}` : ''} {a.postalCode}
                  </p>
                  <p>{a.country}</p>
                  {a.phone && <p className="mt-2">{a.phone}</p>}
                </CardContent>
              </Card>
            ))
          )}
        </div>
        <Link
          to={ROUTES.dashboardProfile}
          className={cn(buttonVariants({ variant: 'outline' }), 'mt-8 inline-flex')}
        >
          Back to profile
        </Link>
      </div>
    </>
  );
}
