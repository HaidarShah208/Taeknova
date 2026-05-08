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
    <article className={cn('rounded-2xl border border-white/10 bg-[#131722] p-4', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
          {delta && <p className="mt-1 text-xs text-emerald-400">{delta}</p>}
        </div>
        {icon ? <span className="rounded-lg bg-white/5 p-2 text-slate-200">{icon}</span> : null}
      </div>
    </article>
  );
}
