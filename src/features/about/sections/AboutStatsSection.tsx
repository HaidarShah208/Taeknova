import { motion } from 'framer-motion';

import { StatCard } from '@components/marketing/StatCard';
import { SectionWrapper } from '@components/shared/SectionWrapper';
import { ABOUT_STATS } from '@features/about/data';
import { staggerContainer, viewportOnce } from '@lib/motion';

export function AboutStatsSection() {
  return (
    <SectionWrapper
      tone="default"
      eyebrow="By the numbers"
      title="Impact that speaks for itself"
      description="Thousands of athletes step onto the mat in TAEKNOVA gear every season — here is the scale of that trust."
      align="center"
    >
      <motion.ul
        className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        {ABOUT_STATS.map((stat) => (
          <StatCard key={stat.label} icon={stat.icon} value={stat.value} label={stat.label} />
        ))}
      </motion.ul>
    </SectionWrapper>
  );
}
