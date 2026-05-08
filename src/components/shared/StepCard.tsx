import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@lib/cn';

interface StepCardProps {
  icon: LucideIcon;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}

export function StepCard({ icon: Icon, title, description, className }: StepCardProps) {
  return (
    <article
      className={cn(
        'relative flex h-full flex-col items-center gap-3 rounded-2xl border border-border/10 bg-card/80 p-6 text-center shadow-soft backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute right-4 top-3 font-display text-2xl font-bold leading-none tracking-tight text-muted-foreground/20"
      >
      </span>
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border bg-background/40 text-foreground">
        <Icon className="h-8 w-8" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold leading-tight tracking-tight">{title}</h3>
        {description && (
          <p className="text-xs pt-3 leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
    </article>
  );
}
