import { motion } from 'framer-motion';
import { Heart, Instagram, MessageCircle } from 'lucide-react';

import { SectionWrapper } from '@components/shared/SectionWrapper';
import { cn } from '@lib/cn';

interface SocialPost {
  image: string;
  caption: string;
  likes: number;
  comments: number;
  span?: string;
}

const POSTS: SocialPost[] = [
  {
    image: 'https://picsum.photos/seed/tikwando-ig-1/900/900',
    caption: 'Match-day fits with @fcaurorautd',
    likes: 1240,
    comments: 28,
    span: 'sm:row-span-2',
  },
  {
    image: 'https://picsum.photos/seed/tikwando-ig-2/900/600',
    caption: 'Behind the scenes at our pattern studio',
    likes: 842,
    comments: 14,
  },
  {
    image: 'https://picsum.photos/seed/tikwando-ig-3/900/600',
    caption: 'New training capsule — drops Friday',
    likes: 1583,
    comments: 41,
  },
  {
    image: 'https://picsum.photos/seed/tikwando-ig-4/900/900',
    caption: 'Champions unboxing fresh kits',
    likes: 968,
    comments: 22,
    span: 'sm:row-span-2',
  },
  {
    image: 'https://picsum.photos/seed/tikwando-ig-5/900/600',
    caption: 'Custom embroidery process — start to finish',
    likes: 1102,
    comments: 33,
  },
  {
    image: 'https://picsum.photos/seed/tikwando-ig-6/900/600',
    caption: 'Game-winners wearing Tiknova',
    likes: 2014,
    comments: 56,
  },
];

const formatCount = (n: number): string =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(n);

export function SocialGallerySection() {
  return (
    <SectionWrapper
      tone="default"
      eyebrow="@tikwando"
      title="Tag us. We share the best."
      description="A look at the teams, locker rooms, and tunnels where Tiknova shows up. Follow along — your kit might be next."
      action={
        <a
          href="https://instagram.com/tikwando"
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <Instagram className="h-4 w-4" aria-hidden="true" />
          Follow on Instagram
        </a>
      }
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {POSTS.map((post, idx) => (
          <motion.a
            key={post.image}
            href="https://instagram.com/tikwando"
            target="_blank"
            rel="noreferrer noopener"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className={cn(
              'group relative aspect-square overflow-hidden rounded-2xl bg-muted',
              post.span,
            )}
          >
            <img
              src={post.image}
              alt={post.caption}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute inset-x-3 bottom-3 translate-y-2 text-background opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <p className="line-clamp-2 text-xs font-medium leading-snug">{post.caption}</p>
              <div className="mt-2 flex items-center gap-3 text-[11px] font-semibold">
                <span className="inline-flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5" aria-hidden="true" />
                  {formatCount(post.likes)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  {formatCount(post.comments)}
                </span>
              </div>
            </div>
            <span
              aria-hidden="true"
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100"
            >
              <Instagram className="h-4 w-4" />
            </span>
          </motion.a>
        ))}
      </div>
    </SectionWrapper>
  );
}
