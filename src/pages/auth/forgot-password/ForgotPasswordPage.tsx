import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { FormField } from '@components/forms/FormField';
import { PageMeta } from '@components/layout/PageMeta';
import { Button } from '@components/ui/Button';
import { ROUTES } from '@constants/routes';

const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    toast.success(`Password reset instructions sent to ${values.email}`);
  };

  return (
    <>
      <PageMeta title="Forgot Password" />
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Forgot your password?
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email and we will send you a secure link to reset your password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <FormField
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@team.com"
            leftIcon={<Mail className="h-4 w-4" />}
            register={register}
            errors={errors}
          />
          <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
            Send reset link
          </Button>
        </form>

        <Link
          to={ROUTES.login}
          className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to sign in
        </Link>
      </div>
    </>
  );
}
