import { Link } from 'react-router-dom';

import { ProductGrid } from '@components/shared/ProductGrid';
import { SectionWrapper } from '@components/shared/SectionWrapper';
import { buttonVariants } from '@components/ui/Button';
import { ROUTES } from '@constants/routes';
import { useGetNewArrivalsQuery } from '@features/products/productsApi';
import { cn } from '@lib/cn';

export function NewArrivalsSection() {
  const { data, isLoading } = useGetNewArrivalsQuery(8);

  return (
    <SectionWrapper
      tone="default"
      eyebrow="New arrivals"
      title="Fresh on the rack"
      description="Just-released styles and reissues — engineered for performance, dressed for the win."
    >
      <ProductGrid products={data ?? []} isLoading={isLoading} columns={4} skeletonCount={8} />

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
