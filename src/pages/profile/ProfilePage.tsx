import { LogOut, Mail, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useAppDispatch, useAppSelector } from '@redux';
import { PageMeta } from '@components/layout/PageMeta';
import { Button } from '@components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/Tabs';
import { ROUTES } from '@constants/routes';
import env from '@lib/env';
import { OrderTrackTab } from '@features/profile/OrderTrackTab';
import { useAdminLogoutMutation } from '@redux/admin/auth';
import { clearSession, selectCurrentUser } from '@redux/auth';
import { useGetProfileQuery } from '@redux/customer';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);
  const apiMode = !env.enableMockApi;
  const { data: profile, isLoading } = useGetProfileQuery(undefined, {
    skip: !apiMode || !user,
  });
  const [logoutApi, { isLoading: isLoggingOut }] = useAdminLogoutMutation();

  const displayName = apiMode && profile ? profile.fullName : user ? `${user.firstName} ${user.lastName}` : 'Guest User';
  const email = apiMode && profile ? profile.email : user?.email ?? 'Not available';

  const handleLogout = async () => {
    if (apiMode) {
      try {
        await logoutApi().unwrap();
      } catch {
        dispatch(clearSession());
      }
    } else {
      dispatch(clearSession());
    }
    toast.success('Signed out');
    navigate(ROUTES.home, { replace: true });
  };

  return (
    <>
      <PageMeta title="My Profile" />
      <div className="mx-auto max-w-3xl py-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6 flex w-full max-w-full flex-wrap gap-1 overflow-x-auto sm:w-auto">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="track">Track orders</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-0">
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>Manage your account details and sign out.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {apiMode && isLoading && (
                  <p className="text-sm text-muted-foreground">Loading profile…</p>
                )}
                <div className="rounded-xl border border-border bg-muted/30 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Account name
                  </p>
                  <p className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                    <User className="h-4 w-4 text-primary" />
                    {displayName}
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-muted/30 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Email
                  </p>
                  <p className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Mail className="h-4 w-4 text-primary" />
                    {email}
                  </p>
                </div>

                <Button
                  variant="destructive"
                  onClick={() => void handleLogout()}
                  isLoading={isLoggingOut}
                  leftIcon={<LogOut className="h-4 w-4" />}
                >
                  Logout
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="track">
            <OrderTrackTab />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
