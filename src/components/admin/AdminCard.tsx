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
    <section className={cn('rounded-2xl border border-slate-200 bg-white p-5 overflow-hidden text-slate-900 shadow-sm', className)}>
      {(title || description || action) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-base font-semibold">{title}</h2>}
            {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
