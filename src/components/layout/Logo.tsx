import { Link } from 'react-router-dom';

import { APP_NAME } from '@constants/app';
import { ROUTES } from '@constants/routes';
import logo from '../../assets/brandLogo.png'
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
    
        <img src={logo} className='w-16 h-20 object-cover ' alt="" />
    </Link>
  );
}
