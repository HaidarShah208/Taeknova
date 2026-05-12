import { NavLink, Outlet } from 'react-router-dom';

import { useAppSelector } from '@redux';
import { Container } from '@components/ui/Container';
import { Footer } from '@components/layout/Footer';
import { Navbar } from '@components/layout/Navbar';
import { ROUTES } from '@constants/routes';
import { selectCurrentUser } from '@redux/auth';
import { getInitials } from '@utils/misc';

import { cn } from '@lib/cn';

import { ScrollToTop } from './ScrollToTop';

const DASH_LINKS = [
  { to: ROUTES.dashboardProfile, label: 'Profile' },
  { to: ROUTES.dashboardOrders, label: 'Orders' },
  { to: ROUTES.dashboardAddresses, label: 'Addresses' },
];

const navClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'block rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
    isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
  );

export function ProfileLayout() {
  const user = useAppSelector(selectCurrentUser);

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
            <nav className="space-y-1 rounded-2xl border border-border bg-card p-2">
              {DASH_LINKS.map((link) => (
                <NavLink key={link.to} to={link.to} className={navClass} end={link.to === ROUTES.dashboardProfile}>
                  {link.label}
                </NavLink>
              ))}
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

export default ProfileLayout;
