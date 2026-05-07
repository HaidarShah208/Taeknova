import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

import { RatingStars } from '@components/shared/RatingStars';
import { SectionWrapper } from '@components/shared/SectionWrapper';
import { Card } from '@components/ui/Card';

interface Testimonial {
  name: string;
  title: string;
  rating: number;
  body: string;
  avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Coach Maya R.',
    title: 'Head Coach, FC United',
    rating: 5,
    body:
      'Tikwando turned around custom kits for our entire club in under two weeks. The fabric is unmatched and the team has never looked sharper.',
    avatar: 'https://i.pravatar.cc/120?img=47',
  },
  {
    name: 'Jordan W.',
    title: 'Captain, Cobalt Cyclones',
    rating: 5,
    body:
      'These uniforms feel like nothing — until you sprint. Then you feel everything in the right places. We won three trophies in them last season.',
    avatar: 'https://i.pravatar.cc/120?img=11',
  },
  {
    name: 'Athletic Director — North Ridge',
    title: 'High School Athletics',
    rating: 4,
    body:
      'Professional, responsive, and the customization is best-in-class. We outfitted six teams across two seasons without a single quality issue.',
    avatar: 'https://i.pravatar.cc/120?img=15',
  },
];

export function TestimonialsSection() {
  return (
    <SectionWrapper
      tone="muted"
      eyebrow="What teams say"
      title="Worn by champions, recommended by coaches."
      description="A few words from teams who train, compete, and win in Tikwando."
      align="center"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {TESTIMONIALS.map((testimonial, idx) => (
          <motion.div
            key={testimonial.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
          >
            <Card
              variant="elevated"
              padding="lg"
              className="flex h-full flex-col gap-4 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <Quote className="h-8 w-8 text-primary/30" aria-hidden="true" />
                <RatingStars value={testimonial.rating} size="sm" />
              </div>
              <p className="text-sm leading-relaxed text-foreground sm:text-base">
                &ldquo;{testimonial.body}&rdquo;
              </p>
              <div className="mt-auto flex items-center gap-3 border-t border-border pt-4">
                <img
                  src={testimonial.avatar}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.title}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
