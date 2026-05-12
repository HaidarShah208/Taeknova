import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { CartDrawer } from '@components/layout/CartDrawer';
import { Footer } from '@components/layout/Footer';
import { MobileMenu } from '@components/layout/MobileMenu';
import { Navbar } from '@components/layout/Navbar';
import { useAppDispatch } from '@redux';
import { closeAllOverlays } from '@redux/ui';

import { ScrollToTop } from './ScrollToTop';

export function MainLayout() {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(closeAllOverlays());
  }, [location.pathname, dispatch]);

  useEffect(
    () => () => {
      dispatch(closeAllOverlays());
    },
    [dispatch],
  );

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <ScrollToTop />
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileMenu />
      <CartDrawer />
    </div>
  );
}

export default MainLayout;
