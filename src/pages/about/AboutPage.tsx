import { PageMeta } from '@components/layout/PageMeta';
import { BRAND_NAME } from '@constants/company';
import {
  AboutCtaSection,
  AboutHeroSection,
  AboutValuesSection,
  AboutWhyChooseSection,
  BrandStorySection,
} from '@features/about/sections';

export default function AboutPage() {
  return (
    <>
      <PageMeta
        title={`About ${BRAND_NAME}`}
        description={`Learn how ${BRAND_NAME} crafts premium taekwondo uniforms, martial arts apparel, and custom team kits for athletes worldwide.`}
      />
      <AboutHeroSection />
      <BrandStorySection />
      <AboutWhyChooseSection />
      <AboutValuesSection />
      <AboutCtaSection />
    </>
  );
}
