import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { SectionWrapper } from '@components/shared/SectionWrapper';
import { Skeleton } from '@components/ui/Skeleton';
import { ROUTES } from '@constants/routes';
import type { Category } from '@app-types/product';
import { useUnifiedCategories } from '@hooks/commerce/useUnifiedCategories';
import { cn } from '@lib/cn';

const EXPANDED_FLEX = 2.75;
const COLLAPSED_FLEX = 1.5;
const DEFAULT_ACTIVE = 0;

const stripEase = [0.25, 1, 0.5, 1] as const;

function CategoryCard({
  category,
  className,
}: {
  category: Category;
  className?: string;
}) {
  return (
    <Link
      to={ROUTES.categoryDetails(category.slug)}
      className={cn(
        'group relative block h-full w-full min-h-[14rem] overflow-hidden rounded-md bg-foreground text-background',
        className,
      )}
    >
      <img
        src={category.image}
        alt={category.name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/35 to-foreground/10"
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      />
      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
        <motion.div
          className="min-w-0"
          initial={false}
          transition={{ duration: 0.35, ease: stripEase }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-background/80">
            {category.productCount} styles
          </p>
          <h3 className="mt-1 text-lg font-bold leading-tight tracking-tight text-white">
            {category.name}
          </h3>
        </motion.div>
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-300 group-hover:translate-x-1">
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

export function CategoriesSection() {
  const { categories, isLoading } = useUnifiedCategories();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeIndex = hoveredIndex ?? DEFAULT_ACTIVE;

  const flexFor = (idx: number) => (activeIndex === idx ? EXPANDED_FLEX : COLLAPSED_FLEX);

  return (
    <SectionWrapper
      tone="default"
      className="relative overflow-hidden bg-gradient-to-br from-[#393528]/38 via-[#2b2d2d]/28 to-[#101A2F]/42"
      eyebrow="Shop by sport"
      title="Find the kit built for your game"
      description="From soccer pitches to basketball courts, every Tiknova kit is engineered for the demands of your sport."
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
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-8 h-48 w-48 rounded-full bg-white/10 blur-2xl animate-orb-float"
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 bottom-8 h-56 w-56 rounded-full bg-blue-300/20 blur-3xl animate-orb-float-reverse"
      />

      {/* Mobile / tablet: equal cards */}
      <motion.div
        className="grid grid-cols-2 gap-4 sm:gap-5 lg:hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
      >
        {isLoading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className="aspect-[3/4] w-full rounded-2xl" />
            ))
          : categories.map((category) => (
              <motion.div
                key={category.id}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                }}
              >
                <CategoryCard category={category} className="aspect-[3/4]" />
              </motion.div>
            ))}
      </motion.div>

      {/* Desktop: hover-to-expand strip */}
      <motion.div
        className="hidden h-[min(48rem,70vh)] min-h-[18rem] gap-4 sm:gap-5 lg:flex"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        onMouseLeave={() => setHoveredIndex(null)}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
      >
        {isLoading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className="min-w-0 flex-1 rounded-2xl" />
            ))
          : categories.map((category, idx) => (
              <motion.div
                key={category.id}
                layout
                onMouseEnter={() => setHoveredIndex(idx)}
                onFocus={() => setHoveredIndex(idx)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                    setHoveredIndex(null);
                  }
                }}
                tabIndex={0}
                animate={{ flexGrow: flexFor(idx) }}
                transition={{ duration: 0.55, ease: stripEase }}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                }}
                className="min-w-0 basis-0 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl"
              >
                <CategoryCard category={category} />
              </motion.div>
            ))}
      </motion.div>
    </SectionWrapper>
  );
}
