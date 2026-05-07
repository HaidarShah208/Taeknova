import { motion } from 'framer-motion';
import {
  ArrowRight,
  PlayCircle,
  Sparkles,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { buttonVariants } from '@components/ui/Button';
import { Container } from '@components/ui/Container';
import { ROUTES } from '@constants/routes';
import { cn } from '@lib/cn';

 

const STATS = [
  { end: 25, label: 'Teams outfitted', suffix: 'k+' },
  { end: 4.9, label: 'Average rating', suffix: '★', decimals: 1 },
  { end: 14, label: 'Avg. lead time', suffix: 'd' },
  { end: 30, label: 'Countries shipped', suffix: '+' },
] as const;

interface CountUpProps {
  end: number;
  suffix?: string;
  duration?: number;
  decimals?: number;
  start?: boolean;
}

function CountUp({
  end,
  suffix = '',
  duration = 1400,
  decimals = 0,
  start = true,
}: CountUpProps) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let frame = 0;
    const startTime = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(end * eased);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [duration, end, start]);

  return (
    <>
      {value.toFixed(decimals)}
      {suffix}
    </>
  );
}

 

export function HeroSection() {
  const statsRef = useRef<HTMLDivElement | null>(null);
  const [startCount, setStartCount] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStartCount(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden bg-foreground text-background">
      <div className="absolute inset-0 -z-0">
        <img
          src="https://picsum.photos/seed/tikwando-hero/1800/1200"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/85 to-foreground/30" />
        <div
          aria-hidden="true"
          className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-primary/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 h-80 w-80 rounded-full bg-accent/20 blur-3xl"
        />
      </div>

      <Container className="relative z-10 grid gap-10 py-20 sm:py-24 lg:grid-cols-12 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-background/30 bg-background/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-background/85 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Spring 2026 Collection · Now shipping
          </span>
          <h1 className="mt-6 text-white font-display text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl lg:text-7xl">
            Premium uniforms,
            <br />
            <span className="bg-gradient-to-r from-primary-300 via-primary-100 to-background bg-clip-text text-transparent">
              built for champions.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-background/80 sm:text-lg">
            Performance fabrics, custom team detailing, and championship-grade construction.
            Tikwando crafts uniforms that work as hard as your team.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to={ROUTES.products}
              className={cn(
                buttonVariants({ size: 'lg' }),
                'group bg-background text-foreground hover:bg-background/90',
              )}
            >
              Shop the collection
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
            <Link
              to={ROUTES.categories}
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'border-background/30 bg-transparent text-background hover:bg-background/10',
              )}
            >
              <PlayCircle className="h-4 w-4" aria-hidden="true" />
              Watch the story
            </Link>
          </div>

       

         
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative hidden lg:col-span-5 lg:block"
        >
          <div className="absolute -inset-x-4 -inset-y-2 rounded-[2rem] bg-gradient-to-br from-primary/30 via-transparent to-background/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-background/20 bg-background/5 backdrop-blur">
            <img
              src="https://picsum.photos/seed/tikwando-hero-card/900/1100"
              alt="Athlete in custom Tikwando kit"
              className="h-[34rem] w-full object-cover"
            />
            <div className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-foreground shadow-soft backdrop-blur">
              <span className="inline-block h-2 w-2 rounded-full bg-success" aria-hidden="true" />
              In stock
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-background/95 px-4 py-3 text-foreground shadow-elevated">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  New arrival
                </p>
                <p className="text-sm font-bold">Apex Pro Soccer Kit</p>
              </div>
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                $129
              </span>
            </div>
          </div>
        </motion.div>
      </Container>

      <div
        ref={statsRef}
        className="relative z-10 border-t border-background/10 bg-foreground/40 backdrop-blur"
      >
        <Container>
          <ul className="grid grid-cols-2 gap-y-6 py-6 sm:grid-cols-4 sm:py-8">
            {STATS.map((stat) => (
              <li key={stat.label} className="text-center sm:text-left">
                <p className="font-display text-2xl font-bold tracking-tight text-background sm:text-3xl">
                  <CountUp
                    end={stat.end}
                    suffix={stat.suffix}
                    decimals={'decimals' in stat ? stat.decimals : 0}
                    start={startCount}
                  />
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-background/60">
                  {stat.label}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </section>
  );
}
