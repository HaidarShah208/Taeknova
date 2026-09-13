import { motion } from 'framer-motion';
import { Badge } from '@components/ui/Badge';
import { SectionWrapper } from '@components/shared/SectionWrapper';
import hassan from '../../../assets/team/hassan.jpeg'
import abdulwahab from '../../../assets/team/abdulwahab.jpeg'
import teamMember from '../../../assets/team/teamMember.jpeg'
import teamNew from '../../../assets/team/teamNew.jpeg'
import group from '../../../assets/team/group.png'
import { cn } from '@lib/cn';

interface ShowcaseTeam {
  name: string;
  category: string;
  description: string;
  image: string;
  span: string;
}

const TEAMS: ShowcaseTeam[] = [
  {
    name: 'Ali Hassan Shah',
    category: 'Soccer · Premier club',
    description: 'Custom kits and training wear for a 240-player academy.',
    image: group,
    span: 'lg:col-span-7 lg:row-span-2',
  },
  {
    name: 'Cobalt Cyclones',
    category: 'Basketball · Pro league',
    description: 'Sublimated jerseys with embroidered crests.',
    image: hassan,
    span: 'lg:col-span-5',
  },
  {
    name: 'North Ridge Athletics',
    category: 'Multi-sport · School',
    description: 'Outfitted six teams across two seasons.',
    image:abdulwahab,
    span: 'lg:col-span-5',
  },
  {
    name: 'Apex Elite Volleyball',
    category: 'Volleyball · Club',
    description: 'Pattern-matched home and away kits.',
    image: teamMember,
    span: 'lg:col-span-4',
  },
  {
    name: 'Kingsmen Rugby',
    category: 'Rugby · University',
    description: 'Heavy-duty jerseys built for impact.',
    image:  teamNew,
    span: 'lg:col-span-4',
  },
  {
    name: 'Riverside Strikers',
    category: 'Cricket · Regional',
    description: 'Lightweight whites with custom sublimation.',
    image: 'https://picsum.photos/seed/tikwando-team-6/900/600',
    span: 'lg:col-span-4',
  },
];

export function TeamShowcaseSection() {
  return (
    <SectionWrapper
      tone="default"
      className="bg-gradient-to-br from-white via-[#eef2f9] to-[#0F1729]/42"
      eyebrow="Worn by champions"
      title="Teams that win in Tiknova."
      description="A glimpse at programs, clubs, and pro outfits already running on Tiknova-built gear."
     
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[16rem] lg:grid-cols-12">
        {TEAMS.map((team, idx) => (
          <motion.article
            key={team.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className={cn(
              'group relative overflow-hidden rounded-2xl border border-white/40 bg-white/50 shadow-soft backdrop-blur',
              team.span,
            )}
          >
            <img
              src={team.image}
              alt={team.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/30 to-transparent" />
            <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
              <div>
                <Badge variant="outline" className="border-background/30 text-background/90">
                  {team.category}
                </Badge>
                <h3 className="mt-3 text-lg font-bold leading-tight tracking-tight text-background sm:text-xl">
                  {team.name}
                </h3>
              </div>
              
            </div>
          </motion.article>
        ))}
      </div>
    </SectionWrapper>
  );
}
