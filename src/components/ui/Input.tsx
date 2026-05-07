import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';

import { cn } from '@lib/cn';

export const inputVariants = cva(
  [
    'flex w-full rounded-lg border border-input bg-background text-foreground',
    'placeholder:text-muted-foreground/70',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
    'disabled:cursor-not-allowed disabled:opacity-60',
  ],
  {
    variants: {
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-4 text-sm',
        lg: 'h-12 px-4 text-base',
      },
      invalid: {
        true: 'border-destructive focus-visible:ring-destructive',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

interface InputBaseProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  description?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputBaseProps>(function Input(
  {
    className,
    containerClassName,
    label,
    description,
    error,
    leftIcon,
    rightIcon,
    size,
    invalid,
    id,
    type = 'text',
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedById = description || error ? `${inputId}-desc` : undefined;
  const isInvalid = invalid || !!error;

  return (
    <div className={cn('flex w-full flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          aria-invalid={isInvalid || undefined}
          aria-describedby={describedById}
          className={cn(
            inputVariants({ size, invalid: isInvalid || undefined }),
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            className,
          )}
          {...props}
        />
        {rightIcon && (
          <span className="absolute inset-y-0 right-3 flex items-center text-muted-foreground">
            {rightIcon}
          </span>
        )}
      </div>
      {(description || error) && (
        <p
          id={describedById}
          className={cn(
            'text-xs',
            error ? 'text-destructive' : 'text-muted-foreground',
          )}
        >
          {error ?? description}
        </p>
      )}
    </div>
  );
});
