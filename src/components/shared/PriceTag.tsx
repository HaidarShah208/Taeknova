import { cn } from '@lib/cn';
import { formatPrice } from '@lib/formatters';
import { getDiscountPercent } from '@utils/misc';

interface PriceTagProps {
  price: number;
  comparePrice?: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
  showDiscount?: boolean;
  className?: string;
}

const sizeClasses: Record<NonNullable<PriceTagProps['size']>, { price: string; compare: string }> = {
  sm: { price: 'text-sm font-semibold', compare: 'text-xs' },
  md: { price: 'text-base font-bold', compare: 'text-sm' },
  lg: { price: 'text-2xl font-bold', compare: 'text-base' },
};

export function PriceTag({
  price,
  comparePrice,
  currency = 'PKR',
  size = 'md',
  showDiscount = true,
  className,
}: PriceTagProps) {
  const sizes = sizeClasses[size];
  const discount = comparePrice ? getDiscountPercent(price, comparePrice) : 0;

  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      <span className={cn('text-foreground', sizes.price)}>{formatPrice(price, { currency })}</span>
      {comparePrice && comparePrice > price && (
        <span className={cn('text-muted-foreground line-through', sizes.compare)}>
          {formatPrice(comparePrice, { currency })}
        </span>
      )}
      {showDiscount && discount > 0 && (
        <span
          className={cn(
            'rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-destructive',
          )}
        >
          -{discount}%
        </span>
      )}
    </div>
  );
}
