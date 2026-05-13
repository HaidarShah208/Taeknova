import { baseApi } from '@services/baseApi';
import { unwrapBackendData } from '@services/apiEnvelope';

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminOverviewAnalytics: builder.query<
      { allOrders: number; ordersLast30d: number; revenue30d: number; currency: string; windowDays: number },
      void
    >({
      query: () => ({ url: '/analytics/admin/overview' }),
      transformResponse: (raw: unknown) =>
        unwrapBackendData<{
          allOrders: number;
          ordersLast30d: number;
          revenue30d: number;
          currency: string;
          windowDays: number;
        }>(raw),
      providesTags: [{ type: 'AdminAnalytics', id: 'OVERVIEW' }],
    }),
  }),
  overrideExisting: true,
});

export const { useAdminOverviewAnalyticsQuery } = analyticsApi;
