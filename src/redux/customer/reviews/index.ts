import { baseApi } from '@services/baseApi';
import { assertBackendSuccess, unwrapBackendData } from '@services/apiEnvelope';
import type { ReviewDto } from '@app-types/storeApi';

export interface CreateReviewArg {
  productId: string;
  productSlug?: string;
  rating: number;
  title?: string;
  /** Maps to API field `body`. */
  comment?: string;
}

export interface UpdateReviewArg {
  reviewId: string;
  productId: string;
  productSlug?: string;
  rating?: number;
  title?: string;
  comment?: string;
}

export interface RemoveReviewArg {
  reviewId: string;
  productId: string;
  productSlug?: string;
}

function reviewInvalidationTags(arg: { productId: string; productSlug?: string }) {
  const tags: Array<{ type: 'ServerReview' | 'PublicProduct'; id: string }> = [
    { type: 'PublicProduct', id: arg.productId },
    { type: 'ServerReview', id: 'LIST' },
  ];
  if (arg.productSlug) tags.push({ type: 'ServerReview', id: `PRODUCT:${arg.productSlug}` });
  return tags;
}

export const customerReviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation<ReviewDto, CreateReviewArg>({
      query: ({ productSlug: _ps, comment, ...fields }) => ({
        url: '/reviews',
        method: 'POST',
        body: {
          ...fields,
          ...(comment !== undefined && comment !== '' ? { body: comment } : {}),
        },
      }),
      transformResponse: (raw: unknown) => unwrapBackendData<ReviewDto>(raw),
      invalidatesTags: (_r, _e, arg) => reviewInvalidationTags(arg),
    }),
    updateReview: builder.mutation<ReviewDto, UpdateReviewArg>({
      query: ({ reviewId, productSlug: _ps, productId: _pid, comment, ...patch }) => ({
        url: `/reviews/${reviewId}`,
        method: 'PATCH',
        body: {
          ...patch,
          ...(comment !== undefined ? { body: comment } : {}),
        },
      }),
      transformResponse: (raw: unknown) => unwrapBackendData<ReviewDto>(raw),
      invalidatesTags: (_r, _e, arg) => reviewInvalidationTags(arg),
    }),
    removeReview: builder.mutation<void, RemoveReviewArg>({
      query: ({ reviewId }) => ({ url: `/reviews/${reviewId}`, method: 'DELETE' }),
      transformResponse: (raw: unknown) => {
        assertBackendSuccess(raw);
        return undefined;
      },
      invalidatesTags: (_r, _e, arg) => reviewInvalidationTags(arg),
    }),
  }),
  overrideExisting: true,
});

export const { useCreateReviewMutation, useUpdateReviewMutation, useRemoveReviewMutation } =
  customerReviewsApi;
