import { PageHero } from '@components/marketing/PageHero';
import { ROUTES } from '@constants/routes';
import { BRAND_NAME } from '@constants/company';
import about from '../../../assets/about/about.jpg';

export function AboutHeroSection() {
  return (
    <PageHero
      eyebrow={`About ${BRAND_NAME}`}
      title={
        <>
          Built for the art.
          <br />
          <span className="bg-gradient-to-r from-primary-300 via-primary-100 to-background bg-clip-text text-transparent">
            Engineered for champions.
          </span>
        </>
      }
      description={`${BRAND_NAME} crafts premium taekwondo uniforms, martial arts apparel, and custom team kits for athletes who demand discipline, performance, and professional presentation.`}
      imageSrc={about}
      imageAlt="Taekwondo athlete in premium uniform"
      primaryCta={{ label: 'Shop uniforms', to: ROUTES.products }}
      secondaryCta={{ label: 'Contact our team', to: ROUTES.contact }}
    />
  );
}
