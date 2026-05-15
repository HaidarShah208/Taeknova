import { Navigate } from 'react-router-dom';

import { ROUTES } from '@constants/routes';

/** Sends authenticated users to profile with the track-orders tab open. */
export default function TrackOrderRedirectPage() {
  return <Navigate to={ROUTES.profileTab('track')} replace />;
}
