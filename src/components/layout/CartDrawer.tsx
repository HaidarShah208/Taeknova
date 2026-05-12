import { Trash2 } from 'lucide-react';
import { useLayoutEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { buttonVariants } from '@components/ui/Button';
import { Drawer } from '@components/ui/Drawer';
import { EmptyState } from '@components/ui/EmptyState';
import { QuantitySelector } from '@components/shared/QuantitySelector';
import { ROUTES } from '@constants/routes';
import { useUnifiedCart } from '@hooks/commerce/useUnifiedCart';
import { useAppDispatch, useAppSelector } from '@redux';
import { selectCartDrawerOpen, closeAllOverlays } from '@redux/ui';
import { cn } from '@lib/cn';
import { formatPrice } from '@lib/formatters';

const PKR: Parameters<typeof formatPrice>[1] = {
  currency: 'PKR',
  locale: 'en-PK',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
};

export function CartDrawer() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const prevPath = useRef<string | null>(null);
  const isOpen = useAppSelector(selectCartDrawerOpen);
  const { items, subtotal, adjustQuantity, removeLine, apiMode, isAuthenticated } = useUnifiedCart();

  const close = () => dispatch(closeAllOverlays());

  /** Any route change closes the drawer (handles SPA nav + auth redirects where layout may remount). */
  useLayoutEffect(() => {
    if (prevPath.current !== null && prevPath.current !== location.pathname) {
      dispatch(closeAllOverlays());
    }
    prevPath.current = location.pathname;
  }, [location.pathname, dispatch]);

  const handleCheckout = () => {
    close();
    window.setTimeout(() => {
      navigate(ROUTES.checkout);
    }, 0);
  };

  const handleViewCart = () => {
    close();
    window.setTimeout(() => {
      navigate(ROUTES.cart);
    }, 0);
  };

  const showAuthHint = apiMode && !isAuthenticated;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={close}
      side="right"
      size="xl"
      title={`Your cart (${items.length})`}
      footer={
        items.length > 0 &&
        !showAuthHint && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-base font-bold">{formatPrice(subtotal, PKR)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Shipping and taxes calculated at checkout.
            </p>
            <button
              type="button"
              onClick={handleCheckout}
              className={cn(buttonVariants({ fullWidth: true, size: 'lg' }))}
            >
              Checkout
            </button>
            <button
              type="button"
              onClick={handleViewCart}
              className={cn(buttonVariants({ variant: 'outline', fullWidth: true }))}
            >
              View cart
            </button>
          </div>
        )
      }
    >
      {showAuthHint ? (
        <EmptyState
          title="Sign in to view your cart"
          description="Sync your bag across devices with the live API."
          action={
            <Link to={ROUTES.login} onClick={close} className={cn(buttonVariants())}>
              Sign in
            </Link>
          }
        />
      ) : items.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Start exploring our latest performance kits and add favorites to your bag."
          action={
            <Link to={ROUTES.products} onClick={close} className={cn(buttonVariants())}>
              Browse products
            </Link>
          }
        />
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 py-4">
              <Link
                to={ROUTES.productDetails(item.slug)}
                onClick={close}
                className="block h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-muted"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      to={ROUTES.productDetails(item.slug)}
                      onClick={close}
                      className="line-clamp-2 text-sm font-semibold text-foreground hover:text-primary"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.size} • {item.color}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void removeLine(item)}
                    aria-label="Remove item"
                    className="text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <QuantitySelector
                    size="sm"
                    value={item.quantity}
                    max={item.maxStock}
                    onChange={(quantity) => void adjustQuantity(item, quantity)}
                  />
                  <span className="text-sm font-bold text-foreground">
                    {formatPrice(item.price * item.quantity, PKR)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}
