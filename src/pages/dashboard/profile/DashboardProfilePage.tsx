import { useAppSelector } from '@redux';
import { PageMeta } from '@components/layout/PageMeta';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { selectCurrentUser } from '@redux/auth';

export default function DashboardProfilePage() {
  const user = useAppSelector(selectCurrentUser);

  return (
    <>
      <PageMeta title="My Profile" />
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Dashboard
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your account details and personal info.
        </p>
      </header>

      <Card className="mt-8" padding="lg">
        <CardHeader>
          <CardTitle>Account details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">First name</dt>
              <dd className="font-medium text-foreground">{user?.firstName ?? '-'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Last name</dt>
              <dd className="font-medium text-foreground">{user?.lastName ?? '-'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium text-foreground">{user?.email ?? '-'}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </>
  );
}
