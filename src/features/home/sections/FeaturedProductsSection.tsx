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
      className="relative overflow-hidden bg-gradient-to-br from-[#393528]/38 via-[#2b2d2d]/28 to-[#101A2F]/42"
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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-14 top-10 h-40 w-40 rounded-full bg-[#393528]/20 blur-2xl animate-orb-float"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-8 top-16 h-44 w-44 rounded-full bg-[#101A2F]/20 blur-3xl animate-orb-float-reverse"
      />
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
