import { useMemo } from 'react';

import { Accordion, AccordionItem } from '@components/ui/Accordion';
import { Button } from '@components/ui/Button';
import { cn } from '@lib/cn';
import type { Category, ProductFilters } from '@app-types/product';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = [
  { name: 'Onyx', hex: '#0f172a' },
  { name: 'Crimson', hex: '#dc2626' },
  { name: 'Cobalt', hex: '#2645f5' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Ivory', hex: '#f5f5dc' },
  { name: 'Slate', hex: '#64748b' },
];
const PRICE_RANGES: { label: string; min?: number; max?: number }[] = [
  { label: 'Under $50', max: 50 },
  { label: '$50 – $100', min: 50, max: 100 },
  { label: '$100 – $200', min: 100, max: 200 },
  { label: 'Over $200', min: 200 },
];

interface FilterSidebarProps {
  filters: ProductFilters;
  onChange: (next: ProductFilters) => void;
  onReset: () => void;
  categories: Category[];
  className?: string;
}

const toggleInArray = (arr: string[] = [], value: string): string[] =>
  arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

export function FilterSidebar({
  filters,
  onChange,
  onReset,
  categories,
  className,
}: FilterSidebarProps) {
  const activeCount = useMemo(() => {
    let n = 0;
    if (filters.categories?.length) n += filters.categories.length;
    if (filters.sizes?.length) n += filters.sizes.length;
    if (filters.colors?.length) n += filters.colors.length;
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) n += 1;
    if (filters.rating) n += 1;
    return n;
  }, [filters]);

  return (
    <aside
      className={cn(
        'flex h-full w-full flex-col rounded-2xl border border-border bg-card p-5',
        className,
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-tight">Filters</h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-primary underline-offset-4 hover:underline"
          >
            Clear ({activeCount})
          </button>
        )}
      </div>

      <Accordion type="multiple" defaultOpen={['categories', 'price', 'sizes']}>
        <AccordionItem value="categories" trigger="Categories">
          <ul className="flex flex-col gap-2">
            {categories.map((category) => {
              const checked = filters.categories?.includes(category.slug) ?? false;
              return (
                <li key={category.id}>
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        onChange({
                          ...filters,
                          categories: toggleInArray(filters.categories, category.slug),
                        })
                      }
                      className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                    />
                    <span className="flex-1">{category.name}</span>
                    <span className="text-xs text-muted-foreground">{category.productCount}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </AccordionItem>

        <AccordionItem value="price" trigger="Price">
          <ul className="flex flex-col gap-2">
            {PRICE_RANGES.map((range) => {
              const isActive =
                filters.priceMin === range.min && filters.priceMax === range.max;
              return (
                <li key={range.label}>
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...filters,
                        priceMin: isActive ? undefined : range.min,
                        priceMax: isActive ? undefined : range.max,
                      })
                    }
                    className={cn(
                      'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors',
                      isActive
                        ? 'bg-primary/10 font-semibold text-primary'
                        : 'text-foreground hover:bg-muted',
                    )}
                  >
                    <span>{range.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </AccordionItem>

        <AccordionItem value="sizes" trigger="Sizes">
          <div className="flex flex-wrap gap-2">
            {SIZES.map((size) => {
              const isActive = filters.sizes?.includes(size) ?? false;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() =>
                    onChange({ ...filters, sizes: toggleInArray(filters.sizes, size) })
                  }
                  aria-pressed={isActive}
                  className={cn(
                    'inline-flex h-9 min-w-[2.5rem] items-center justify-center rounded-md border px-2 text-xs font-semibold transition-colors',
                    isActive
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-foreground hover:bg-muted',
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </AccordionItem>

        <AccordionItem value="colors" trigger="Colors">
          <div className="flex flex-wrap gap-3">
            {COLORS.map((color) => {
              const isActive = filters.colors?.includes(color.name) ?? false;
              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() =>
                    onChange({ ...filters, colors: toggleInArray(filters.colors, color.name) })
                  }
                  aria-pressed={isActive}
                  aria-label={color.name}
                  title={color.name}
                  className={cn(
                    'inline-flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all',
                    isActive
                      ? 'border-primary ring-2 ring-primary/30 ring-offset-2 ring-offset-card'
                      : 'border-border hover:scale-105',
                  )}
                  style={{ backgroundColor: color.hex }}
                />
              );
            })}
          </div>
        </AccordionItem>

        <AccordionItem value="rating" trigger="Rating">
          <ul className="flex flex-col gap-1">
            {[4, 3, 2].map((rating) => {
              const isActive = filters.rating === rating;
              return (
                <li key={rating}>
                  <button
                    type="button"
                    onClick={() =>
                      onChange({ ...filters, rating: isActive ? undefined : rating })
                    }
                    className={cn(
                      'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors',
                      isActive
                        ? 'bg-primary/10 font-semibold text-primary'
                        : 'text-foreground hover:bg-muted',
                    )}
                  >
                    <span>{rating}+ stars</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </AccordionItem>
      </Accordion>

      <Button variant="outline" className="mt-5" onClick={onReset} disabled={activeCount === 0}>
        Reset filters
      </Button>
    </aside>
  );
}
