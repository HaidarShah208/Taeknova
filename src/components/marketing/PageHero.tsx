import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { buttonVariants } from '@components/ui/Button';
import { Container } from '@components/ui/Container';
import { easeOutExpo } from '@lib/motion';
import { cn } from '@lib/cn';

export interface PageHeroCta {
  label: string;
  to: string;
  variant?: 'primary' | 'outline';
}

export interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  imageSrc: string;
  imageAlt?: string;
  primaryCta?: PageHeroCta;
  secondaryCta?: PageHeroCta;
  className?: string;
}

export function PageHero({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt = '',
  primaryCta,
  secondaryCta,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden bg-foreground text-background',
        className,
      )}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: easeOutExpo }}
        aria-hidden="true"
      >
        <img src={imageSrc} alt="" className="h-full w-full object-cover" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        <div className="absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-primary/25 blur-3xl" />
        <motion.div
          className="absolute right-0 top-0 h-72 w-72 rounded-full bg-accent/15 blur-3xl"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <Container className="relative z-10 py-20 sm:py-24 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="max-w-3xl"
        >
          {eyebrow && (
            <span className="inline-flex items-center rounded-full border border-background/25 bg-background/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-background/85 backdrop-blur">
              {eyebrow}
            </span>
          )}
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-background/80 sm:text-lg">
              {description}
            </p>
          )}
          {(primaryCta || secondaryCta) && (
            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: easeOutExpo }}
            >
              {primaryCta && (
                <Link
                  to={primaryCta.to}
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'group text-foreground hover:bg-background/90',
                  )}
                >
                  {primaryCta.label}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              )}
              {secondaryCta && (
                <Link
                  to={secondaryCta.to}
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'lg' }),
                    'border-background/40 text-background hover:bg-background/10',
                  )}
                >
                  {secondaryCta.label}
                </Link>
              )}
            </motion.div>
          )}
        </motion.div>
      </Container>

      {imageAlt ? (
        <span className="sr-only">{imageAlt}</span>
      ) : null}
    </section>
  );
}
