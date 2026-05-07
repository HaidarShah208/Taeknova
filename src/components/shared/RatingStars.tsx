import { Star } from 'lucide-react';

import { cn } from '@lib/cn';
import { clamp } from '@utils/misc';

interface RatingStarsProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  reviewsCount?: number;
  className?: string;
}

const sizeMap: Record<NonNullable<RatingStarsProps['size']>, string> = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

export function RatingStars({
  value,
  max = 5,
  size = 'md',
  showValue = false,
  reviewsCount,
  className,
}: RatingStarsProps) {
  const safe = clamp(value, 0, max);
  const percentage = (safe / max) * 100;
  const iconClass = sizeMap[size];

  return (
    <div
      className={cn('inline-flex items-center gap-1.5', className)}
      role="img"
      aria-label={`${safe.toFixed(1)} out of ${max} stars`}
    >
      <span className="relative inline-flex">
        <span className="inline-flex" aria-hidden="true">
          {Array.from({ length: max }).map((_, idx) => (
            <Star key={idx} className={cn(iconClass, 'text-muted-foreground/40')} />
          ))}
        </span>
        <span
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${percentage}%` }}
          aria-hidden="true"
        >
          <span className="inline-flex">
            {Array.from({ length: max }).map((_, idx) => (
              <Star key={idx} className={cn(iconClass, 'fill-amber-400 text-amber-400')} />
            ))}
          </span>
        </span>
      </span>
      {showValue && <span className="text-xs font-semibold text-foreground">{safe.toFixed(1)}</span>}
      {reviewsCount !== undefined && (
        <span className="text-xs text-muted-foreground">({reviewsCount.toLocaleString()})</span>
      )}
    </div>
  );
}
