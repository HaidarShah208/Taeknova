import { motion } from 'framer-motion';

import { SectionWrapper } from '@components/shared/SectionWrapper';
import { BRAND_NAME } from '@constants/company';
import { fadeUp, staggerContainer, viewportOnce } from '@lib/motion';
import fighting from '../../../assets/about/fighting.jpg';

const PILLARS = [
  {
    title: 'Mission',
    body: `Equip every martial artist with competition-grade apparel that elevates performance and honors the traditions of the sport.`,
  },
  {
    title: 'Vision',
    body: `Become the global standard for taekwondo and combat sports uniforms — trusted from local dojangs to international podiums.`,
  },
  {
    title: 'Passion',
    body: `We are practitioners, coaches, and makers who understand what it means to step on the mat — and we build gear that respects that journey.`,
  },
] as const;

export function BrandStorySection() {
  return (
    <SectionWrapper
      tone="default"
      eyebrow="Our story"
      title={`Who ${BRAND_NAME} is`}
      description="From a small team of designers and athletes to a global uniform partner — our commitment has never changed: deliver gear worthy of the discipline martial arts demands."
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
        <motion.div
          className="relative lg:col-span-5"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.55 }}
        >
          <motion.div
            className="overflow-hidden rounded-3xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
            <img
              src={fighting}
              alt="Martial artist in motion wearing TAEKNOVA kit"
              className="aspect-[4/5] w-full object-cover"
              loading="lazy"
            />
          </motion.div>
          <motion.div
            aria-hidden="true"
            className="absolute -bottom-4 -right-4 hidden h-32 w-32 rounded-full bg-primary/20 blur-2xl lg:block"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </motion.div>

        <motion.div
          className="flex flex-col gap-8 lg:col-span-7"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.p variants={fadeUp} className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            {BRAND_NAME} was founded on a simple belief: martial artists deserve uniforms as dedicated as they are.
            We combine performance textiles, athlete-informed patterning, and in-house customization so teams look
            unified and feel unstoppable — in training, at grading, and on the world stage.
          </motion.p>

          <motion.ul className="grid gap-4 sm:grid-cols-3" variants={staggerContainer}>
            {PILLARS.map((item) => (
              <motion.li
                key={item.title}
                variants={fadeUp}
                className="rounded-2xl border border-border bg-muted/30 p-5 transition-colors hover:border-primary/30 hover:bg-muted/50"
              >
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </motion.li>
            ))}
          </motion.ul>

          <motion.p variants={fadeUp} className="text-sm leading-relaxed text-muted-foreground">
            Every order is backed by responsive support, transparent production timelines, and quality control
            inspected by people who wear the gear themselves. That is our commitment to athletes — and to the
            coaches and academies who trust us with their identity.
          </motion.p>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
