import { baseApi } from '@services/baseApi';

/**
 * Reserved for analytics / dashboard KPI endpoints.
 * Use tag type `AdminAnalytics` when endpoints are added.
 */
export const analyticsApi = baseApi.injectEndpoints({
  endpoints: () => ({}),
  overrideExisting: true,
});
