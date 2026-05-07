import { Minus, Plus } from 'lucide-react';
import { useCallback } from 'react';

import { cn } from '@lib/cn';
import { clamp } from '@utils/misc';

interface QuantitySelectorProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

const sizeClasses: Record<NonNullable<QuantitySelectorProps['size']>, { wrap: string; btn: string; input: string }> = {
  sm: { wrap: 'h-9', btn: 'h-9 w-9', input: 'w-10 text-sm' },
  md: { wrap: 'h-11', btn: 'h-11 w-11', input: 'w-12 text-sm' },
  lg: { wrap: 'h-12', btn: 'h-12 w-12', input: 'w-14 text-base' },
};

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
  disabled = false,
  className,
}: QuantitySelectorProps) {
  const sizes = sizeClasses[size];

  const update = useCallback(
    (next: number) => {
      onChange(clamp(next, min, max));
    },
    [onChange, min, max],
  );

  return (
    <div
      className={cn(
        'inline-flex items-stretch overflow-hidden rounded-lg border border-border bg-background',
        sizes.wrap,
        disabled && 'pointer-events-none opacity-60',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => update(value - 1)}
        disabled={value <= min || disabled}
        aria-label="Decrease quantity"
        className={cn(
          'flex items-center justify-center transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:text-muted-foreground/50',
          sizes.btn,
        )}
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (!Number.isNaN(next)) update(next);
        }}
        disabled={disabled}
        className={cn(
          'border-x border-border bg-background text-center font-semibold focus:outline-none focus:ring-2 focus:ring-ring',
          '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
          sizes.input,
        )}
        aria-label="Quantity"
      />
      <button
        type="button"
        onClick={() => update(value + 1)}
        disabled={value >= max || disabled}
        aria-label="Increase quantity"
        className={cn(
          'flex items-center justify-center transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:text-muted-foreground/50',
          sizes.btn,
        )}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
