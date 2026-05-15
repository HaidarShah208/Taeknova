import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@lib/cn';
import { fadeUp } from '@lib/motion';

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  className?: string;
}

export function StatCard({ icon: Icon, value, label, className }: StatCardProps) {
  return (
    <motion.li
      variants={fadeUp}
      className={cn(
        'rounded-2xl border border-border bg-card px-5 py-6 text-center sm:px-6 sm:py-8',
        className,
      )}
    >
      <span
        className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {value}
      </p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </motion.li>
  );
}
