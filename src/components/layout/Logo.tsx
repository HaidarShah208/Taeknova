import { Link } from 'react-router-dom';

import { APP_NAME } from '@constants/app';
import { ROUTES } from '@constants/routes';
import { cn } from '@lib/cn';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes: Record<NonNullable<LogoProps['size']>, { wrap: string; mark: string; text: string }> = {
  sm: { wrap: 'gap-2', mark: 'h-7 w-7 text-sm', text: 'text-base' },
  md: { wrap: 'gap-2.5', mark: 'h-9 w-9 text-base', text: 'text-lg' },
  lg: { wrap: 'gap-3', mark: 'h-11 w-11 text-lg', text: 'text-xl' },
};

export function Logo({ className, size = 'md' }: LogoProps) {
  const s = sizes[size];
  return (
    <Link
      to={ROUTES.home}
      aria-label={`${APP_NAME} home`}
      className={cn('inline-flex items-center font-display font-bold tracking-tight', s.wrap, className)}
    >
      <span
        className={cn(
          'inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-900 font-black text-primary-foreground shadow-soft',
          s.mark,
        )}
        aria-hidden="true"
      >
        T
      </span>
      <span className={cn('text-foreground', s.text)}>{APP_NAME}</span>
    </Link>
  );
}
