import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { ProductGrid } from '@components/shared/ProductGrid';
import { SectionWrapper } from '@components/shared/SectionWrapper';
import { buttonVariants } from '@components/ui/Button';
import { ROUTES } from '@constants/routes';
import env from '@lib/env';
import { cn } from '@lib/cn';
import { useListPublicProductsQuery } from '@redux/customer';
import { useGetNewArrivalsQuery } from '@redux/products';
import { mapPublicProductToUi } from '@services/catalogMappers';

const NEW_ARRIVALS_LIMIT = 8;

/** Same catalog products as /products, first page sorted by newest — no separate "new arrivals" entity. */
const newestListArg = { page: 1, limit: NEW_ARRIVALS_LIMIT, sort: 'newest' as const };

export function NewArrivalsSection() {
  const useApi = !env.enableMockApi;
  const mock = useGetNewArrivalsQuery(NEW_ARRIVALS_LIMIT, { skip: useApi });
  const api = useListPublicProductsQuery(newestListArg, { skip: !useApi });

  const products = useMemo(() => {
    if (useApi) return (api.data?.items ?? []).map(mapPublicProductToUi);
    return mock.data ?? [];
  }, [useApi, api.data?.items, mock.data]);

  const isLoading = useApi ? api.isLoading : mock.isLoading;

  return (
    <SectionWrapper
      tone="default"
      eyebrow="New arrivals"
      title="Fresh on the rack"
      description="Just-released styles and reissues — engineered for performance, dressed for the win."
    >
      <ProductGrid products={products} isLoading={isLoading} columns={4} skeletonCount={NEW_ARRIVALS_LIMIT} />

      <div className="mt-10 flex justify-center">
        <Link
          to={`${ROUTES.products}?sort=new`}
          className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
        >
          View all new arrivals
        </Link>
      </div>
    </SectionWrapper>
  );
}
