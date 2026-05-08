import { BadgeCheck, CheckCheck, CircleCheckBig, ShieldCheck } from 'lucide-react';

import { Container } from '@components/ui/Container';

const TRUST_ITEMS = [
  {
    icon: CheckCheck,
    title: '100% Satisfaction',
    description: 'Guaranteed quality and finish',
  },
  {
    icon: BadgeCheck,
    title: 'Certified Product',
    description: 'Premium, tested performance gear',
  },
  {
    icon: CircleCheckBig,
    title: 'Trusted Brand',
    description: 'Chosen by clubs and teams',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Ordering',
    description: 'Safe checkout and payment flow',
  },
];

export function TrustBarSection() {
  return (
    <section className="border-b border-border bg-background py-7 sm:py-10">
      <Container>
        <ul className="grid grid-cols-2 gap-4 rounded-[1.75rem] border border-border/80 bg-card p-5 shadow-elevated sm:grid-cols-4 sm:gap-5 sm:p-7">
          {TRUST_ITEMS.map((item) => (
            <li key={item.title} className="flex flex-col items-center text-center">
              <span
                className="inline-flex h-20 w-20 items-center justify-center rounded-full border-[6px] border-primary/20 bg-primary/10 text-primary shadow-soft sm:h-24 sm:w-24"
                aria-hidden="true"
              >
                <item.icon className="h-9 w-9 sm:h-10 sm:w-10" />
              </span>
              <div className="mt-3 min-w-0">
                <p className="text-sm font-bold tracking-tight text-foreground sm:text-base">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
