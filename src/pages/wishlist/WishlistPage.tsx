import { Heart } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { useAppSelector } from '@redux';
import { Breadcrumb } from '@components/shared/Breadcrumb';
import { ProductGrid } from '@components/shared/ProductGrid';
import { PageMeta } from '@components/layout/PageMeta';
import { buttonVariants } from '@components/ui/Button';
import { Container } from '@components/ui/Container';
import { EmptyState } from '@components/ui/EmptyState';
import { Loader } from '@components/ui/Loader';
import { ROUTES } from '@constants/routes';
import env from '@lib/env';
import { selectIsAuthenticated } from '@redux/auth';
import { useGetProductsQuery } from '@redux/products';
import { useGetWishlistQuery } from '@redux/customer';
import { selectWishlistIds } from '@redux/wishlist';
import { mapPublicProductToUi } from '@services/catalogMappers';
import type { Product } from '@app-types/product';
import { cn } from '@lib/cn';

export default function WishlistPage() {
  const apiMode = !env.enableMockApi;
  const isAuthed = useAppSelector(selectIsAuthenticated);
  const mockIds = useAppSelector(selectWishlistIds);
  const { data: serverWishlist, isLoading: wlLoading } = useGetWishlistQuery(undefined, {
    skip: !apiMode || !isAuthed,
  });
  const { data: mockCatalog, isLoading: catLoading } = useGetProductsQuery(
    { pageSize: 100 },
    { skip: apiMode },
  );

  const products = useMemo((): Product[] => {
    if (apiMode) {
      return (serverWishlist ?? [])
        .map((w) => (w.product ? mapPublicProductToUi(w.product) : null))
        .filter((p): p is Product => p !== null);
    }
    return (mockCatalog?.data ?? []).filter((product) => mockIds.includes(product.id));
  }, [apiMode, mockCatalog?.data, mockIds, serverWishlist]);

  const isLoading = apiMode ? wlLoading : catLoading;
  const count = apiMode ? (serverWishlist?.length ?? 0) : mockIds.length;

  return (
    <>
      <PageMeta title="Your wishlist" />
      <Container className="py-8 lg:py-12">
        <Breadcrumb items={[{ label: 'Wishlist' }]} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Wishlist</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {apiMode && !isAuthed
            ? 'Sign in to see saved items from your account.'
            : count === 0
              ? "You haven't saved anything yet."
              : `You have ${count} saved item${count === 1 ? '' : 's'}.`}
        </p>

        <div className="mt-8">
          {apiMode && !isAuthed ? (
            <EmptyState
              icon={Heart}
              title="Sign in to view your wishlist"
              description="Your hearted items sync when you use the live API."
              action={
                <Link to={ROUTES.login} className={cn(buttonVariants())}>
                  Sign in
                </Link>
              }
            />
          ) : isLoading ? (
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
