import { ArrowRight, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@redux';
import { Breadcrumb } from '@components/shared/Breadcrumb';
import { QuantitySelector } from '@components/shared/QuantitySelector';
import { PageMeta } from '@components/layout/PageMeta';
import { Button, buttonVariants } from '@components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Container } from '@components/ui/Container';
import { EmptyState } from '@components/ui/EmptyState';
import { ROUTES } from '@constants/routes';
import {
  removeItem,
  selectCartItems,
  selectCartSubtotal,
  updateQuantity,
} from '@redux/cart';
import { cn } from '@lib/cn';
import { formatPrice } from '@lib/formatters';

const SHIPPING_THRESHOLD = 150;
const PKR_FORMAT = {
  currency: 'PKR',
  locale: 'en-PK',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
} as const;

export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);

  const shipping = subtotal > SHIPPING_THRESHOLD || items.length === 0 ? 0 : 12;
  const tax = Math.round(subtotal * 0.07 * 100) / 100;
  const total = subtotal + shipping + tax;

  return (
    <>
      <PageMeta title="Your cart" />
      <Container className="py-8 lg:py-12">
        <Breadcrumb items={[{ label: 'Cart' }]} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Your cart</h1>

        {items.length === 0 ? (
          <EmptyState
            className="mt-10"
            title="Your cart is empty"
            description="Browse our latest performance kits and add favorites to your bag."
            action={
              <Link to={ROUTES.products} className={cn(buttonVariants())}>
                Continue shopping
              </Link>
            }
          />
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            <Card padding="none">
              <CardHeader className="border-b border-border p-5">
                <CardTitle className="text-base">{items.length} items</CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-border p-0">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 p-5 sm:p-6">
                    <Link
                      to={ROUTES.productDetails(item.slug)}
                      className="block h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-32 sm:w-28"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link
                            to={ROUTES.productDetails(item.slug)}
                            className="line-clamp-2 text-sm font-semibold text-foreground hover:text-primary sm:text-base"
                          >
                            {item.title}
                          </Link>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {item.size} • {item.color}
                          </p>
                        </div>
                        <p className="text-base font-bold">
                          {formatPrice(item.price * item.quantity, PKR_FORMAT)}
                        </p>
                      </div>
                      <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                        <QuantitySelector
                          size="sm"
                          value={item.quantity}
                          max={item.maxStock}
                          onChange={(quantity) =>
                            dispatch(updateQuantity({ id: item.id, quantity }))
                          }
                        />
                        <button
                          type="button"
                          onClick={() => dispatch(removeItem(item.id))}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order summary</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd className="font-semibold">{formatPrice(subtotal, PKR_FORMAT)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Delivery Charges</dt>
                    <dd className="font-semibold">
                      Free
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
              
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-base">
                    <dt className="font-semibold">Total</dt>
                    <dd className="text-lg font-bold">{formatPrice(total, PKR_FORMAT)}</dd>
                  </div>
                </dl>
                <Button
                  fullWidth
                  size="lg"
                  className="mt-6"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                  onClick={() => navigate(ROUTES.checkout)}
                >
                  Checkout
                </Button>
                <Link
                  to={ROUTES.products}
                  className="mt-3 block text-center text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Continue shopping
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </Container>
    </>
  );
}
