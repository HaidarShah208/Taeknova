import { CtaBand } from '@components/marketing/CtaBand';
import { ROUTES } from '@constants/routes';

export function AboutCtaSection() {
  return (
    <CtaBand
      eyebrow="Ready to elevate your team?"
      title="Outfit your academy with championship-grade gear"
      description="Shop ready-to-ship uniforms or start a custom team kit — our specialists are standing by to help."
      actions={[
        { label: 'Shop uniforms', to: ROUTES.products },
        { label: 'Customize team kits', to: ROUTES.contact, variant: 'outline' },
        { label: 'Contact us', to: ROUTES.contact, variant: 'outline' },
      ]}
    />
  );
}
