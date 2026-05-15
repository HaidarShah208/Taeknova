import type { LucideIcon } from 'lucide-react';
import { PackageOpen } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@lib/cn';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        'flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center',
        className,
      )}
    >
      <span className="mb-4 text-white inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-red-400 via-red-500 to-red-600">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
      {description && (
        <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
