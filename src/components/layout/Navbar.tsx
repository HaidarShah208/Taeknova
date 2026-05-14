import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@redux';
import { Container } from '@components/ui/Container';
import { Button } from '@components/ui/Button';
import { PRIMARY_NAV } from '@constants/navigation';
import { ROUTES } from '@constants/routes';
import env from '@lib/env';
import { selectIsAdmin, selectIsAuthenticated } from '@redux/auth';
import { selectCartItems } from '@redux/cart';
import { useGetCartQuery, useGetWishlistQuery } from '@redux/customer';
import {
  selectCartDrawerOpen,
  selectMobileMenuOpen,
  selectSearchOpen,
  setCartDrawerOpen,
  setMobileMenuOpen,
  setSearchOpen,
} from '@redux/ui';
import { selectWishlistIds } from '@redux/wishlist';
import { cn } from '@lib/cn';

import { Logo } from './Logo';
import { SearchOverlay } from './SearchOverlay';

const NAV_LINK_CLASS =
  'relative inline-flex items-center text-sm font-medium text-white transition-colors hover:text-ring';

export function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const localCartItems = useAppSelector(selectCartItems);
  const wishlistIds = useAppSelector(selectWishlistIds);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { data: serverCart } = useGetCartQuery(undefined, {
    skip: env.enableMockApi || !isAuthenticated,
  });
  const { data: serverWishlist } = useGetWishlistQuery(undefined, {
    skip: env.enableMockApi || !isAuthenticated,
  });

  const cartBadge = env.enableMockApi
    ? new Set(localCartItems.map((item) => item.productId)).size
    : new Set(
        (serverCart ?? [])
          .map((line) => line.variant?.product?.id ?? line.variant?.productId ?? '')
          .filter(Boolean),
      ).size;
  const wishlistCount = env.enableMockApi ? wishlistIds.length : (serverWishlist?.length ?? 0);
  const isAdmin = useAppSelector(selectIsAdmin);
  const isSearchOpen = useAppSelector(selectSearchOpen);
  const isCartDrawerOpen = useAppSelector(selectCartDrawerOpen);
  const isMobileMenuOpen = useAppSelector(selectMobileMenuOpen);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 w-full  border-transparent bg-foreground/90 transition-all duration-300',
          scrolled &&
            'border-border/60 bg-gradient-to-r from-white/40 via-foreground/20 to-foreground/70 shadow-soft backdrop-blur-xl supports-[backdrop-filter]:from-white/30 supports-[backdrop-filter]:via-foreground/15 supports-[backdrop-filter]:to-foreground/60',
        )}
      >
        <Container as="nav" aria-label="Primary" className="flex h-16 items-center gap-4 lg:h-20">
          <button
            type="button"
            onClick={() => dispatch(setMobileMenuOpen(!isMobileMenuOpen))}
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white hover:text-foreground transition-colors hover:bg-muted  lg:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>

          <Logo />

          <ul className="ml-4 hidden items-center gap-6 lg:flex">
            {PRIMARY_NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    NAV_LINK_CLASS,
                    (item.to === ROUTES.home
                      ? location.pathname === ROUTES.home
                      : location.pathname.startsWith(item.to)) && 'text-white',
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      'absolute -bottom-2 left-0 h-0.5 bg-white w-full origin-left scale-x-0 transition-transform duration-200',
                      (item.to === ROUTES.home
                        ? location.pathname === ROUTES.home
                        : location.pathname.startsWith(item.to)) && 'scale-x-100',
                    )}
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => dispatch(setSearchOpen(!isSearchOpen))}
              aria-label="Open search"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-muted hover:text-foreground"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </button>

            <Link
              to={ROUTES.wishlist}
              aria-label="Wishlist"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-muted hover:text-foreground"
            >
              <Heart className="h-5 w-5" aria-hidden="true" />
              {wishlistCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-white "
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={() =>
                  navigate(isAdmin ? ROUTES.adminDashboard : ROUTES.dashboardProfile)
                }
                aria-label="Account"
                className="hidden h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-muted sm:inline-flex hover:text-foreground"
              >
                <User className="h-5 w-5" aria-hidden="true" />
              </button>
            ) : (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="hidden hover:text-foreground text-white sm:inline-flex"
                onClick={() => navigate(ROUTES.login)}
              >
                Login
              </Button>
            )}

            <button
              type="button"
              onClick={() => dispatch(setCartDrawerOpen(!isCartDrawerOpen))}
              aria-label={`Open cart, ${cartBadge} item${cartBadge === 1 ? '' : 's'}`}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-muted hover:text-foreground"
            >
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              {cartBadge > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground"
                >
                  {cartBadge}
                </span>
              )}
            </button>
          </div>
        </Container>
      </header>

      <SearchOverlay />
    </>
  );
}
