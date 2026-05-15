import { PageHero } from '@components/marketing/PageHero';
import { BRAND_NAME } from '@constants/company';
import { ROUTES } from '@constants/routes';
import contact from '../../../assets/contact.jpg';

export function ContactHeroSection() {
  return (
    <PageHero
      eyebrow="Contact"
      title={
        <>
          Let&apos;s build your
          <br />
          <span className="bg-gradient-to-r from-primary-300 via-primary-100 to-background bg-clip-text text-transparent">
            next championship kit.
          </span>
        </>
      }
      description={`Questions about sizing, custom team orders, or bulk pricing? The ${BRAND_NAME} team responds within one business day.`}
      imageSrc={contact}
      imageAlt="Contact TAEKNOVA support"
      primaryCta={{ label: 'Browse shop', to: ROUTES.products }}
    />
  );
}
