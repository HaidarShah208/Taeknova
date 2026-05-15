import { motion } from 'framer-motion';

import { SectionWrapper } from '@components/shared/SectionWrapper';
import { ABOUT_VALUES } from '@features/about/data';
import { fadeUp, staggerContainer, viewportOnce } from '@lib/motion';
import { cn } from '@lib/cn';

export function AboutValuesSection() {
  return (
    <SectionWrapper
      tone="muted"
      eyebrow="Our values"
      title="The principles behind every uniform"
      description="TAEKNOVA is more than apparel — it is a commitment to the mindset martial arts instills."
      align="center"
    >
      <motion.ul
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        {ABOUT_VALUES.map((value, idx) => (
          <motion.li
            key={value.title}
            variants={fadeUp}
            whileHover={{ y: -4 }}
            className={cn(
              'rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-elevated',
              idx === ABOUT_VALUES.length - 1 && 'sm:col-span-2 lg:col-span-1',
            )}
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              0{idx + 1}
            </span>
            <h3 className="mt-3 text-xl font-bold tracking-tight text-foreground">{value.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value.description}</p>
          </motion.li>
        ))}
      </motion.ul>
    </SectionWrapper>
  );
}
