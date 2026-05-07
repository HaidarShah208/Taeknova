import { Outlet } from 'react-router-dom';

import { Logo } from '@components/layout/Logo';
import { APP_TAGLINE } from '@constants/app';

export function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-foreground text-background lg:flex lg:flex-col lg:justify-between lg:p-10">
        <div className="absolute inset-0 -z-0 opacity-50">
          <img
            src="https://picsum.photos/seed/tikwando-auth/1200/1600"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/90 via-foreground/80 to-primary-900/80" />
        </div>
        <div className="relative z-10">
          <Logo size="lg" className="text-background [&_span:last-child]:text-background" />
        </div>
        <div className="relative z-10 max-w-md space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-background/70">
            {APP_TAGLINE}
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight">
            Performance uniforms, engineered for every team.
          </h1>
          <p className="text-sm leading-relaxed text-background/80">
            Premium fabrics, customizable details, and championship-level construction —
            trusted by thousands of teams.
          </p>
        </div>
        <div className="relative z-10 text-xs text-background/60">
          © {new Date().getFullYear()} Tikwando — Built for performance.
        </div>
      </aside>

      <section className="flex flex-col items-center justify-center px-6 py-12 sm:px-12">
        <div className="lg:hidden">
          <Logo size="md" />
        </div>
        <div className="mt-10 w-full max-w-md lg:mt-0">
          <Outlet />
        </div>
      </section>
    </div>
  );
}

export default AuthLayout;
