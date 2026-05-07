import { ChevronRight, Home } from 'lucide-react';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@constants/routes';
import { cn } from '@lib/cn';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center text-sm text-muted-foreground', className)}
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link
            to={ROUTES.home}
            className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
            aria-label="Home"
          >
            <Home className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <Fragment key={`${item.label}-${idx}`}>
              <li aria-hidden="true" className="text-muted-foreground/60">
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li>
                {item.to && !isLast ? (
                  <Link
                    to={item.to}
                    className="transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current={isLast ? 'page' : undefined}
                    className={cn('font-medium', isLast && 'text-foreground')}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
