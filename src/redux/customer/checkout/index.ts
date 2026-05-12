import { baseApi } from '@services/baseApi';
import { unwrapBackendData } from '@services/apiEnvelope';
import type { CheckoutSummaryDto } from '@app-types/storeApi';

export const checkoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCheckoutSummary: builder.mutation<
      CheckoutSummaryDto,
      { fromCart?: boolean; lines?: { variantId: string; quantity: number }[] }
    >({
      query: (body) => ({ url: '/checkout/summary', method: 'POST', body }),
      transformResponse: (raw: unknown) => unwrapBackendData<CheckoutSummaryDto>(raw),
    }),
  }),
  overrideExisting: true,
});

export const { useGetCheckoutSummaryMutation } = checkoutApi;
