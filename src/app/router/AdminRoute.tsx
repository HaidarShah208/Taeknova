 
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@redux';
import { ROUTES } from '@constants/routes';
import { selectIsAdmin, selectIsAuthenticated } from '@redux/auth';
interface AdminRouteProps {
  children: ReactNode;
}
/**
 * UI guard: only users with `role === 'admin'` (from JWT/session) may access admin layout.
 * Backend still enforces `roleGuard(ADMIN)` on `/api/v1/*` admin APIs — this is not a substitute.
 */
export function AdminRoute({ children }: AdminRouteProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAdmin = useAppSelector(selectIsAdmin);
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} state={{ from: location.pathname }} replace />;
  }
  if (!isAdmin) {
    return <Navigate to={ROUTES.home} replace />;
  }
  return <>{children}</>;
}