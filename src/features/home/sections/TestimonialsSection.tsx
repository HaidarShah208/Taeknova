import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { RatingStars } from '@components/shared/RatingStars';
import { SectionWrapper } from '@components/shared/SectionWrapper';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import hassan from '../../../assets/testimonials/ali_hassan_gcj36e.webp';
import noor from '../../../assets/testimonials/6_j0ale0.webp';
import zainab from '../../../assets/testimonials/noor_c0tekc.webp';
import l40u4g from '../../../assets/testimonials/7_l40u4g.webp';
import raza from '../../../assets/testimonials/sir_ali_raza_drltwp.webp';

interface Testimonial {
  name: string;
  title: string;
  rating: number;
  body: string;
  avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Ali Hassan',
    title: 'Head Coach, FC United',
    rating: 5,
    body:
      'Tiknova turned around custom kits for our entire club in under two weeks. The fabric is unmatched and the team has never looked sharper.',
    avatar: hassan,
  },
  {
    name: 'Ali Raza',
    title: 'Captain, Cobalt Cyclones',
    rating: 5,
    body:
      'These uniforms feel like nothing — until you sprint. Then you feel everything in the right places. We won three trophies in them last season.',
    avatar: raza,
  },
  {
    name: 'Noor',
    title: 'Athletics Coordinator · Riverside Academy',
    rating: 4,
    body:
      'Professional, responsive, and the customization is best-in-class. We outfitted six teams across two seasons without a single quality issue.',
    avatar: noor,
  },
  {
    name: 'Ahmad',
    title: 'Parent & booster club · Youth academy',
    rating: 4,
    body:
      "Superb stitching quality and premium fabric. My son won't wear any other uniform now!.",
    avatar: l40u4g,
  },
  {
    name: 'Zanaib',
    title: 'Returning customer · City league soccer',
    rating: 5,
    body:
      "Absolutely loved the quality! I wasn't expecting such premium stitching. Will definitely order again.",
    avatar: zainab,
  },
];

const VISIBLE = 3;

const cardTransition = { duration: 0.42, ease: [0.25, 0.1, 0.25, 1] as const };

const cardVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 56 : -56,
    opacity: 0,
    filter: 'blur(4px)',
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -56 : 56,
    opacity: 0,
    filter: 'blur(4px)',
  }),
};

export function TestimonialsSection() {
  const n = TESTIMONIALS.length;
  const [start, setStart] = useState(0);
  const [direction, setDirection] = useState(0);

  const visible = useMemo(() => {
    const out: Testimonial[] = [];
    for (let i = 0; i < VISIBLE; i++) {
      out.push(TESTIMONIALS[(start + i) % n]!);
    }
    return out;
  }, [start, n]);


  const goNext = useCallback(() => {
    setDirection(1);
    setStart((s) => (s + 1) % n);
  }, [n]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setStart((s) => (s - 1 + n) % n);
  }, [n]);

  return (
    <SectionWrapper
      tone="muted"
      eyebrow="What teams say"
      title="Worn by champions, recommended by coaches."
      description="A few words from teams who train, compete, and win in Tiknova."
      align="center"
    >
      <div className="relative mx-auto max-w-full px-10 sm:px-12">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Previous testimonials"
          className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 rounded-full border-border bg-card shadow-soft sm:flex"
          onClick={goPrev}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Next testimonials"
          className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 rounded-full border-border bg-card shadow-soft sm:flex"
          onClick={goNext}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        <div className="mb-4 flex justify-center gap-2 sm:hidden">
          <Button type="button" variant="outline" size="sm" onClick={goPrev} aria-label="Previous">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={goNext} aria-label="Next">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="overflow-hidden pb-1">
          <ul className="relative grid min-h-[280px] gap-6 md:min-h-[260px] md:grid-cols-3" role="list">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              {visible.map((testimonial) => (
                <motion.li
                  key={testimonial.name}
                  layout
                  custom={direction}
                  variants={cardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={cardTransition}
                  className="min-h-0"
                >
                  <Card
                    variant="elevated"
                    padding="lg"
                    className="flex h-full min-h-[260px] flex-col gap-4 transition-shadow duration-300 hover:-translate-y-0.5 hover:shadow-elevated md:min-h-[280px]"
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
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>

        
      </div>
    </SectionWrapper>
  );
}
