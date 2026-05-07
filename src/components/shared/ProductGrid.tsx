import { cn } from '@lib/cn';
import type { Product } from '@app-types/product';

import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  skeletonCount?: number;
  columns?: 2 | 3 | 4;
  className?: string;
}

const columnClasses: Record<NonNullable<ProductGridProps['columns']>, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

export function ProductGrid({
  products,
  isLoading = false,
  skeletonCount = 8,
  columns = 4,
  className,
}: ProductGridProps) {
  return (
    <div className={cn('grid grid-cols-1 gap-5', columnClasses[columns], className)}>
      {isLoading
        ? Array.from({ length: skeletonCount }).map((_, idx) => (
            <ProductCardSkeleton key={`skeleton-${idx}`} />
          ))
        : products.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}
