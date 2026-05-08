import { LogOut, Mail, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@redux';
import { PageMeta } from '@components/layout/PageMeta';
import { Button } from '@components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/Card';
import { ROUTES } from '@constants/routes';
import { clearSession, selectCurrentUser } from '@redux/auth';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(clearSession());
    navigate(ROUTES.home, { replace: true });
  };

  return (
    <>
      <PageMeta title="My Profile" />
      <div className="mx-auto max-w-3xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>Manage your account details and sign out.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Account name
              </p>
              <p className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                <User className="h-4 w-4 text-primary" />
                {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email
              </p>
              <p className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                <Mail className="h-4 w-4 text-primary" />
                {user?.email ?? 'Not available'}
              </p>
            </div>

            <Button variant="destructive" onClick={handleLogout} leftIcon={<LogOut className="h-4 w-4" />}>
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
