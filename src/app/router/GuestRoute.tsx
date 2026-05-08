import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { useAppSelector } from '@redux';
import { ROUTES } from '@constants/routes';
import { selectIsAdmin, selectIsAuthenticated } from '@redux/auth';

interface GuestRouteProps {
  children: ReactNode;
}

export function GuestRoute({ children }: GuestRouteProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAdmin = useAppSelector(selectIsAdmin);
  if (isAuthenticated) return <Navigate to={isAdmin ? ROUTES.adminDashboard : ROUTES.dashboard} replace />;
  return <>{children}</>;
}
