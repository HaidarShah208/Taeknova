import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Factory,
  Palette,
  Pencil,
  Truck,
} from 'lucide-react';

import { SectionWrapper } from '@components/shared/SectionWrapper';
import { StepCard } from '@components/shared/StepCard';

const STEPS = [
  {
    icon: Pencil,
    title: 'Choose a design',
    description:
      'Browse the catalog or share a brief — our designers will translate it into a digital mockup.',
  },
  {
    icon: Palette,
    title: 'Customize',
    description:
      'Pick fabric, colors, badges, names and numbers in our visual customizer or with a stylist.',
  },
  {
    icon: CheckCircle2,
    title: 'Confirm order',
    description:
      'Approve final renders, secure payment, and lock the production timeline for your team.',
  },
  {
    icon: Factory,
    title: 'Production',
    description:
      'Patterned, printed, stitched, and quality-checked across our vertically integrated facility.',
  },
  {
    icon: Truck,
    title: 'Delivery',
    description:
      'Tracked global shipping with average doorstep arrival in 14 days from order confirmation.',
  },
];

export function ProcessSection() {
  return (
    <SectionWrapper
      tone="muted"
      eyebrow="How it works"
      title="From concept to game day in five steps."
      description="A streamlined process designed around teams, coaches, and athletic directors — predictable, transparent, and fast."
      align="center"
    >
      <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block"
        />
        {STEPS.map((step, idx) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="relative"
          >
            <StepCard
              index={idx + 1}
              icon={step.icon}
              title={step.title}
              description={step.description}
            />
          </motion.div>
        ))}
      </div>

       
    </SectionWrapper>
  );
}
