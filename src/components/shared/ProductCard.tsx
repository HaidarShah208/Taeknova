import { Eye, Heart, Share2, ShoppingBag } from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { Badge } from '@components/ui/Badge';
import { Modal } from '@components/ui/Modal';
import { ROUTES } from '@constants/routes';
import { useCommerceProductActions } from '@hooks/commerce/useCommerceProductActions';
import { cn } from '@lib/cn';
import type { Product } from '@app-types/product';

import { PriceTag } from './PriceTag';
import { ProductShareModal } from './ProductShareModal';
import { RatingStars } from './RatingStars';

interface ProductCardProps {
  product: Product;
  className?: string;
  variant?: 'default' | 'compact';
}

function ProductCardBase({ product, className, variant = 'default' }: ProductCardProps) {
  const { isWishlisted, toggleWishlistForProduct, addToCart } = useCommerceProductActions(product);
  const [shareOpen, setShareOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const primaryImage = product.images[0]?.url ?? '';
  const hoverImage = product.images[1]?.url ?? primaryImage;
  const firstVariant = product.variants[0];

  const sizesLine = useMemo(() => {
    const sizes = [...new Set(product.variants.map((v) => v.size))].filter(Boolean).sort();
    if (!sizes.length) return null;
    return sizes.join(' · ');
  }, [product.variants]);

  const handleQuickAdd = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (!firstVariant) return;
      void addToCart({ product, variant: firstVariant, quantity: 1 });
    },
    [addToCart, firstVariant, product],
  );

  const handleWishlist = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      void toggleWishlistForProduct();
    },
    [toggleWishlistForProduct],
  );

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-400 bg-card text-card-foreground transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated',
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

        <div className="absolute right-3 top-3 z-10 flex flex-col items-center gap-1.5">
          <button
            type="button"
            onClick={handleWishlist}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            aria-pressed={isWishlisted}
            className={cn(
              'inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-soft backdrop-blur transition-colors',
              'hover:bg-background',
              isWishlisted && 'text-destructive',
            )}
          >
            <Heart
              className={cn('h-4 w-4', isWishlisted && 'fill-destructive')}
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShareOpen(true);
            }}
            aria-label="Share product"
            className={cn(
              'inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-soft backdrop-blur',
              'transition-all duration-300 ease-out hover:bg-background',
              'pointer-events-none -translate-x-3 opacity-0 group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100',
            )}
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setPreviewOpen(true);
            }}
            aria-label="View product image"
            className={cn(
              'inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-soft backdrop-blur',
              'transition-all duration-300 ease-out hover:bg-background',
              'pointer-events-none -translate-x-3 opacity-0 group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100',
            )}
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

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
        {sizesLine && (
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground/80">Sizes:</span> {sizesLine}
          </p>
        )}
        <PriceTag
          price={product.price}
          {...(product.comparePrice !== undefined ? { comparePrice: product.comparePrice } : {})}
          currency="PKR"
          size="md"
          className="mt-auto"
        />
      </div>

      <Modal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        size="lg"
        className="max-w-2xl"
      >
        <div className="-mx-6 -mt-2 -mb-5">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={product.images[0]?.alt ?? product.title}
              className="max-h-[min(75vh,640px)] w-full bg-muted object-contain"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center bg-muted text-sm text-muted-foreground">
              No image
            </div>
          )}
        </div>
      </Modal>

      <ProductShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        product={product}
        imageUrl={primaryImage}
      />
    </article>
  );
}

export const ProductCard = memo(ProductCardBase);
