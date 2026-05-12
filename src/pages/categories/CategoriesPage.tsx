import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Breadcrumb } from '@components/shared/Breadcrumb';
import { PageMeta } from '@components/layout/PageMeta';
import { Container } from '@components/ui/Container';
import { ErrorState } from '@components/ui/ErrorState';
import { SectionHeading } from '@components/ui/SectionHeading';
import { Skeleton } from '@components/ui/Skeleton';
import { ROUTES } from '@constants/routes';
import { useUnifiedCategories } from '@hooks/commerce/useUnifiedCategories';

export default function CategoriesPage() {
  const { categories, isLoading, isError, refetch } = useUnifiedCategories();

  return (
    <>
      <PageMeta
        title="Shop by category"
        description="Browse Tiknova uniforms by sport — from soccer kits to basketball jerseys."
      />
      <Container className="py-8 lg:py-12">
        <Breadcrumb items={[{ label: 'Categories' }]} />
        <div className="mt-6">
          <SectionHeading
            eyebrow="Collections"
            title="Shop every sport"
            description="Discover performance uniforms purpose-built for every team and game day."
          />
        </div>

        {isError ? (
          <ErrorState
            className="mt-10"
            onRetry={() => {
              void refetch();
            }}
          />
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <Skeleton key={idx} className="aspect-[4/3] w-full rounded-2xl" />
                ))
              : categories.map((category) => (
                  <Link
                    key={category.id}
                    to={ROUTES.categoryDetails(category.slug)}
                    className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-foreground text-background"
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/95 via-foreground/40 to-transparent" />
                    <div className="absolute inset-x-5 bottom-5">
                      <p className="text-xs font-semibold uppercase tracking-widest text-background/70">
                        {category.productCount} styles
                      </p>
                      <h3 className="mt-1 text-2xl font-bold tracking-tight">{category.name}</h3>
                      <p className="mt-1 max-w-xs text-sm text-background/80">
                        {category.description}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">
                        Shop {category.name}
                        <ArrowRight
                          className="h-4 w-4 transition-transform group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </Link>
                ))}
          </div>
        )}
      </Container>
    </>
  );
}
