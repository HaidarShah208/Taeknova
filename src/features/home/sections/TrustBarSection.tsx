import { Container } from '@components/ui/Container';

const TRUST_ITEMS = [
  {
    title: '100% Satisfaction',
    description: 'Guaranteed quality and finish',
  },
  {
    title: 'Certified Product',
    description: 'Premium, tested performance gear',
  },
  {
    title: 'Trusted Brand',
    description: 'Chosen by clubs and teams',
  },
  {
    title: 'Secure Ordering',
    description: 'Safe checkout and payment flow',
  },
];

const TRUST_BADGE_IMAGES = Object.values(
  import.meta.glob('@assets/trustedBadge/*.{png,jpg,jpeg,webp,svg}', {
    eager: true,
    import: 'default',
  }),
) as string[];

export function TrustBarSection() {
  return (
    <section className="bg-background py-7 sm:py-10">
      <Container>
        <ul className="grid grid-cols-2 gap-4 rounded-[1.75rem]  bg-card p-5 sm:grid-cols-4 sm:gap-5 sm:p-7">
          {TRUST_ITEMS.map((item, index) => (
            <li key={item.title} className="flex flex-col items-center text-center">
              {TRUST_BADGE_IMAGES[index] ? (
                <img
                  src={TRUST_BADGE_IMAGES[index]}
                  alt={item.title}
                  className="h-20 w-20 object-contain sm:h-24 sm:w-24"
                  loading="lazy"
                />
              ) : (
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold text-muted-foreground sm:h-24 sm:w-24">
                  Badge
                </div>
              )}
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
