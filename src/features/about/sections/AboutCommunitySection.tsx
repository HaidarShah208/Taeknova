import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

import { SectionWrapper } from '@components/shared/SectionWrapper';
import { Badge } from '@components/ui/Badge';
import { ABOUT_COMMUNITY } from '@features/about/data';
import { fadeUp, staggerContainer, viewportOnce } from '@lib/motion';

export function AboutCommunitySection() {
  return (
    <SectionWrapper
      tone="dark"
      eyebrow="Community"
      title="Trusted by academies worldwide"
      description="From grassroots dojangs to elite training camps — teams choose TAEKNOVA when presentation and performance both matter."
    >
      <motion.div
        className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        {ABOUT_COMMUNITY.map((team, idx) => (
          <motion.article
            key={team.name}
            variants={fadeUp}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className={idx === 0 ? 'md:col-span-2 lg:col-span-1 lg:row-span-1' : undefined}
          >
            <motion.div className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-background/10 md:aspect-[3/4]">
              <img
                src={team.image}
                alt={team.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/40 to-transparent" />
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                <motion.div>
                  <Badge variant="secondary" className="mb-2 bg-background/20 text-background backdrop-blur">
                    {team.category}
                  </Badge>
                  <h3 className="text-lg font-bold text-white">{team.name}</h3>
                  <p className="mt-1 text-sm text-background/75">{team.description}</p>
                </motion.div>
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
            </motion.div>
          </motion.article>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
