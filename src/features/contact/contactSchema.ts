import { z } from 'zod';

export const contactFormSchema = z.object({
  fullName: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || val.replace(/\D/g, '').length >= 7, 'Enter a valid phone number'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
