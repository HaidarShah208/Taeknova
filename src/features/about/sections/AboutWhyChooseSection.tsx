import { motion } from 'framer-motion';

import { FeatureCard } from '@components/shared/FeatureCard';
import { SectionWrapper } from '@components/shared/SectionWrapper';
import { ABOUT_WHY_CHOOSE } from '@features/about/data';
import { staggerContainer, viewportOnce } from '@lib/motion';

export function AboutWhyChooseSection() {
  return (
    <SectionWrapper
      tone="muted"
      className="relative overflow-hidden bg-gradient-to-br from-[#393528]/20 via-background to-[#101A2F]/15"
      eyebrow="Why choose us"
      title="Quality you can feel on the mat"
      description="Every detail — from fabric selection to final inspection — is built for martial artists who refuse to compromise."
      align="center"
    >
      <motion.div
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        {ABOUT_WHY_CHOOSE.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className={idx === ABOUT_WHY_CHOOSE.length - 1 ? 'sm:col-span-2 lg:col-span-1' : undefined}
          >
            <FeatureCard
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              className="h-full"
            />
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
