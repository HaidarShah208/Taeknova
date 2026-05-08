import type { ReactNode } from 'react';

import { cn } from '@lib/cn';

interface StatsCardProps {
  label: string;
  value: string;
  delta?: string;
  icon?: ReactNode;
  className?: string;
}

export function StatsCard({ label, value, delta, icon, className }: StatsCardProps) {
  return (
    <article className={cn('rounded-2xl border border-slate-200 bg-white p-4 shadow-sm', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
          {delta && <p className="mt-1 text-xs text-emerald-600">{delta}</p>}
        </div>
        {icon ? <span className="rounded-lg bg-slate-100 p-2 text-slate-700">{icon}</span> : null}
      </div>
    </article>
  );
}
