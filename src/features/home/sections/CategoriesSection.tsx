import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { SectionWrapper } from '@components/shared/SectionWrapper';
import { Skeleton } from '@components/ui/Skeleton';
import { ROUTES } from '@constants/routes';
import { useGetCategoriesQuery } from '@features/categories/categoriesApi';
import { cn } from '@lib/cn';

export function CategoriesSection() {
  const { data, isLoading } = useGetCategoriesQuery();

  return (
    <SectionWrapper
      tone="default"
      eyebrow="Shop by sport"
      title="Find the kit built for your game"
      description="From soccer pitches to basketball courts, every Tikwando kit is engineered for the demands of your sport."
      action={
        <Link
          to={ROUTES.categories}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          View all
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      }
    >
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className="aspect-[3/4] w-full rounded-2xl" />
            ))
          : (data ?? []).map((category, idx) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
                className={cn(
                  idx === 0 &&
                    'col-span-2 row-span-2 lg:col-span-2 lg:row-span-1 xl:col-span-2 xl:row-span-1',
                )}
              >
                <Link
                  to={ROUTES.categoryDetails(category.slug)}
                  className="group relative block aspect-[3/4] h-full w-full overflow-hidden rounded-2xl bg-foreground text-background"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/95 via-foreground/30 to-transparent transition-opacity duration-300 group-hover:from-foreground" />
                  <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-background/80">
                        {category.productCount} styles
                      </p>
                      <h3 className="mt-1 text-lg font-bold leading-tight tracking-tight">
                        {category.name}
                      </h3>
                    </div>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
      </div>
    </SectionWrapper>
  );
}
