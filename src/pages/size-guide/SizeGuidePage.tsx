import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Ruler, Shirt } from 'lucide-react';

import { PageHero } from '@components/marketing/PageHero';
import { PageMeta } from '@components/layout/PageMeta';
import { SectionWrapper } from '@components/shared/SectionWrapper';
import { buttonVariants } from '@components/ui/Button';
import { BRAND_NAME } from '@constants/company';
import { ROUTES } from '@constants/routes';
import {
  DOBOK_SIZE_CHART,
  FIT_TIPS,
  MEASUREMENT_STEPS,
} from '@features/size-guide/data';
import { fadeUp, staggerContainer, viewportOnce } from '@lib/motion';
import { cn } from '@lib/cn';
import uniform from '../../assets/uniform.png';

export default function SizeGuidePage() {
  return (
    <>
      <PageMeta
        title="Size Guide"
        description={`Find the right fit for ${BRAND_NAME} taekwondo uniforms and martial arts apparel. Measurement tips and size charts for athletes and teams.`}
      />

      <PageHero
        eyebrow="Size guide"
        title={
          <>
            Find your perfect
            <br />
            <span className="bg-gradient-to-r from-primary-300 via-primary-100 to-background bg-clip-text text-transparent">
              competition fit.
            </span>
          </>
        }
        description="Use our charts and measurement guide to order with confidence — for individual athletes or full academy squads."
        imageSrc={uniform}
        imageAlt="Athlete sizing guide"
        primaryCta={{ label: 'Shop uniforms', to: ROUTES.products }}
        secondaryCta={{ label: 'Contact for custom sizing', to: ROUTES.contact }}
      />

      <SectionWrapper
        tone="default"
        eyebrow="How to measure"
        title="Four measurements that matter"
        description="All measurements in centimetres (cm). Use a soft tape measure and keep it snug — not tight."
      >
        <motion.ol
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {MEASUREMENT_STEPS.map((step, idx) => (
            <motion.li
              key={step.title}
              variants={fadeUp}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Step {idx + 1}
              </span>
              <h3 className="mt-2 flex items-center gap-2 text-base font-semibold text-foreground">
                <Ruler className="h-4 w-4 text-primary" aria-hidden="true" />
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </motion.li>
          ))}
        </motion.ol>
      </SectionWrapper>

      <SectionWrapper
        tone="muted"
        eyebrow="Taekwondo dobok"
        title="Standard size chart"
        description="Match height and chest first, then confirm waist. Sizes follow common WT-style numbering."
        align="center"
      >
        <motion.div
          className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.45 }}
        >
          <motion.div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 font-semibold text-foreground">Size</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Height (cm)</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Chest (cm)</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Waist (cm)</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Typical fit</th>
                </tr>
              </thead>
              <tbody>
                {DOBOK_SIZE_CHART.map((row, idx) => (
                  <tr
                    key={row.size}
                    className={cn(
                      'border-b border-border/80 transition-colors hover:bg-muted/30',
                      idx % 2 === 1 && 'bg-muted/15',
                    )}
                  >
                    <td className="px-4 py-3 font-semibold text-foreground">{row.size}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.height}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.chest}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.waist}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.suitable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
          <p className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
            Measurements are approximate. Custom team orders can be adjusted per athlete — contact{' '}
            {BRAND_NAME} with your roster measurements.
          </p>
        </motion.div>
      </SectionWrapper>

      <SectionWrapper
        tone="default"
        eyebrow="Fit advice"
        title="Tips from our kit specialists"
        description="Get the most out of your uniform on the mat and at grading."
      >
        <motion.ul
          className="grid gap-3 sm:grid-cols-2"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {FIT_TIPS.map((tip) => (
            <motion.li
              key={tip}
              variants={fadeUp}
              className="flex gap-3 rounded-xl border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground"
            >
              <Shirt className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              {tip}
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          className="mt-10 flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
        >
          <Link to={ROUTES.products} className={cn(buttonVariants({ size: 'lg' }), 'bg-foreground group')}>
            Browse shop
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
          <Link to={ROUTES.contact} className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
            Request custom sizing
          </Link>
        </motion.div>
      </SectionWrapper>
    </>
  );
}
