import { Heart, ShoppingBag } from 'lucide-react';
import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { useAppDispatch, useAppSelector } from '@redux';
import { Badge } from '@components/ui/Badge';
import { ROUTES } from '@constants/routes';
import { addItem } from '@redux/cart';
import { selectIsInWishlist, toggleWishlist } from '@redux/wishlist';
import { cn } from '@lib/cn';
import type { Product } from '@app-types/product';

import { PriceTag } from './PriceTag';
import { RatingStars } from './RatingStars';

interface ProductCardProps {
  product: Product;
  className?: string;
  variant?: 'default' | 'compact';
}

function ProductCardBase({ product, className, variant = 'default' }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const isWishlisted = useAppSelector(selectIsInWishlist(product.id));

  const primaryImage = product.images[0]?.url ?? '';
  const hoverImage = product.images[1]?.url ?? primaryImage;
  const firstVariant = product.variants[0];

  const handleQuickAdd = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (!firstVariant) return;
      dispatch(
        addItem({
          product: {
            id: product.id,
            slug: product.slug,
            title: product.title,
            price: product.price,
            ...(product.comparePrice !== undefined ? { comparePrice: product.comparePrice } : {}),
            images: product.images,
            currency: product.currency,
          },
          variant: firstVariant,
          quantity: 1,
        }),
      );
      toast.success(`${product.title} added to cart`);
    },
    [dispatch, firstVariant, product],
  );

  const handleWishlist = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      dispatch(toggleWishlist(product.id));
      toast.success(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist');
    },
    [dispatch, product.id, isWishlisted],
  );

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated',
        className,
      )}
    >
      <Link
        to={ROUTES.productDetails(product.slug)}
        className="relative block aspect-[4/5] overflow-hidden bg-muted"
        aria-label={product.title}
      >
        <img
          src={primaryImage}
          alt={product.images[0]?.alt ?? product.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {hoverImage && hoverImage !== primaryImage && (
          <img
            src={hoverImage}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNew && <Badge variant="new">New</Badge>}
          {product.isBestseller && <Badge variant="accent">Bestseller</Badge>}
          {!product.inStock && <Badge variant="destructive">Sold out</Badge>}
        </div>

        <button
          type="button"
          onClick={handleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-pressed={isWishlisted}
          className={cn(
            'absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-soft backdrop-blur transition-colors',
            'hover:bg-background',
            isWishlisted && 'text-destructive',
          )}
        >
          <Heart
            className={cn('h-4 w-4', isWishlisted && 'fill-destructive')}
            aria-hidden="true"
          />
        </button>

        {variant === 'default' && product.inStock && firstVariant && (
          <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={handleQuickAdd}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background shadow-elevated transition-colors hover:bg-foreground/90"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              Quick add
            </button>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {product.brand}
          </span>
          <RatingStars value={product.rating} size="sm" reviewsCount={product.reviewsCount} />
        </div>
        <Link
          to={ROUTES.productDetails(product.slug)}
          className="line-clamp-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
        >
          {product.title}
        </Link>
        <PriceTag
          price={product.price}
          {...(product.comparePrice !== undefined ? { comparePrice: product.comparePrice } : {})}
          currency={product.currency}
          size="md"
          className="mt-auto"
        />
      </div>
    </article>
  );
}

export const ProductCard = memo(ProductCardBase);
