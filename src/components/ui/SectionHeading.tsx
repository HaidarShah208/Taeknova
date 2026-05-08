import type { ReactNode } from 'react';

import { cn } from '@lib/cn';

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  action?: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
  className,
  as: Heading = 'h2',
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col gap-3 sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'text-center sm:items-center sm:justify-center',
        className,
      )}
    >
      <div className={cn('flex max-w-2xl flex-col gap-2', align === 'center' && 'mx-auto')}>
        {eyebrow && (
          <span className="text-sm font-bold uppercase tracking-[0.22em] text-foreground">
            {eyebrow}
          </span>
        )}
        <Heading className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-5xl">
          {title}
        </Heading>
        {description && (
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}
