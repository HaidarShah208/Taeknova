import { baseApi } from '@services/baseApi';
import { unwrapBackendEnvelope } from '@services/apiEnvelope';
import type { ContactFormValues } from '@features/contact/contactSchema';

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitContactForm: builder.mutation<{ message: string }, ContactFormValues>({
      query: (body) => ({
        url: '/contact',
        method: 'POST',
        body: {
          fullName: body.fullName.trim(),
          email: body.email.trim(),
          phone: body.phone?.trim() || undefined,
          subject: body.subject.trim(),
          message: body.message.trim(),
        },
      }),
      transformResponse: (raw: unknown) => {
        const { message } = unwrapBackendEnvelope<{ sent: boolean }>(raw);
        return { message };
      },
    }),
  }),
  overrideExisting: true,
});

export const { useSubmitContactFormMutation } = contactApi;
