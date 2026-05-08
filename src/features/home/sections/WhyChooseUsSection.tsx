import { motion } from 'framer-motion';
import {
  Award,
  Factory,
  Layers,
  Printer,
  ShieldCheck,
  Wind,
} from 'lucide-react';

import { FeatureCard } from '@components/shared/FeatureCard';
import { SectionWrapper } from '@components/shared/SectionWrapper';

const FEATURES = [
  {
    icon: Layers,
    title: 'Premium fabric',
    description:
      'Performance-grade four-way stretch polyester engineered for elite athletic motion.',
  },
  {
    icon: Wind,
    title: 'Breathable construction',
    description:
      'Mesh ventilation panels and moisture-wicking weave that keeps athletes cool under pressure.',
  },
  {
    icon: ShieldCheck,
    title: 'Durable stitching',
    description:
      'Reinforced double-needle seams backed by our lifetime stitch warranty.',
  },
  {
    icon: Printer,
    title: 'Custom printing',
    description:
      'Sublimation, screen, embroidery — choose the technique that matches your design.',
  },
  {
    icon: Factory,
    title: 'Fast production',
    description:
      'Vertically integrated manufacturing means 14-day average turnaround on full team kits.',
  },
  {
    icon: Award,
    title: 'Trusted by champions',
    description:
      'From youth leagues to pro academies — over 25,000 teams outfitted across 30 countries.',
  },
];

export function WhyChooseUsSection() {
  return (
    <SectionWrapper
      tone="default"
      eyebrow="Why teams choose us"
      title="Built like premium gear should be."
      description="Every Tiknova uniform combines elite-level fabric science with an obsession for detail — so your team looks pro and plays better."
      align="center"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
          >
            <FeatureCard
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
