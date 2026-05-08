import { LogOut, ShieldCheck } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@redux';
import { ADMIN_NAV } from '@constants/navigation';
import { ROUTES } from '@constants/routes';
import { clearSession, selectCurrentUser } from '@redux/auth';
import { cn } from '@lib/cn';

export function AdminLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(clearSession());
    navigate(ROUTES.home);
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-white/10 bg-[#12151c] p-5">
          <div className="mb-8 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">Tikwando Admin</p>
              <p className="text-xs text-slate-400">Control center</p>
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
                        'block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors',
                        isActive ? 'bg-primary text-white' : 'hover:bg-white/5 hover:text-white',
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-sm font-semibold">{user ? `${user.firstName} ${user.lastName}` : 'Admin'}</p>
            <p className="mt-0.5 text-xs text-slate-400">{user?.email ?? 'admin@tikwando.com'}</p>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-slate-100 transition-colors hover:bg-white/10"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </aside>

        <main className="bg-[#0b0d12] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
