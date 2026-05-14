import { zodResolver } from '@hookform/resolvers/zod';
import { Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { FormField } from '@components/forms/FormField';
import { PageMeta } from '@components/layout/PageMeta';
import { Button } from '@components/ui/Button';
import { ROUTES } from '@constants/routes';
import env from '@lib/env';
import { useResetPasswordMutation } from '@redux/customer';

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
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [resetPassword, { isLoading: isApiReset }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!env.enableMockApi) {
      if (!token?.trim()) {
        toast.error('Invalid or missing reset link. Use the link from your email or request a new one.');
        return;
      }
      try {
        const { message } = await resetPassword({ token: token.trim(), password: values.password }).unwrap();
        toast.success(message);
        navigate(ROUTES.login, { replace: true });
      } catch (err: unknown) {
        const data = (err as { data?: { message?: string } })?.data;
        toast.error(typeof data?.message === 'string' ? data.message : 'Could not reset password.');
      }
      return;
    }

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

        {!env.enableMockApi && !token?.trim() && (
          <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            This page needs a valid token from your reset email. Open the link from your inbox, or go to{' '}
            <Link to={ROUTES.forgotPassword} className="font-semibold underline">
              forgot password
            </Link>{' '}
            to request a new link.
          </p>
        )}

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
          <Button type="submit" fullWidth size="lg" isLoading={isSubmitting || isApiReset}>
            Update password
          </Button>
        </form>
      </div>
    </>
  );
}
