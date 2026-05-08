import { Outlet } from 'react-router-dom';

import { useAppSelector } from '@redux';
import { Container } from '@components/ui/Container';
import { Footer } from '@components/layout/Footer';
import { Navbar } from '@components/layout/Navbar';
import {  selectCurrentUser } from '@redux/auth';
import { getInitials } from '@utils/misc';

import { ScrollToTop } from './ScrollToTop';

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
