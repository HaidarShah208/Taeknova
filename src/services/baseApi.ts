import { createApi, fetchBaseQuery, type BaseQueryFn } from '@reduxjs/toolkit/query/react';
import type { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

import type { User } from '@app-types/auth';
import { STORAGE_KEYS } from '@constants/app';
import env from '@lib/env';
import { getJwtExpiryMs } from '@lib/jwtClient';
import { clearSession, setAccessToken, setSession } from '@redux/auth';
import { unwrapBackendData } from '@services/apiEnvelope';
import { localStore } from '@utils/storage';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: env.apiBaseUrl,
  credentials: 'include',
  prepareHeaders: (headers, { arg }) => {
    const token = localStore.get<string | null>(STORAGE_KEYS.authToken, null);
    if (token) headers.set('Authorization', `Bearer ${token}`);
    headers.set('Accept', 'application/json');
    if (typeof arg === 'object' && arg !== null && 'body' in arg && arg.body instanceof FormData) {
      headers.delete('Content-Type');
    }
    return headers;
  },
});

let refreshPromise: Promise<boolean> | null = null;

function isAuthRefreshRequest(args: string | FetchArgs): boolean {
  const url = typeof args === 'string' ? args : args.url;
  return url.includes('/auth/refresh');
}

function isAuthLoginRequest(args: string | FetchArgs): boolean {
  const url = typeof args === 'string' ? args : args.url;
  return url.includes('/auth/login') || url.includes('/auth/register');
}

async function trySilentRefresh(api: Parameters<BaseQueryFn>[1]): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const result = await rawBaseQuery(
          { url: '/auth/refresh', method: 'POST', body: {} },
          api,
          {},
        );
        if (result.error) return false;
        const data = unwrapBackendData<{ accessToken: string }>(result.data);
        const exp = getJwtExpiryMs(data.accessToken);
        const user = (api.getState() as { auth: { user: User | null } }).auth.user;
        if (user) {
          api.dispatch(
            setSession({
              user,
              token: data.accessToken,
              expiresAt: exp,
            }),
          );
        } else {
          api.dispatch(
            setAccessToken({
              token: data.accessToken,
              expiresAt: exp,
            }),
          );
        }
        return true;
      } catch {
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401 && !env.enableMockApi) {
    if (isAuthRefreshRequest(args) || isAuthLoginRequest(args)) {
      if (result.error && env.isDev) {
        console.error('[RTK Query]', result.error.status, result.error.data);
      }
      return result;
    }
    const refreshed = await trySilentRefresh(api);
    if (refreshed) {
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearSession());
    }
  }

  if (result.error && env.isDev) {
    console.error('[RTK Query]', result.error.status, result.error.data);
  }
  return result;
};

export const TAG_TYPES = [
  'Product',
  'Category',
  'Cart',
  'User',
  'Order',
  'Wishlist',
  'AdminProduct',
  'AdminCategory',
  'AdminInventory',
  'AdminUser',
  'AdminAnalytics',
  'AdminOrder',
  'PublicProduct',
  'PublicCategory',
  'ServerCart',
  'ServerWishlist',
  'CheckoutSummary',
  'ServerOrder',
  'ServerReview',
  'UserProfile',
  'UserAddress',
] as const;
export type ApiTagType = (typeof TAG_TYPES)[number];

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: TAG_TYPES,
  endpoints: () => ({}),
  refetchOnReconnect: true,
  refetchOnFocus: false,
});
