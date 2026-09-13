import { Check } from 'lucide-react';
import { Fragment } from 'react';

import { cn } from '@lib/cn';

const STEPS = [
  { label: 'Order placed', hint: 'Checkout complete' },
  { label: 'Approved', hint: 'Store accepted your order' },
  { label: 'On the way', hint: 'Shipped to you' },
  { label: 'Delivered', hint: 'Arrived' },
] as const;

function lastCompletedStepIndex(status: string): number {
  if (status === 'CANCELLED') return -1;
  if (status === 'PENDING') return 0;
  if (status === 'CONFIRMED' || status === 'PROCESSING') return 1;
  if (status === 'SHIPPED') return 2;
  if (status === 'DELIVERED') return 3;
  return 0;
}

export function OrderTrackingTimeline({ status }: { status: string }) {
  if (status === 'CANCELLED') {
    return (
      <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm font-medium text-destructive">
        This order was cancelled. If you were charged, contact support.
      </p>
    );
  }

  const lastDone = lastCompletedStepIndex(status);

  return (
    <div className="overflow-x-auto pb-1 pt-1">
      <div className="min-w-[480px] space-y-3">
        <div className="flex items-center px-1">
          {STEPS.map((step, i) => {
            const complete = i <= lastDone;
            const current = !complete && i === lastDone + 1;
            return (
              <Fragment key={step.label}>
                {i > 0 ? (
                  <div
                    className={cn(
                      'h-0.5 min-w-[8px] flex-1',
                      lastDone >= i ? 'bg-primary' : 'bg-border',
                    )}
                    aria-hidden
                  />
                ) : null}
                <div
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors',
                    complete && 'border-primary bg-primary text-primary-foreground',
                    current && 'border-primary bg-background text-primary ring-2 ring-primary/30',
                    !complete && !current && 'border-muted-foreground/25 bg-muted/40 text-muted-foreground',
                  )}
                >
                  {complete ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
                </div>
              </Fragment>
            );
          })}
        </div>
        <div className="flex justify-between gap-1 px-0.5 text-center">
          {STEPS.map((step, i) => {
            const complete = i <= lastDone;
            const current = !complete && i === lastDone + 1;
            return (
              <div key={`${step.label}-lbl`} className="min-w-0 flex-1 px-0.5">
                <p
                  className={cn(
                    'text-[11px] font-semibold leading-tight sm:text-xs',
                    complete || current ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {step.label}
                </p>
                <p className="mt-0.5 hidden text-[10px] text-muted-foreground sm:line-clamp-2">{step.hint}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
