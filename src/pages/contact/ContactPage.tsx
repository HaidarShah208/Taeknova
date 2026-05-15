import { PageMeta } from '@components/layout/PageMeta';
import { BRAND_NAME } from '@constants/company';
import {
  ContactFormSection,
  ContactHeroSection,
  ContactInfoSection,
} from '@features/contact/sections';

export default function ContactPage() {
  return (
    <>
      <PageMeta
        title={`Contact ${BRAND_NAME}`}
        description={`Get in touch with ${BRAND_NAME} for custom team kits, bulk orders, sizing help, and martial arts uniform inquiries.`}
      />
      <ContactHeroSection />
      <ContactInfoSection />
      <ContactFormSection />
    </>
  );
}
