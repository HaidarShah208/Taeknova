import { Check } from 'lucide-react';
import { useMemo } from 'react';

import { Accordion, AccordionItem } from '@components/ui/Accordion';
import { Button } from '@components/ui/Button';
import { cn } from '@lib/cn';
import type { Category, ProductFilters } from '@app-types/product';
import { CATALOG_COLOR_OPTIONS, CATALOG_SIZES } from '@constants/catalogFilters';

/** Slider snaps to PKR 0, 500, 1000, … */
const PRICE_STEP = 500;
const MIN_PRICE = 0;
/** Default upper bound before catalog prices are known */
const DEFAULT_PRICE_SLIDER_MAX = 10_000;

interface FilterSidebarProps {
  filters: ProductFilters;
  onChange: (next: ProductFilters) => void;
  onReset: () => void;
  categories: Category[];
  /** Max value for the price slider (PKR); parent should grow this from loaded product prices */
  priceSliderMax?: number;
  className?: string;
  /** When the page is under `/categories/:slug`, choosing "All categories" runs this (e.g. navigate to `/products`). */
  onExitCategoryRoute?: () => void;
}

const snapToPriceStep = (n: number): number =>
  Math.round(Math.max(0, n) / PRICE_STEP) * PRICE_STEP;

export function FilterSidebar({
  filters,
  onChange,
  onReset,
  categories,
  priceSliderMax: priceSliderMaxProp,
  className,
  onExitCategoryRoute,
}: FilterSidebarProps) {
  const sliderMax = Math.max(PRICE_STEP, priceSliderMaxProp ?? DEFAULT_PRICE_SLIDER_MAX);

  const rangeValue = useMemo(() => {
    if (filters.priceMax === undefined) return sliderMax;
    return Math.min(snapToPriceStep(filters.priceMax), sliderMax);
  }, [filters.priceMax, sliderMax]);

  const updatePrice = (nextMax: number): void => {
    const snapped = snapToPriceStep(nextMax);
    const clamped = Math.min(Math.max(MIN_PRICE, snapped), sliderMax);
    onChange({
      ...filters,
      priceMin: undefined,
      priceMax: clamped >= sliderMax ? undefined : clamped,
    });
  };

  const activeCount = useMemo(() => {
    let n = 0;
    if (filters.categories?.length) n += 1;
    if (filters.sizes?.length) n += filters.sizes.length;
    if (filters.colors?.length) n += filters.colors.length;
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) n += 1;
    if (filters.rating) n += 1;
    return n;
  }, [filters]);

  const selectedPriceSummary =
    filters.priceMax === undefined ? 'No max' : `Up to PKR ${rangeValue.toLocaleString()}`;

  return (
    <aside
      className={cn(
        'flex h-full w-full border-gray-300 flex-col rounded-2xl border bg-card p-5',
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
          <ul className="flex flex-col gap-2" role="radiogroup" aria-label="Category">
            <li>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-foreground">
                <input
                  type="radio"
                  name="filter-category"
                  checked={!filters.categories?.length}
                  onChange={() => {
                    onChange({ ...filters, categories: undefined });
                    onExitCategoryRoute?.();
                  }}
                  className="h-4 w-4 border-input text-primary focus:ring-ring"
                />
                <span className="flex-1">All categories</span>
              </label>
            </li>
            {categories.map((category) => {
              const selected = filters.categories?.[0] === category.slug;
              return (
                <li key={category.id}>
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-foreground">
                    <input
                      type="radio"
                      name="filter-category"
                      checked={selected}
                      onChange={() =>
                        onChange({
                          ...filters,
                          categories: [category.slug],
                        })
                      }
                      className="h-4 w-4 border-input text-primary focus:ring-ring"
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
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Max Price (PKR)</span>
                <span className="rounded-full border border-border bg-background px-2 py-0.5 text-foreground">
                  {filters.priceMax === undefined ? `${sliderMax.toLocaleString()}+` : rangeValue.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={MIN_PRICE}
                max={sliderMax}
                step={PRICE_STEP}
                value={rangeValue}
                onChange={(event) => updatePrice(Number(event.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-primary/20 accent-primary"
                aria-label="Maximum price range"
              />
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>PKR {MIN_PRICE}</span>
                <span>PKR {sliderMax.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">Selected: {selectedPriceSummary}</p>
          </div>
        </AccordionItem>

        <AccordionItem value="sizes" trigger="Sizes">
          <div className="flex flex-wrap gap-2">
            {CATALOG_SIZES.map((size) => {
              const isActive = filters.sizes?.[0] === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    const next = isActive ? undefined : [size];
                    onChange({ ...filters, sizes: next });
                  }}
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
            {CATALOG_COLOR_OPTIONS.map((color) => {
              const isActive = filters.colors?.includes(color.name) ?? false;
              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => {
                    const next = filters.colors?.[0] === color.name ? undefined : [color.name];
                    onChange({ ...filters, colors: next });
                  }}
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
                >
                  {isActive && <Check className="h-4 w-4 text-white drop-shadow" />}
                </button>
              );
            })}
          </div>
        </AccordionItem>
      </Accordion>

      <Button variant="outline" className="mt-5" onClick={onReset} disabled={activeCount === 0}>
        Reset filters
      </Button>
    </aside>
  );
}
