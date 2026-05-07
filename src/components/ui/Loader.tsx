import { Loader2 } from 'lucide-react';

import { cn } from '@lib/cn';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
}

const sizeMap: Record<NonNullable<LoaderProps['size']>, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

export function Loader({ size = 'md', className, label = 'Loading' }: LoaderProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn('inline-flex items-center justify-center text-primary', className)}
    >
      <Loader2 className={cn('animate-spin', sizeMap[size])} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
