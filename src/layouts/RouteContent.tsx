import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { RouteContentFallback } from '@app/router/RouteContentFallback';

export function RouteContent() {
  return (
    <Suspense fallback={<RouteContentFallback />}>
      <Outlet />
    </Suspense>
  );
}
