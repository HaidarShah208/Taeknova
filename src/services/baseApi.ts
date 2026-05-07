import { createApi, fetchBaseQuery, type BaseQueryFn } from '@reduxjs/toolkit/query/react';
import type { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { STORAGE_KEYS } from '@constants/app';
import env from '@lib/env';
import { localStore } from '@utils/storage';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: env.apiBaseUrl,
  prepareHeaders: (headers) => {
    const token = localStore.get<string | null>(STORAGE_KEYS.authToken, null);
    if (token) headers.set('Authorization', `Bearer ${token}`);
    headers.set('Accept', 'application/json');
    return headers;
  },
});

const baseQueryWithErrorHandling: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error && env.isDev) {
    console.error('[RTK Query]', result.error.status, result.error.data);
  }
  return result;
};

export const TAG_TYPES = ['Product', 'Category', 'Cart', 'User', 'Order', 'Wishlist'] as const;
export type ApiTagType = (typeof TAG_TYPES)[number];

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: TAG_TYPES,
  endpoints: () => ({}),
  refetchOnReconnect: true,
  refetchOnFocus: false,
});
