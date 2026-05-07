import { zodResolver } from '@hookform/resolvers/zod';
import { Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { FormField } from '@components/forms/FormField';
import { PageMeta } from '@components/layout/PageMeta';
import { Button } from '@components/ui/Button';
import { ROUTES } from '@constants/routes';

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onBlur',
  });

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    toast.success('Password reset successful. Please sign in.');
    navigate(ROUTES.login, { replace: true });
  };

  return (
    <>
      <PageMeta title="Reset Password" />
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Reset password
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter a new password for your account.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <FormField
            name="password"
            label="New password"
            type="password"
            autoComplete="new-password"
            leftIcon={<Lock className="h-4 w-4" />}
            register={register}
            errors={errors}
          />
          <FormField
            name="confirmPassword"
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            leftIcon={<Lock className="h-4 w-4" />}
            register={register}
            errors={errors}
          />
          <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
            Update password
          </Button>
        </form>
      </div>
    </>
  );
}
