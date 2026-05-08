import { motion } from 'framer-motion';
import { ArrowRight, Brush, Palette, Type, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

import { buttonVariants } from '@components/ui/Button';
import { SectionWrapper } from '@components/shared/SectionWrapper';
import { ROUTES } from '@constants/routes';
import { cn } from '@lib/cn';

const FEATURES = [
  {
    icon: Upload,
    title: 'Upload your logo',
    description: 'Drop in your team crest in any format — we handle the prep.',
  },
  {
    icon: Palette,
    title: 'Pick your colors',
    description: 'Match your team palette with our 80+ shade library.',
  },
  {
    icon: Type,
    title: 'Names & numbers',
    description: 'Heat-pressed or stitched — every player customized.',
  },
  {
    icon: Brush,
    title: 'Full team branding',
    description: 'Patterns, sponsor logos, captain bands — make it yours.',
  },
];

export function CustomUniformsSection() {
  return (
    <SectionWrapper
      tone="muted"
      eyebrow="Custom uniforms"
      title="Designed by you. Built by Tiknova."
      description="From local clubs to pro programs, we turn your concept into ready-to-play uniforms with white-glove customization end to end."
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative lg:col-span-6"
        >
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-card">
            <img
              src="https://picsum.photos/seed/tikwando-custom/1100/900"
              alt="Designer customizing a Tiknova uniform"
              loading="lazy"
              className="aspect-[5/4] w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-foreground/40 via-transparent to-transparent" />
            <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-background/95 px-3 py-1.5 text-xs font-semibold text-foreground shadow-soft backdrop-blur">
              <span className="inline-block h-2 w-2 rounded-full bg-success" aria-hidden="true" />
              Live design studio
            </div>
            <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-3">
              {[
                ['80+', 'Color swatches'],
                ['14d', 'Avg. lead time'],
                ['25k+', 'Teams outfitted'],
              ].map(([stat, label]) => (
                <div
                  key={label}
                  className="rounded-xl border border-background/20 bg-foreground/80 px-3 py-2 text-background backdrop-blur"
                >
                  <p className="font-display text-lg font-bold leading-none">{stat}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-background/70">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div
            aria-hidden="true"
            className="absolute -bottom-6 -right-6 -z-10 h-48 w-48 rounded-full bg-primary/15 blur-3xl"
          />
        </motion.div>

        <div className="lg:col-span-6">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FEATURES.map((feature, idx) => (
              <motion.li
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated"
              >
                <span
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110"
                  aria-hidden="true"
                >
                  <feature.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 text-base font-semibold tracking-tight">{feature.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to={`${ROUTES.products}?sort=new`}
              className={cn(buttonVariants({ size: 'lg' }), 'group')}
            >
              Start a custom order
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
            <Link
              to="/contact"
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
            >
              Talk to a stylist
            </Link>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            No minimums on initial samples. Bulk pricing kicks in at 10+ pieces.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
