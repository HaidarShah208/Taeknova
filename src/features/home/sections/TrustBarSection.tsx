import { CreditCard, Headphones, Package, Sparkles, Truck } from 'lucide-react';

import { Container } from '@components/ui/Container';

const TRUST_ITEMS = [
  {
    icon: Truck,
    title: 'Fast delivery',
    description: 'Production in 14 days, shipped worldwide',
  },
  {
    icon: Sparkles,
    title: 'Premium quality',
    description: 'Performance fabric, championship-grade',
  },
  {
    icon: Package,
    title: 'Custom designs',
    description: 'Logos, colors, names & numbers',
  },
  {
    icon: CreditCard,
    title: 'Secure payment',
    description: '256-bit SSL encrypted checkout',
  },
  {
    icon: Headphones,
    title: 'Bulk orders',
    description: 'Dedicated account managers for teams',
  },
];

export function TrustBarSection() {
  return (
    <section className="border-b border-border bg-background py-6 sm:py-8">
      <Container>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
          {TRUST_ITEMS.map((item) => (
            <li key={item.title} className="flex items-start gap-3">
              <span
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
                aria-hidden="true"
              >
                <item.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
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
