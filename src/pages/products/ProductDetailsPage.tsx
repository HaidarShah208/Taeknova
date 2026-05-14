import { Heart, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { Breadcrumb } from '@components/shared/Breadcrumb';
import { PriceTag } from '@components/shared/PriceTag';
import { ProductGrid } from '@components/shared/ProductGrid';
import { RatingStars } from '@components/shared/RatingStars';
import { PageMeta } from '@components/layout/PageMeta';
import { Accordion, AccordionItem } from '@components/ui/Accordion';
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { Container } from '@components/ui/Container';
import { ErrorState } from '@components/ui/ErrorState';
import { Loader } from '@components/ui/Loader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/Tabs';
import { ROUTES } from '@constants/routes';
import { useCommerceProductActions } from '@hooks/commerce/useCommerceProductActions';
import {
  useUnifiedProductBySlug,
  useUnifiedRelatedProducts,
} from '@hooks/commerce/useUnifiedProductBySlug';
import { cn } from '@lib/cn';
import { useAppSelector } from '@redux';
import { selectCartItems } from '@redux/cart';
import { selectIsAuthenticated } from '@redux/auth';
import { useGetCartQuery } from '@redux/customer';
import { uniqueBy } from '@utils/misc';

const VALUE_PROPS = [
  { icon: Truck, label: 'Free shipping on $150+' },
  { icon: ShieldCheck, label: 'Lifetime stitch warranty' },
];

export default function ProductDetailsPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const { product, isLoading, isError, refetch } = useUnifiedProductBySlug(slug);
  const related = useUnifiedRelatedProducts(slug, 4);
  const { apiMode, isWishlisted, toggleWishlistForProduct, addToCart } = useCommerceProductActions(
    product ?? null,
  );
  const isAuthed = useAppSelector(selectIsAuthenticated);
  const mockCartItems = useAppSelector(selectCartItems);
  const { data: serverCart = [] } = useGetCartQuery(undefined, {
    skip: !apiMode || !isAuthed,
  });

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const colors = useMemo(
    () => uniqueBy(product?.variants ?? [], (v) => v.color).map((v) => v.color),
    [product],
  );
  const sizes = useMemo(
    () => uniqueBy(product?.variants ?? [], (v) => v.size).map((v) => v.size),
    [product],
  );

  const activeColor = selectedColor ?? colors[0] ?? null;
  const activeSize = selectedSize ?? sizes[0] ?? null;

  const selectedVariant = useMemo(() => {
    if (!product || !activeColor || !activeSize) return null;
    return (
      product.variants.find((v) => v.color === activeColor && v.size === activeSize) ?? null
    );
  }, [product, activeColor, activeSize]);

  const qtyInCartForVariant = useMemo(() => {
    if (!selectedVariant) return 0;
    if (apiMode) {
      const line = serverCart.find((l) => l.variantId === selectedVariant.id);
      return line?.quantity ?? 0;
    }
    const line = mockCartItems.find((i) => i.variantId === selectedVariant.id);
    return line?.quantity ?? 0;
  }, [apiMode, mockCartItems, selectedVariant, serverCart]);

  const remainingStock = useMemo(() => {
    if (!selectedVariant) return 0;
    return Math.max(0, selectedVariant.stock - qtyInCartForVariant);
  }, [selectedVariant, qtyInCartForVariant]);

  const canAddToCart = Boolean(selectedVariant && remainingStock > 0);

  useEffect(() => {
    if (!selectedVariant) return;
    if (remainingStock <= 0) {
      setQuantity(1);
      return;
    }
    setQuantity((q) => Math.min(Math.max(1, q), remainingStock));
  }, [remainingStock, selectedVariant?.id]);

  if (isLoading) {
    return (
      <Container className="flex min-h-[60vh] items-center justify-center py-16">
        <Loader size="lg" />
      </Container>
    );
  }

  if (isError || !product) {
    return (
      <Container className="py-12">
        <ErrorState
          title="Product not found"
          description="The item you’re looking for may have been removed or is unavailable."
          onRetry={() => {
            void refetch();
          }}
        />
      </Container>
    );
  }

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error('Please choose a size and color');
      return;
    }
    if (!canAddToCart) {
      toast.error('This variant is already at max quantity in your cart');
      return;
    }
    const ok = await addToCart({ product, variant: selectedVariant, quantity });
    if (ok) setQuantity(1);
  };

  return (
    <>
      <PageMeta
        title={product.title}
        description={product.description}
        ogImage={product.images[0]?.url}
        canonicalPath={ROUTES.productDetails(product.slug)}
      />
      <Container className="py-8 lg:py-12">
        <Breadcrumb
          items={[
            { label: 'Shop', to: ROUTES.products },
            { label: product.title },
          ]}
        />

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-3">
            <div className="aspect-square overflow-hidden rounded-3xl bg-muted">
              <img
                src={product.images[activeImage]?.url}
                alt={product.images[activeImage]?.alt ?? product.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2.5">
              {product.images.map((image, idx) => (
                <button
                  key={image.url}
                  type="button"
                  onClick={() => setActiveImage(idx)}
                  aria-label={`View image ${idx + 1}`}
                  className={cn(
                    'aspect-square overflow-hidden rounded-xl border bg-muted transition-all',
                    activeImage === idx ? 'border-primary ring-2 ring-primary/30' : 'border-border',
                  )}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              {product.isNew && <Badge variant="new">New</Badge>}
              {product.isBestseller && <Badge variant="accent">Bestseller</Badge>}
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {product.brand}
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {product.title}
            </h1>
            {product.subtitle && (
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">{product.subtitle}</p>
            )}
            <div className="mt-3 flex items-center gap-3">
              <RatingStars
                value={product.rating}
                showValue
                reviewsCount={product.reviewsCount}
              />
            </div>
            <div className="mt-5">
              <PriceTag
                price={product.price}
                {...(product.comparePrice !== undefined ? { comparePrice: product.comparePrice } : {})}
                currency={product.currency}
                size="lg"
              />
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Color: 
                </p>
                <div className="mt-3 ms-4 flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      aria-pressed={activeColor === color}
                      className={cn(
                        'inline-flex h-7 items-center rounded-full border px-4 text-sm font-medium transition-colors',
                        activeColor === color
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background text-foreground hover:border-foreground/40',
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">
                    Size:  
                  </p>
                  <button
                    type="button"
                    className="text-xs font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    Size guide
                  </button>
                </div>
                <div className="mt-3 ms-4 flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      aria-pressed={activeSize === size}
                      className={cn(
                        'inline-flex h-7 min-w-[3rem] items-center justify-center rounded-md border px-3 text-sm font-semibold transition-colors',
                        activeSize === size
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background text-foreground hover:border-foreground/40',
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-3">
                 
                  <Button
                    size="lg"
                    onClick={() => void handleAddToCart()}
                    disabled={!canAddToCart}
                    leftIcon={<ShoppingBag className="h-4 w-4" />}
                    className="flex-1"
                  >
                    Add to cart
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    type="button"
                    onClick={toggleWishlistForProduct}
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                    aria-pressed={isWishlisted}
                    leftIcon={
                      <Heart
                        className={cn(
                          'h-5 w-5',
                          isWishlisted && 'fill-destructive text-destructive',
                        )}
                      />
                    }
                  />
                </div>
                {qtyInCartForVariant > 0 ? (
                  <p className="text-xs text-muted-foreground">
                    {remainingStock > 0
                      ? `In your cart: ${qtyInCartForVariant} for this variant · you can add up to ${remainingStock} more.`
                      : `In your cart: ${qtyInCartForVariant} for this variant (max stock in cart).`}
                  </p>
                ) : null}
              </div>

              <ul className="flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-5 text-sm text-muted-foreground">
                {VALUE_PROPS.map((prop) => (
                  <li key={prop.label} className="inline-flex items-center gap-2">
                    <prop.icon className="h-4 w-4 text-primary" aria-hidden="true" />
                    {prop.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10">
              <Tabs defaultValue="description">
                <TabsList>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                   
                </TabsList>
                <TabsContent value="description" className="text-sm leading-relaxed text-muted-foreground">
                  {product.description}
                </TabsContent>
                <TabsContent value="details">
                  <Accordion type="multiple" defaultOpen={['materials']}>
                    <AccordionItem value="materials" trigger="Materials & care">
                      Performance polyester blend with four-way stretch. Machine wash cold, line dry.
                    </AccordionItem>
                    <AccordionItem value="shipping" trigger="Shipping & returns">
                      Free shipping on orders over $150. 30-day hassle-free returns on stock items.
                    </AccordionItem>
                    <AccordionItem value="customization" trigger="Customization options">
                      Available with embroidered crests, sublimated graphics, and custom name &
                      number printing.
                    </AccordionItem>
                  </Accordion>
                </TabsContent>
            
              </Tabs>
            </div>
          </div>
        </div>

        {related && related.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">You may also like</h2>
            <div className="mt-6">
              <ProductGrid products={related} columns={4} />
            </div>
          </section>
        )}
      </Container>
    </>
  );
}
