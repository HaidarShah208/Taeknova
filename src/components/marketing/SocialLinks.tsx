import { motion } from 'framer-motion';
import { Facebook, Instagram, Youtube } from 'lucide-react';

import { SOCIAL_LINKS } from '@constants/company';
import { cn } from '@lib/cn';
import { fadeUp, staggerContainer } from '@lib/motion';

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  );
}

const ICONS = {
  instagram: Instagram,
  facebook: Facebook,
  tiktok: TikTokIcon,
  youtube: Youtube,
} as const;

interface SocialLinksProps {
  className?: string;
  size?: 'sm' | 'md';
}

export function SocialLinks({ className, size = 'md' }: SocialLinksProps) {
  const dim = size === 'sm' ? 'h-9 w-9' : 'h-11 w-11';
  const iconDim = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <motion.ul
      className={cn('flex flex-wrap items-center gap-3', className)}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
    >
      {SOCIAL_LINKS.map((item) => {
        const Icon = ICONS[item.network];
        return (
          <motion.li key={item.network} variants={fadeUp}>
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={item.label}
              className={cn(
                'inline-flex items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:border-primary hover:bg-primary/5 hover:text-primary',
                dim,
              )}
            >
              <Icon className={iconDim} />
            </a>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
