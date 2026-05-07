import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@lib/cn';

export const featureCardVariants = cva(
  'group relative flex flex-col gap-3 overflow-hidden rounded-2xl p-6 transition-all duration-300',
  {
    variants: {
      variant: {
        default:
          'border border-border bg-card text-card-foreground hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated',
        muted:
          'border border-border bg-muted/40 text-foreground hover:-translate-y-1 hover:bg-muted/60',
        ghost:
          'border border-transparent bg-transparent text-foreground hover:border-border hover:bg-card',
        dark:
          'border border-background/10 bg-background/5 text-background backdrop-blur hover:bg-background/10',
      },
      size: {
        sm: 'p-5',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

interface FeatureCardProps extends VariantProps<typeof featureCardVariants> {
  icon: LucideIcon;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  iconClassName?: string;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  action,
  iconClassName,
  className,
  variant,
  size,
}: FeatureCardProps) {
  return (
    <article className={cn(featureCardVariants({ variant, size }), className)}>
      <span
        className={cn(
          'inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110',
          variant === 'dark' && 'bg-background/10 text-background',
          iconClassName,
        )}
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold leading-tight tracking-tight">{title}</h3>
        {description && (
          <p
            className={cn(
              'text-sm leading-relaxed',
              variant === 'dark' ? 'text-background/70' : 'text-muted-foreground',
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </article>
  );
}
