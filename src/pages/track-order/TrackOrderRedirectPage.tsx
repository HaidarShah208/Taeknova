import { Navigate } from 'react-router-dom';

import { ROUTES } from '@constants/routes';

/** Sends authenticated users to their orders list, where each order's own detail page shows tracking progress. */
export default function TrackOrderRedirectPage() {
  return <Navigate to={ROUTES.dashboardOrders} replace />;
}
