import { cva, type VariantProps } from 'class-variance-authority';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef, type ReactNode } from 'react';

import { Container } from '@components/ui/Container';
import { SectionHeading } from '@components/ui/SectionHeading';
import { cn } from '@lib/cn';

export const sectionVariants = cva('w-full', {
  variants: {
    tone: {
      default: 'bg-background text-foreground',
      muted: 'bg-muted/30 text-foreground',
      dark: 'bg-foreground text-background',
      primary: 'bg-primary text-primary-foreground',
    },
    spacing: {
      sm: 'py-12 sm:py-14',
      md: 'py-16 sm:py-20 lg:py-24',
      lg: 'py-20 sm:py-24 lg:py-32',
    },
  },
  defaultVariants: {
    tone: 'default',
    spacing: 'md',
  },
});

interface SectionWrapperProps
  extends Omit<HTMLMotionProps<'section'>, 'title'>,
    VariantProps<typeof sectionVariants> {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  action?: ReactNode;
  headingAs?: 'h1' | 'h2' | 'h3';
  containerClassName?: string;
  children: ReactNode;
}

export const SectionWrapper = forwardRef<HTMLElement, SectionWrapperProps>(function SectionWrapper(
  {
    tone,
    spacing,
    eyebrow,
    title,
    description,
    align = 'left',
    action,
    headingAs = 'h2',
    className,
    containerClassName,
    children,
    ...props
  },
  ref,
) {
  const hasHeading = !!title || !!eyebrow || !!description;

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(sectionVariants({ tone, spacing }), className)}
      {...props}
    >
      <Container className={containerClassName}>
        {hasHeading && (
          <SectionHeading
            {...(eyebrow !== undefined ? { eyebrow } : {})}
            title={title ?? ''}
            {...(description !== undefined ? { description } : {})}
            align={align}
            {...(action !== undefined ? { action } : {})}
            as={headingAs}
            className="mb-10 sm:mb-12 lg:mb-14"
          />
        )}
        {children}
      </Container>
    </motion.section>
  );
});
