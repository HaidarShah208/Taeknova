import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useAppDispatch } from '@redux';
import { useAdminLoginMutation } from '@redux/admin/auth';
import { FormField } from '@components/forms/FormField';
import { PageMeta } from '@components/layout/PageMeta';
import { Button } from '@components/ui/Button';
import { ROUTES } from '@constants/routes';
import env from '@lib/env';
import { setSession } from '@redux/auth';
import { loginSchema, type LoginFormValues } from '@redux/auth';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [adminLogin, { isLoading: isApiLogin }] = useAdminLoginMutation();
  const redirectTo =
    (location.state as { from?: string } | null)?.from ?? ROUTES.dashboard;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (values: LoginFormValues) => {
    if (!env.enableMockApi) {
      try {
        const data = await adminLogin({
          email: values.email.trim(),
          password: values.password,
        }).unwrap();
        const isAdminUser = data.user.role === 'ADMIN';
        const from = (location.state as { from?: string } | null)?.from;
        if (from?.startsWith(ROUTES.adminRoot) && isAdminUser) {
          navigate(from, { replace: true });
        } else if (isAdminUser) {
          navigate(ROUTES.adminDashboard, { replace: true });
        } else {
          navigate(
            redirectTo === ROUTES.dashboard ? ROUTES.dashboardProfile : redirectTo,
            { replace: true },
          );
        }
        toast.success('Welcome back!');
      } catch {
        toast.error('Invalid email or password');
      }
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    const isAdmin = values.email.toLowerCase().includes('admin');
    const fallbackRoute = isAdmin ? ROUTES.adminDashboard : ROUTES.dashboard;
    const nextRoute = redirectTo === ROUTES.dashboard ? fallbackRoute : redirectTo;

    dispatch(
      setSession({
        token: 'mock-token-' + Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        user: {
          id: 'user-1',
          email: values.email,
          firstName: 'Tiknova',
          lastName: 'Athlete',
          role: isAdmin ? 'admin' : 'user',
          createdAt: new Date().toISOString(),
        },
      }),
    );
    toast.success('Welcome back!');
    navigate(nextRoute, { replace: true });
  };

  return (
    <>
      <PageMeta title="Sign in" />
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to manage orders, save favorites, and track team kits.
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
          <FormField
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="Your password"
            leftIcon={<Lock className="h-4 w-4" />}
            register={register}
            errors={errors}
          />
          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2 text-muted-foreground">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
              />
              Remember me
            </label>
            <Link
              to={ROUTES.forgotPassword}
              className="font-semibold text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Button type="submit" fullWidth size="lg" isLoading={isSubmitting || isApiLogin}>
            Sign in
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          New to Tiknova?{' '}
          <Link to={ROUTES.register} className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </>
  );
}
