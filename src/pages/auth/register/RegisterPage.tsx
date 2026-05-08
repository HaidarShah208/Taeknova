import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useAppDispatch } from '@redux';
import { FormField } from '@components/forms/FormField';
import { PageMeta } from '@components/layout/PageMeta';
import { Button } from '@components/ui/Button';
import { ROUTES } from '@constants/routes';
import { setSession } from '@redux/auth';
import { registerSchema, type RegisterFormValues } from '@redux/auth';

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (values: RegisterFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    dispatch(
      setSession({
        token: 'mock-token-' + Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        user: {
          id: 'user-' + Date.now(),
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          role: 'user',
          createdAt: new Date().toISOString(),
        },
      }),
    );
    toast.success('Account created!');
    navigate(ROUTES.dashboard, { replace: true });
  };

  return (
    <>
      <PageMeta title="Create your account" />
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Build your team store, save favorites, and track every order.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              name="firstName"
              label="First name"
              autoComplete="given-name"
              leftIcon={<User className="h-4 w-4" />}
              register={register}
              errors={errors}
            />
            <FormField
              name="lastName"
              label="Last name"
              autoComplete="family-name"
              register={register}
              errors={errors}
            />
          </div>
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
          <FormField
            name="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            leftIcon={<Lock className="h-4 w-4" />}
            register={register}
            errors={errors}
          />
          <FormField
            name="confirmPassword"
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            leftIcon={<Lock className="h-4 w-4" />}
            register={register}
            errors={errors}
          />
          <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
            Create account
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to={ROUTES.login} className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
}
