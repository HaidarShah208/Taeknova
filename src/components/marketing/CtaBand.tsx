import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { buttonVariants } from '@components/ui/Button';
import { Container } from '@components/ui/Container';
import { easeOutExpo } from '@lib/motion';
import { cn } from '@lib/cn';

export interface CtaBandAction {
  label: string;
  to: string;
  variant?: 'primary' | 'outline';
}

export interface CtaBandProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions: CtaBandAction[];
  className?: string;
}

export function CtaBand({ eyebrow, title, description, actions, className }: CtaBandProps) {
  return (
    <section className={cn('py-16 sm:py-20 lg:py-24', className)}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-foreground via-[#1a2332] to-[#101A2F] px-6 py-12 text-background sm:px-10 sm:py-14 lg:px-14"
        >
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/30 blur-3xl"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <div className="relative max-w-2xl">
            {eyebrow && (
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-background/70">
                {eyebrow}
              </span>
            )}
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {title}
            </h2>
            {description && (
              <p className="mt-4 text-sm leading-relaxed text-background/75 sm:text-base">
                {description}
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              {actions.map((action, idx) => (
                <Link
                  key={action.to + action.label}
                  to={action.to}
                  className={cn(
                    buttonVariants({
                      size: 'lg',
                      variant: action.variant === 'outline' ? 'outline' : 'primary',
                    }),
                    idx === 0 && 'group',
                    action.variant === 'outline' &&
                      'border-background/40 text-background hover:bg-background/10',
                    idx === 0 &&
                      action.variant !== 'outline' &&
                      'text-foreground hover:bg-background/90',
                  )}
                >
                  {action.label}
                  {idx === 0 && action.variant !== 'outline' && (
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
