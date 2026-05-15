import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { FormField } from '@components/forms/FormField';
import { FormTextarea } from '@components/forms/FormTextarea';
import { SectionWrapper } from '@components/shared/SectionWrapper';
import { Button } from '@components/ui/Button';
import { BRAND_NAME } from '@constants/company';
import {
  contactFormSchema,
  type ContactFormValues,
} from '@features/contact/contactSchema';
import env from '@lib/env';
import { fadeUp, viewportOnce } from '@lib/motion';
import { useSubmitContactFormMutation } from '@redux/customer';

export function ContactFormSection() {
  const [submitContact, { isLoading: isApiSubmitting }] = useSubmitContactFormMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onBlur',
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const isSubmitting = isFormSubmitting || isApiSubmitting;

  const onSubmit = async (values: ContactFormValues) => {
    const firstName = values.fullName.trim().split(' ')[0] || 'there';

    if (!env.enableMockApi) {
      try {
        const { message } = await submitContact(values).unwrap();
        toast.success(message);
        reset();
      } catch {
        toast.error('Could not send your message. Please try again or email us directly.');
      }
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success(`Thanks, ${firstName}! We will reply within one business day.`);
    reset();
  };

  return (
    <SectionWrapper
      tone="muted"
      className="bg-gradient-to-b from-muted/40 to-background"
      eyebrow="Send a message"
      title="Tell us about your team"
      description={`Share your requirements — custom kits, bulk orders, sizing, or general questions. The ${BRAND_NAME} team is ready to help.`}
    >
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.5 }}
        noValidate
      >
        <motion.div
          className="grid gap-5 sm:grid-cols-2"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div variants={fadeUp}>
            <FormField
              name="fullName"
              label="Full name"
              placeholder="Ali Hassan"
              autoComplete="name"
              register={register}
              errors={errors}
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <FormField
              name="email"
              label="Email"
              type="email"
              placeholder="you@academy.com"
              autoComplete="email"
              register={register}
              errors={errors}
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <FormField
              name="phone"
              label="Phone (optional)"
              type="tel"
              placeholder="0300-0000000"
              autoComplete="tel"
              register={register}
              errors={errors}
            />
          </motion.div>
          <motion.div variants={fadeUp} className="sm:col-span-2">
            <FormField
              name="subject"
              label="Subject"
              placeholder="Custom team kit for 40 athletes"
              register={register}
              errors={errors}
            />
          </motion.div>
          <motion.div variants={fadeUp} className="sm:col-span-2">
            <FormTextarea
              name="message"
              label="Message"
              placeholder="Tell us about your team, timeline, and customization needs..."
              rows={6}
              register={register}
              errors={errors}
            />
          </motion.div>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-6">
          <Button
            type="submit"
            size="lg"
            className="w-full bg-foreground sm:w-auto"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            rightIcon={!isSubmitting ? <Send className="h-4 w-4" aria-hidden="true" /> : undefined}
          >
            {isSubmitting ? 'Sending...' : 'Send message'}
          </Button>
        </motion.div>
      </motion.form>
    </SectionWrapper>
  );
}
