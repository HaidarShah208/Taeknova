import { useEffect, useRef } from 'react';

import { useAppDispatch, useAppSelector } from '@redux';
import { useAdminRefreshMutation } from '@redux/admin/auth';
import { mapProfileDtoToUser } from '@redux/admin/mapBackendUser';
import { clearSession, setUser, selectCurrentUser } from '@redux/auth';
import { useLazyGetProfileQuery } from '@redux/customer/profile';
import env from '@lib/env';

export function AuthBootstrap() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);
  const user = useAppSelector(selectCurrentUser);
  const bootstrappedForToken = useRef<string | null>(null);
  const [refresh] = useAdminRefreshMutation();
  const [fetchProfile] = useLazyGetProfileQuery();

  useEffect(() => {
    if (env.enableMockApi) return;
    if (!token || user) return;
    if (bootstrappedForToken.current === token) return;
    bootstrappedForToken.current = token;

    void (async () => {
      try {
        await refresh().unwrap();
      } catch {
        /* refresh may fail without valid session cookie */
      }
      try {
        const profile = await fetchProfile().unwrap();
        dispatch(setUser(mapProfileDtoToUser(profile)));
      } catch {
        dispatch(clearSession());
        bootstrappedForToken.current = null;
      }
    })();
  }, [dispatch, fetchProfile, refresh, token, user]);

  useEffect(() => {
    if (!token) bootstrappedForToken.current = null;
  }, [token]);

  return null;
}
