import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@app/store';
import { Container } from '@components/ui/Container';
import { PRIMARY_NAV } from '@constants/navigation';
import { ROUTES } from '@constants/routes';
import { selectIsAuthenticated } from '@features/auth/authSlice';
import { selectCartCount } from '@features/cart/cartSlice';
import {
  selectCartDrawerOpen,
  selectMobileMenuOpen,
  selectSearchOpen,
  setCartDrawerOpen,
  setMobileMenuOpen,
  setSearchOpen,
} from '@features/ui/uiSlice';
import { selectWishlistIds } from '@features/wishlist/wishlistSlice';
import { cn } from '@lib/cn';

import { Logo } from './Logo';
import { SearchOverlay } from './SearchOverlay';

const NAV_LINK_CLASS =
  'relative inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground';

export function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const cartCount = useAppSelector(selectCartCount);
  const wishlistCount = useAppSelector(selectWishlistIds).length;
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
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
          'sticky top-0 z-40 w-full border-b border-transparent bg-gradient-to-r from-white via-white to-[#0F1729]/20 transition-all duration-300',
          scrolled &&
            'border-border/60 bg-gradient-to-r from-white/35 via-white/25 to-[#0F1729]/20 shadow-soft backdrop-blur-xl supports-[backdrop-filter]:from-white/25 supports-[backdrop-filter]:via-white/20 supports-[backdrop-filter]:to-[#0F1729]/15',
        )}
      >
        <div className="hidden items-center justify-center gap-3 border-b border-border/60 bg-white/65 py-2 text-xs font-medium text-foreground backdrop-blur sm:flex">
          <span>Free shipping on orders over $150</span>
          <span aria-hidden="true">•</span>
          <span>Custom team uniforms in 14 days or less</span>
        </div>
        <Container as="nav" aria-label="Primary" className="flex h-16 items-center gap-4 lg:h-20">
          <button
            type="button"
            onClick={() => dispatch(setMobileMenuOpen(!isMobileMenuOpen))}
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted lg:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>

          <Logo />

          <ul className="ml-4 hidden items-center gap-6 lg:flex">
            {PRIMARY_NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === ROUTES.home}
                  className={({ isActive }) =>
                    cn(NAV_LINK_CLASS, isActive && 'text-foreground')
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      <span
                        className={cn(
                          'absolute -bottom-2 left-0 h-0.5 w-full origin-left scale-x-0 bg-primary transition-transform duration-200',
                          isActive && 'scale-x-100',
                        )}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => dispatch(setSearchOpen(!isSearchOpen))}
              aria-label="Open search"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </button>

            <Link
              to={ROUTES.wishlist}
              aria-label="Wishlist"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
            >
              <Heart className="h-5 w-5" aria-hidden="true" />
              {wishlistCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground"
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() =>
                isAuthenticated ? navigate(ROUTES.dashboard) : navigate(ROUTES.login)
              }
              aria-label={isAuthenticated ? 'Account' : 'Sign in'}
              className="hidden h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted sm:inline-flex"
            >
              <User className="h-5 w-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => dispatch(setCartDrawerOpen(!isCartDrawerOpen))}
              aria-label={`Open cart, ${cartCount} item${cartCount === 1 ? '' : 's'}`}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
            >
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              {cartCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground"
                >
                  {cartCount}
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
