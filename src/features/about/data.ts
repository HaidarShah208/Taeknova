import {
  Award,
  Layers,
  Palette,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';

export const ABOUT_WHY_CHOOSE = [
  {
    icon: Layers,
    title: 'Premium fabric',
    description:
      'Four-way stretch, moisture-wicking polyester blends engineered for explosive taekwondo movement and all-day comfort.',
  },
  {
    icon: ShieldCheck,
    title: 'Durable stitching',
    description:
      'Reinforced seams and bar-tack stress points built to survive intense training, competition, and repeat washes.',
  },
  {
    icon: Target,
    title: 'Athlete-focused design',
    description:
      'Cuts, gussets, and paneling shaped with martial artists — not generic sportswear patterns repurposed for the dojang.',
  },
  {
    icon: Palette,
    title: 'Customization support',
    description:
      'Team names, belt ranks, academy crests, and full sublimation — our studio guides you from brief to final kit.',
  },
  {
    icon: Award,
    title: 'Professional quality',
    description:
      'Competition-ready finishes trusted by academies, national squads, and combat sports programs worldwide.',
  },
] as const;

export const ABOUT_STATS = [
  { icon: Sparkles, value: '50k+', label: 'Uniforms delivered' },
  { icon: Users, value: '2,400+', label: 'Teams supported' },
  { icon: Award, value: '98%', label: 'Satisfied athletes' },
  { icon: Target, value: '30+', label: 'Countries served' },
] as const;

export const ABOUT_VALUES = [
  {
    title: 'Discipline',
    description: 'Precision in every stitch — because champions are built through consistent effort.',
  },
  {
    title: 'Strength',
    description: 'Gear that holds up under pressure so athletes can focus on power, not wardrobe failure.',
  },
  {
    title: 'Confidence',
    description: 'When your team looks elite, they carry themselves like it from first bow to final bell.',
  },
  {
    title: 'Performance',
    description: 'Breathable, flexible fabrics that move with kicks, spins, and explosive footwork.',
  },
  {
    title: 'Dedication',
    description: 'We stand behind every order with responsive support and a lifetime stitch warranty.',
  },
] as const;

export const ABOUT_COMMUNITY = [
  {
    name: 'Seoul Tigers Academy',
    category: 'Taekwondo · National program',
    description: 'Full competition doboks and training kits for 180 athletes across three belt divisions.',
    image: 'https://picsum.photos/seed/taeknova-tkd-1/900/700',
  },
  {
    name: 'Pacific Strike Dojang',
    category: 'Martial arts · Regional',
    description: 'Custom sublimated uniforms with academy crest and sponsor panels.',
    image: 'https://picsum.photos/seed/taeknova-tkd-2/900/700',
  },
  {
    name: 'Iron Fist Combat Club',
    category: 'Combat sports · Club',
    description: 'Training apparel and fight-week kits for amateur and pro fighters.',
    image: 'https://picsum.photos/seed/taeknova-tkd-3/900/700',
  },
] as const;
