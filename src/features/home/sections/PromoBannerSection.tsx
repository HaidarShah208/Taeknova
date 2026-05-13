import { motion } from 'framer-motion';
import { ArrowRight, BadgePercent, Truck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import jump from '../../../assets/home/flying.jpg'

import { buttonVariants } from '@components/ui/Button';
import { Container } from '@components/ui/Container';
import { ROUTES } from '@constants/routes';
import { cn } from '@lib/cn';

const PROMO_HIGHLIGHTS = [
  { icon: BadgePercent, label: 'Up to 25% off team kits' },
  { icon: Users, label: 'Free design for 10+ pieces' },
  { icon: Truck, label: 'Free shipping over $150' },
];

export function PromoBannerSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground"
        >
          <div className="absolute inset-0 -z-0 opacity-30">
            <img
              src={jump}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover mix-blend-overlay"
            />
          </div>
          <div className="absolute inset-y-0 right-0 -z-0 hidden w-1/3 bg-gradient-to-l from-primary-900 to-transparent lg:block" />
          <div
            aria-hidden="true"
            className="absolute -bottom-24 -right-12 h-72 w-72 rounded-full bg-background/10 blur-3xl"
          />

          <div className="relative grid gap-8 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-12 lg:px-16 lg:py-20">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-background/30 bg-background/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-background/90">
                <BadgePercent className="h-3.5 w-3.5" aria-hidden="true" />
                Season opener · Limited time
              </span>
              <h2 className="mt-4 text-white font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Bulk team orders save up to 25%.
              </h2>
              <p className="mt-4 max-w-xl text-sm text-primary-100 sm:text-base">
                Outfitting a club, school, or league? Get tiered team pricing, complimentary
                design support, and free shipping on every full kit order this season.
              </p>

              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {PROMO_HIGHLIGHTS.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center gap-2 text-sm font-medium text-primary-100"
                  >
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-background/15 text-background">
                      <item.icon className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    {item.label}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to={`${ROUTES.products}?sort=new`}
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'group bg-background text-gray-300 hover:bg-background/90',
                  )}
                >
                  Start a custom order
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  to="/contact"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'lg' }),
                    'border-background/40 bg-transparent text-background hover:bg-background/10',
                  )}
                >
                  Talk to a stylist
                </Link>
              </div>
            </div>

            <ul className="grid grid-cols-2 gap-4 self-end text-sm text-primary-100 lg:col-span-5">
              {[
                ['25k+', 'Teams outfitted'],
                ['98%', 'Reorder rate'],
                ['14d', 'Avg. lead time'],
                ['4.9★', 'Average rating'],
              ].map(([stat, label]) => (
                <li
                  key={label}
                  className="rounded-2xl border border-background/20 bg-background/5 px-4 py-5 backdrop-blur"
                >
                  <p className="text-3xl font-bold text-background">{stat}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-primary-100">{label}</p>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
