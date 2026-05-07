import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

import { PageMeta } from '@components/layout/PageMeta';
import { buttonVariants } from '@components/ui/Button';
import { Container } from '@components/ui/Container';
import { ROUTES } from '@constants/routes';
import { cn } from '@lib/cn';

export default function NotFoundPage() {
  return (
    <>
      <PageMeta title="Page not found" />
      <Container className="flex min-h-[80vh] flex-col items-center justify-center text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">404</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
          The page you&apos;re looking for moved, was renamed, or never existed. Try
          heading back to the homepage.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to={ROUTES.home}
            className={cn(buttonVariants({ size: 'lg' }))}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
          <Link
            to={ROUTES.products}
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
          >
            Browse products
          </Link>
        </div>
      </Container>
    </>
  );
}
