import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@lib/cn';
import type { Product } from '@app-types/product';

import { ProductCard } from './ProductCard';

interface ProductSliderProps {
  products: Product[];
  className?: string;
}

export function ProductSlider({ products, className }: ProductSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState, products.length]);

  const scrollBy = useCallback((direction: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.85 * (direction === 'left' ? -1 : 1);
    el.scrollBy({ left: amount, behavior: 'smooth' });
  }, []);

  return (
    <div className={cn('relative', className)}>
      <div
        ref={trackRef}
        className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[30%] xl:w-[23%]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-12 items-center justify-start sm:flex">
        <button
          type="button"
          onClick={() => scrollBy('left')}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
          className={cn(
            'pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-soft backdrop-blur transition-all',
            'hover:bg-background',
            !canScrollLeft && 'pointer-events-none opacity-0',
          )}
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-12 items-center justify-end sm:flex">
        <button
          type="button"
          onClick={() => scrollBy('right')}
          disabled={!canScrollRight}
          aria-label="Scroll right"
          className={cn(
            'pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-soft backdrop-blur transition-all',
            'hover:bg-background',
            !canScrollRight && 'pointer-events-none opacity-0',
          )}
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
