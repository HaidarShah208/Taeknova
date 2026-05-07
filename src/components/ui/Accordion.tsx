import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { cn } from '@lib/cn';

interface AccordionContextValue {
  openItems: Set<string>;
  toggle: (id: string) => void;
  type: 'single' | 'multiple';
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

const useAccordion = (): AccordionContextValue => {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('Accordion subcomponents must be used inside <Accordion>');
  return ctx;
};

interface AccordionProps {
  type?: 'single' | 'multiple';
  defaultOpen?: string[];
  children: ReactNode;
  className?: string;
}

export function Accordion({
  type = 'single',
  defaultOpen = [],
  children,
  className,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(() => new Set(defaultOpen));

  const toggle = useCallback(
    (id: string) => {
      setOpenItems((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          if (type === 'single') next.clear();
          next.add(id);
        }
        return next;
      });
    },
    [type],
  );

  const ctx = useMemo<AccordionContextValue>(() => ({ openItems, toggle, type }), [openItems, toggle, type]);

  return (
    <AccordionContext.Provider value={ctx}>
      <div className={cn('flex w-full flex-col divide-y divide-border', className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  value: string;
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
}

export function AccordionItem({ value, trigger, children, className }: AccordionItemProps) {
  const { openItems, toggle } = useAccordion();
  const isOpen = openItems.has(value);

  return (
    <div className={cn('py-2', className)}>
      <button
        type="button"
        onClick={() => toggle(value)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 py-3 text-left text-sm font-semibold text-foreground transition-colors hover:text-primary"
      >
        <span>{trigger}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
            isOpen && 'rotate-180 text-primary',
          )}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-3 pt-1 text-sm leading-relaxed text-muted-foreground">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
