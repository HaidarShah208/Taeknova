import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { useAppSelector } from '@redux';
import { ROUTES } from '@constants/routes';
import { selectIsAuthenticated } from '@redux/auth';

interface GuestRouteProps {
  children: ReactNode;
}

export function GuestRoute({ children }: GuestRouteProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  if (isAuthenticated) return <Navigate to={ROUTES.dashboard} replace />;
  return <>{children}</>;
}
