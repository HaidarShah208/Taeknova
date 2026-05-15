import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@lib/cn';
import { fadeUp } from '@lib/motion';

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  href?: string;
  className?: string;
}

export function InfoCard({ icon: Icon, title, children, href, className }: InfoCardProps) {
  const content = (
    <>
      <span
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">{title}</h3>
      <motion.div className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</motion.div>
    </>
  );

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className={cn(
        'flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-elevated',
        className,
      )}
    >
      {href ? (
        <a href={href} className="flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
          {content}
        </a>
      ) : (
        content
      )}
    </motion.article>
  );
}
