import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { PageMeta } from '@components/layout/PageMeta';
import { buttonVariants } from '@components/ui/Button';
import { Loader } from '@components/ui/Loader';
import { ROUTES } from '@constants/routes';
import { cn } from '@lib/cn';
import { useLazyVerifyEmailQuery } from '@redux/customer';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

function errorMessage(err: unknown): string {
  const e = err as FetchBaseQueryError;
  const data = e?.data as { message?: string } | undefined;
  if (data && typeof data.message === 'string') return data.message;
  return 'Something went wrong. The link may be invalid or expired.';
}

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [verifyTrigger, { data, isSuccess, isError, error, isFetching }] = useLazyVerifyEmailQuery();

  useEffect(() => {
    if (!token?.trim()) return;
    void verifyTrigger(token);
  }, [token, verifyTrigger]);

  return (
    <>
      <PageMeta title="Verify email" />
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Email verification</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Confirming your account so you can sign in securely.
        </p>

        <div className="mt-8 space-y-4">
          {!token?.trim() && (
            <p className="text-sm text-destructive">
              This link is missing a token. Open the link from your confirmation email, or register again.
            </p>
          )}
          {token && isFetching && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Loader className="h-5 w-5" />
              Verifying…
            </div>
          )}
          {isSuccess && data?.verified && (
            <p className="text-sm text-foreground">
              Your email is verified. You can sign in with your email and password.
            </p>
          )}
          {isError && <p className="text-sm text-destructive">{errorMessage(error)}</p>}

          <Link to={ROUTES.login} className={cn(buttonVariants({ variant: 'primary', size: 'md' }))}>
            Go to sign in
          </Link>
        </div>
      </div>
    </>
  );
}
