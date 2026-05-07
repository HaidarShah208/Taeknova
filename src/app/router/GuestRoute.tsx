import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { useAppSelector } from '@app/store';
import { ROUTES } from '@constants/routes';
import { selectIsAuthenticated } from '@features/auth/authSlice';

interface GuestRouteProps {
  children: ReactNode;
}

export function GuestRoute({ children }: GuestRouteProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  if (isAuthenticated) return <Navigate to={ROUTES.dashboard} replace />;
  return <>{children}</>;
}
