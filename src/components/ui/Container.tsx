import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ElementType, type HTMLAttributes } from 'react';

import { cn } from '@lib/cn';

export const containerVariants = cva('mx-auto w-full px-4 sm:px-6 lg:px-8', {
  variants: {
    width: {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      '2xl': 'max-w-screen-2xl',
      full: 'max-w-full',
    },
  },
  defaultVariants: { width: '2xl' },
});

interface ContainerProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof containerVariants> {
  as?: ElementType;
}

export const Container = forwardRef<HTMLElement, ContainerProps>(function Container(
  { className, width, as: Component = 'div', ...props },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={cn(containerVariants({ width }), className)}
      {...props}
    />
  );
});
