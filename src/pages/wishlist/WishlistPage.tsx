import { Heart } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { useAppSelector } from '@app/store';
import { Breadcrumb } from '@components/shared/Breadcrumb';
import { ProductGrid } from '@components/shared/ProductGrid';
import { PageMeta } from '@components/layout/PageMeta';
import { buttonVariants } from '@components/ui/Button';
import { Container } from '@components/ui/Container';
import { EmptyState } from '@components/ui/EmptyState';
import { Loader } from '@components/ui/Loader';
import { ROUTES } from '@constants/routes';
import { useGetProductsQuery } from '@features/products/productsApi';
import { selectWishlistIds } from '@features/wishlist/wishlistSlice';
import { cn } from '@lib/cn';

export default function WishlistPage() {
  const ids = useAppSelector(selectWishlistIds);
  const { data, isLoading } = useGetProductsQuery({ pageSize: 100 });

  const products = useMemo(
    () => (data?.data ?? []).filter((product) => ids.includes(product.id)),
    [data, ids],
  );

  return (
    <>
      <PageMeta title="Your wishlist" />
      <Container className="py-8 lg:py-12">
        <Breadcrumb items={[{ label: 'Wishlist' }]} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Wishlist</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {ids.length === 0
            ? "You haven't saved anything yet."
            : `You have ${ids.length} saved item${ids.length === 1 ? '' : 's'}.`}
        </p>

        <div className="mt-8">
          {isLoading ? (
            <div className="flex h-72 items-center justify-center">
              <Loader size="lg" />
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="No items in your wishlist"
              description="Tap the heart on any product to save it for later."
              action={
                <Link to={ROUTES.products} className={cn(buttonVariants())}>
                  Browse products
                </Link>
              }
            />
          ) : (
            <ProductGrid products={products} columns={4} />
          )}
        </div>
      </Container>
    </>
  );
}
