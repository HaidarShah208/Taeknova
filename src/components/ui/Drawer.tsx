import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { useLockBodyScroll } from '@hooks/useLockBodyScroll';
import { cn } from '@lib/cn';

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  side?: DrawerSide;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hideCloseButton?: boolean;
  className?: string;
}

const sideClasses: Record<DrawerSide, string> = {
  left: 'inset-y-0 left-0 h-full',
  right: 'inset-y-0 right-0 h-full',
  top: 'inset-x-0 top-0 w-full',
  bottom: 'inset-x-0 bottom-0 w-full',
};

const sizeClasses: Record<NonNullable<DrawerProps['size']>, Record<'x' | 'y', string>> = {
  sm: { x: 'w-full max-w-xs', y: 'max-h-[40vh]' },
  md: { x: 'w-full max-w-sm', y: 'max-h-[55vh]' },
  lg: { x: 'w-full max-w-md', y: 'max-h-[70vh]' },
  xl: { x: 'w-full max-w-lg', y: 'max-h-[85vh]' },
};

const motionInitial: Record<DrawerSide, { x?: string; y?: string }> = {
  left: { x: '-100%' },
  right: { x: '100%' },
  top: { y: '-100%' },
  bottom: { y: '100%' },
};

export function Drawer({
  isOpen,
  onClose,
  side = 'right',
  title,
  description,
  children,
  footer,
  size = 'lg',
  hideCloseButton = false,
  className,
}: DrawerProps) {
  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (typeof document === 'undefined') return null;

  const isHorizontal = side === 'left' || side === 'right';

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="absolute inset-0 z-0 bg-foreground/40 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'drawer-title' : undefined}
            initial={motionInitial[side]}
            animate={{ x: 0, y: 0 }}
            exit={motionInitial[side]}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'absolute z-10 flex flex-col bg-card text-card-foreground shadow-elevated',
              sideClasses[side],
              isHorizontal ? sizeClasses[size].x : sizeClasses[size].y,
              className,
            )}
          >
            {(title || !hideCloseButton) && (
              <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                <div className="space-y-1">
                  {title && (
                    <h2 id="drawer-title" className="text-base font-semibold tracking-tight">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="text-xs text-muted-foreground">{description}</p>
                  )}
                </div>
                {!hideCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close drawer"
                    className="-m-1 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                )}
              </header>
            )}
            <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
            {footer && (
              <footer className="border-t border-border bg-muted/30 px-5 py-4">{footer}</footer>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
