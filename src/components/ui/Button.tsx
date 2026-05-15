import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

import { cn } from '@lib/cn';

export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold',
    'transition-all duration-200 ease-out',
    'disabled:pointer-events-none disabled:opacity-50',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'active:translate-y-px',
  ],
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-primary-600 via-white-500 to-white/60 text-primary-foreground shadow-soft hover:from-primary-600 hover:to-primary-700 hover:text-white hover:shadow-elevated',
        secondary:
          'bg-gradient-to-r from-white to-muted text-foreground border border-border hover:from-muted hover:to-white',
        accent:
          'bg-accent text-accent-foreground shadow-soft hover:brightness-110',
        outline:
          'border border-border bg-transparent text-foreground hover:bg-muted',
        ghost: 'bg-transparent text-foreground hover:bg-muted',
        link: 'bg-transparent text-primary underline-offset-4 hover:underline px-0',
        destructive:
          'bg-destructive text-destructive-foreground shadow-soft hover:brightness-110',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-5 text-sm',
        lg: 'h-12 px-7 text-base',
        xl: 'h-14 px-8 text-base',
        icon: 'h-10 w-10 p-0',
        'icon-sm': 'h-8 w-8 p-0',
      },
      fullWidth: { true: 'w-full' },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant,
    size,
    fullWidth,
    isLoading = false,
    leftIcon,
    rightIcon,
    disabled,
    children,
    type = 'button',
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      {children && <span className="truncate">{children}</span>}
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
});
