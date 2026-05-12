import { baseApi } from '@services/baseApi';

/**
 * Reserved for admin order APIs (`/api/v1/orders` or similar) when the backend ships.
 * Import this module from the store so `injectEndpoints` registration stays consistent.
 */
export const adminOrdersApi = baseApi.injectEndpoints({
  endpoints: () => ({}),
  overrideExisting: true,
});
