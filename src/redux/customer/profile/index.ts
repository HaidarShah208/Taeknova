import { baseApi } from '@services/baseApi';
import { assertBackendSuccess, unwrapBackendData } from '@services/apiEnvelope';
import type { ProfileDto } from '@app-types/storeApi';
import { mapProfileDtoToUser } from '@redux/admin/mapBackendUser';
import { setUser } from '@redux/auth';

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ProfileDto, void>({
      query: () => ({ url: '/profile' }),
      transformResponse: (raw: unknown) => unwrapBackendData<ProfileDto>(raw),
      providesTags: [{ type: 'UserProfile', id: 'ME' }],
    }),
    updateProfile: builder.mutation<ProfileDto, { fullName: string }>({
      query: (body) => ({ url: '/profile', method: 'PATCH', body }),
      transformResponse: (raw: unknown) => unwrapBackendData<ProfileDto>(raw),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setUser(mapProfileDtoToUser(data)));
      },
      invalidatesTags: [{ type: 'UserProfile', id: 'ME' }],
    }),
    changePassword: builder.mutation<void, { currentPassword: string; newPassword: string }>({
      query: (body) => ({ url: '/profile/change-password', method: 'POST', body }),
      transformResponse: (raw: unknown) => {
        assertBackendSuccess(raw);
        return undefined;
      },
    }),
    uploadAvatar: builder.mutation<ProfileDto, File>({
      query: (file) => {
        const body = new FormData();
        body.append('image', file);
        return { url: '/profile/avatar', method: 'POST', body };
      },
      transformResponse: (raw: unknown) => unwrapBackendData<ProfileDto>(raw),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setUser(mapProfileDtoToUser(data)));
      },
      invalidatesTags: [{ type: 'UserProfile', id: 'ME' }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useUploadAvatarMutation,
} = profileApi;
