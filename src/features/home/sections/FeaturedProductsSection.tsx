import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { ProductSlider } from '@components/shared/ProductSlider';
import { SectionWrapper } from '@components/shared/SectionWrapper';
import { Loader } from '@components/ui/Loader';
import { ROUTES } from '@constants/routes';
import { useGetFeaturedProductsQuery } from '@features/products/productsApi';

export function FeaturedProductsSection() {
  const { data, isLoading } = useGetFeaturedProductsQuery(8);

  return (
    <SectionWrapper
      tone="muted"
      eyebrow="Bestsellers"
      title="Crowd favorites this season"
      description="The pieces our most demanding teams reorder season after season."
      action={
        <Link
          to={`${ROUTES.products}?sort=popular`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          Shop all
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      }
    >
      {isLoading ? (
        <div className="flex h-72 items-center justify-center">
          <Loader size="lg" />
        </div>
      ) : (
        <ProductSlider products={data ?? []} />
      )}
    </SectionWrapper>
  );
}
