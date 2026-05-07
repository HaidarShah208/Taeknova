import { LogIn, Sparkles, UserPlus } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@app/store';
import { buttonVariants } from '@components/ui/Button';
import { Drawer } from '@components/ui/Drawer';
import { PRIMARY_NAV } from '@constants/navigation';
import { ROUTES } from '@constants/routes';
import { selectIsAuthenticated } from '@features/auth/authSlice';
import { selectMobileMenuOpen, setMobileMenuOpen } from '@features/ui/uiSlice';
import { cn } from '@lib/cn';

export function MobileMenu() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectMobileMenuOpen);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const close = () => dispatch(setMobileMenuOpen(false));

  return (
    <Drawer isOpen={isOpen} onClose={close} side="left" size="md" title="Menu">
      <div className="flex h-full flex-col">
        <ul className="flex flex-col gap-1">
          {PRIMARY_NAV.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === ROUTES.home}
                onClick={close}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between rounded-lg px-3 py-3 text-base font-semibold text-foreground transition-colors hover:bg-muted',
                    isActive && 'bg-primary/10 text-primary',
                  )
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-2xl border border-border bg-muted/30 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
            New season drops
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Performance fabrics, premium customization, ready in two weeks.
          </p>
          <Link
            to={`${ROUTES.products}?sort=new`}
            onClick={close}
            className={cn(buttonVariants({ size: 'sm', fullWidth: true }), 'mt-3')}
          >
            Shop new arrivals
          </Link>
        </div>

        <div className="mt-auto pt-6">
          {isAuthenticated ? (
            <Link
              to={ROUTES.dashboard}
              onClick={close}
              className={cn(buttonVariants({ fullWidth: true }))}
            >
              My account
            </Link>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                to={ROUTES.login}
                onClick={close}
                className={cn(buttonVariants({ fullWidth: true }))}
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
                Sign in
              </Link>
              <Link
                to={ROUTES.register}
                onClick={close}
                className={cn(buttonVariants({ variant: 'outline', fullWidth: true }))}
              >
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Create account
              </Link>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
}
