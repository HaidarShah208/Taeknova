import { motion } from 'framer-motion';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';

import { InfoCard } from '@components/marketing/InfoCard';
import { SectionWrapper } from '@components/shared/SectionWrapper';
import { COMPANY_CONTACT } from '@constants/company';
import { staggerContainer, viewportOnce } from '@lib/motion';

export function ContactInfoSection() {
  return (
    <SectionWrapper
      tone="default"
      eyebrow="Reach us"
      title="We are here to help"
      description="Reach our team by email, phone, or visit our headquarters during business hours."
      align="center"
    >
      <motion.div
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <InfoCard icon={Mail} title="Email" href={`mailto:${COMPANY_CONTACT.email}`}>
          <a
            href={`mailto:${COMPANY_CONTACT.email}`}
            className="font-medium text-foreground hover:text-primary"
          >
            {COMPANY_CONTACT.email}
          </a>
        </InfoCard>
        <InfoCard icon={Phone} title="Phone" href={`tel:${COMPANY_CONTACT.phone.replace(/\s/g, '')}`}>
          <a
            href={`tel:${COMPANY_CONTACT.phone.replace(/\s/g, '')}`}
            className="font-medium text-foreground hover:text-primary"
          >
            {COMPANY_CONTACT.phone}
          </a>
        </InfoCard>
        <InfoCard icon={MapPin} title="Address">
          <address className="not-italic">{COMPANY_CONTACT.address}</address>
        </InfoCard>
        <InfoCard icon={Clock} title="Working hours">
          <p>{COMPANY_CONTACT.hours}</p>
        </InfoCard>
      </motion.div>
    </SectionWrapper>
  );
}
