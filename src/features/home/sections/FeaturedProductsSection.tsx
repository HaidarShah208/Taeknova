import { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { ProductSlider } from '@components/shared/ProductSlider';
import { SectionWrapper } from '@components/shared/SectionWrapper';
import { Loader } from '@components/ui/Loader';
import { ROUTES } from '@constants/routes';
import env from '@lib/env';
import { useListPublicFeaturedQuery } from '@redux/customer';
import { useGetFeaturedProductsQuery } from '@redux/products';
import { mapPublicProductToUi } from '@services/catalogMappers';

const FEATURED_LIMIT = 8;

export function FeaturedProductsSection() {
  const useApi = !env.enableMockApi;
  const mock = useGetFeaturedProductsQuery(FEATURED_LIMIT, { skip: useApi });
  const api = useListPublicFeaturedQuery(FEATURED_LIMIT, { skip: !useApi });

  const products = useMemo(() => {
    if (useApi) return (api.data ?? []).map(mapPublicProductToUi);
    return mock.data ?? [];
  }, [useApi, api.data, mock.data]);

  const isLoading = useApi ? api.isLoading : mock.isLoading;

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
        <ProductSlider products={products} />
      )}
    </SectionWrapper>
  );
}
