import { baseApi } from '@services/baseApi';
import { assertBackendSuccess, unwrapBackendData } from '@services/apiEnvelope';
import type { AddressDto } from '@app-types/storeApi';

export type AddressCreateBody = Omit<AddressDto, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
export type AddressUpdateBody = Partial<
  Omit<AddressDto, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
>;

export const addressesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listAddresses: builder.query<AddressDto[], void>({
      query: () => ({ url: '/addresses' }),
      transformResponse: (raw: unknown) => unwrapBackendData<AddressDto[]>(raw),
      providesTags: (result) =>
        result
          ? [
              ...result.map((a) => ({ type: 'UserAddress' as const, id: a.id })),
              { type: 'UserAddress' as const, id: 'LIST' },
            ]
          : [{ type: 'UserAddress' as const, id: 'LIST' }],
    }),
    createAddress: builder.mutation<AddressDto, AddressCreateBody>({
      query: (body) => ({ url: '/addresses', method: 'POST', body }),
      transformResponse: (raw: unknown) => unwrapBackendData<AddressDto>(raw),
      invalidatesTags: [{ type: 'UserAddress', id: 'LIST' }],
    }),
    updateAddress: builder.mutation<AddressDto, { addressId: string; patch: AddressUpdateBody }>({
      query: ({ addressId, patch }) => ({
        url: `/addresses/${addressId}`,
        method: 'PATCH',
        body: patch,
      }),
      transformResponse: (raw: unknown) => unwrapBackendData<AddressDto>(raw),
      invalidatesTags: (_r, _e, arg) => [
        { type: 'UserAddress', id: 'LIST' },
        { type: 'UserAddress', id: arg.addressId },
      ],
    }),
    deleteAddress: builder.mutation<void, string>({
      query: (addressId) => ({ url: `/addresses/${addressId}`, method: 'DELETE' }),
      transformResponse: (raw: unknown) => {
        assertBackendSuccess(raw);
        return undefined;
      },
      invalidatesTags: (_r, _e, id) => [
        { type: 'UserAddress', id: 'LIST' },
        { type: 'UserAddress', id },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressesApi;
