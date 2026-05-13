import { LogOut, ShieldCheck } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useAppSelector } from '@redux';
import { Button } from '@components/ui/Button';
import { ADMIN_NAV } from '@constants/navigation';
import { ROUTES } from '@constants/routes';
import { selectCurrentUser } from '@redux/auth';
import { useAdminLogoutMutation } from '@redux/admin';
import { cn } from '@lib/cn';

export function AdminLayout() {
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);
  const [logout, { isLoading: isLoggingOut }] = useAdminLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success('Signed out');
      navigate(ROUTES.home, { replace: true });
    } catch {
      toast.error('Could not sign out');
    }
  };

  return (
    <div className="min-h-screen  bg-slate-50 text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-slate-200 bg-white p-5">
          <div className="mb-8 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">Tikwando Admin</p>
              <p className="text-xs text-slate-500">Control center</p>
            </div>
          </div>

          <nav aria-label="Admin navigation">
            <ul className="space-y-1">
              {ADMIN_NAV.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        'block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors',
                        isActive ? 'bg-primary text-white' : 'hover:bg-slate-100 hover:text-slate-900',
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-semibold">{user ? `${user.firstName} ${user.lastName}` : 'Admin'}</p>
            <p className="mt-0.5 text-xs text-slate-500">{user?.email?.trim() ? user.email : '—'}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              fullWidth
              className="mt-3 border-slate-300 text-slate-700"
              leftIcon={<LogOut className="h-3.5 w-3.5" />}
              isLoading={isLoggingOut}
              disabled={isLoggingOut}
              onClick={() => void handleLogout()}
            >
              Sign out
            </Button>
          </div>
        </aside>

        <main className="bg-slate-50 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
