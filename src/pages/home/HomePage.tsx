import { PageMeta } from '@components/layout/PageMeta';
import { APP_DESCRIPTION } from '@constants/app';
import {
  CategoriesSection,
  FaqSection,
  FeaturedProductsSection,
  HeroSection,
  NewArrivalsSection,
  NewsletterSection,
  ProcessSection,
  PromoBannerSection,
  TeamShowcaseSection,
  TestimonialsSection,
  TrustBarSection,
  WhyChooseUsSection,
} from '@features/home/sections';

export default function HomePage() {
  return (
    <>
      <PageMeta title="Premium Custom Uniforms" description={APP_DESCRIPTION} />
      <HeroSection />
      <TrustBarSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <WhyChooseUsSection />
      <ProcessSection />
      <NewArrivalsSection />
      <TeamShowcaseSection />
      <PromoBannerSection />
      <TestimonialsSection />
      <NewsletterSection />
      <FaqSection />
    </>
  );
}
