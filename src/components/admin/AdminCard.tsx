import type { ReactNode } from 'react';

import { cn } from '@lib/cn';

interface AdminCardProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function AdminCard({ title, description, action, children, className }: AdminCardProps) {
  return (
    <section className={cn('rounded-2xl border border-white/10 bg-[#131722] p-5 text-slate-100', className)}>
      {(title || description || action) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-base font-semibold">{title}</h2>}
            {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
