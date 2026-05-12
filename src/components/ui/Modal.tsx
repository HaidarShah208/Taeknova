import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { useLockBodyScroll } from '@hooks/useLockBodyScroll';
import { cn } from '@lib/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
  hideCloseButton?: boolean;
  className?: string;
}

const sizeMap: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'xl',
  closeOnOverlay = true,
  closeOnEscape = true,
  hideCloseButton = false,
  className,
}: ModalProps) {
  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, closeOnEscape, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => closeOnOverlay && onClose()}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            aria-describedby={description ? 'modal-description' : undefined}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'relative z-10 w-full overflow-hidden rounded-2xl bg-card text-card-foreground shadow-elevated',
              sizeMap[size],
              className,
            )}
          >
            {(title || !hideCloseButton) && (
              <header className="flex items-start justify-between gap-3 px-6 py-4">
                <div className="space-y-1">
                  {title && (
                    <h2 id="modal-title" className="text-lg font-semibold tracking-tight">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p id="modal-description" className="text-sm text-muted-foreground">
                      {description}
                    </p>
                  )}
                </div>
                {!hideCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close modal"
                    className="-m-1 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                )}
              </header>
            )}
            <div className="px-6 py-5">{children}</div>
            {footer && (
              <footer className="flex items-center justify-end gap-2   bg-muted/30 px-6 py-4">
                {footer}
              </footer>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
