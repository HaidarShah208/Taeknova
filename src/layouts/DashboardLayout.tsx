import { LogOut } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@redux';
import { Container } from '@components/ui/Container';
import { Footer } from '@components/layout/Footer';
import { Navbar } from '@components/layout/Navbar';
import { DASHBOARD_NAV } from '@constants/navigation';
import { ROUTES } from '@constants/routes';
import { clearSession, selectCurrentUser } from '@redux/auth';
import { cn } from '@lib/cn';
import { getInitials } from '@utils/misc';

import { ScrollToTop } from './ScrollToTop';

export function DashboardLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(clearSession());
    navigate(ROUTES.home);
  };

  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Welcome';
  const initials = user ? getInitials(`${user.firstName} ${user.lastName}`) : 'TK';

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <ScrollToTop />
      <Navbar />
      <Container as="main" className="flex-1 py-8 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email ?? ''}</p>
              </div>
            </div>
            <nav aria-label="Dashboard">
              <ul className="space-y-1 rounded-2xl border border-border bg-card p-2">
                {DASHBOARD_NAV.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      end
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-muted',
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Sign out
                  </button>
                </li>
              </ul>
            </nav>
          </aside>
          <section className="rounded-2xl border border-border bg-card p-6 lg:p-8">
            <Outlet />
          </section>
        </div>
      </Container>
      <Footer />
    </div>
  );
}

export default DashboardLayout;
