import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { Accordion, AccordionItem } from '@components/ui/Accordion';
import { SectionWrapper } from '@components/shared/SectionWrapper';
import { CONTACT_FAQ_PREVIEW } from '@constants/company';
import { ROUTES } from '@constants/routes';

export function ContactFaqSection() {
  return (
    <SectionWrapper
      tone="muted"
      eyebrow="FAQ"
      title="Common questions"
      description="Quick answers before you reach out — still need help? Our team responds fast."
      action={
        <Link to={ROUTES.home} className="text-sm font-semibold text-primary hover:underline">
          View all FAQs on home
        </Link>
      }
    >
      <motion.div className="rounded-2xl border border-border bg-card px-6 py-2">
        <Accordion type="single" defaultOpen={[CONTACT_FAQ_PREVIEW[0].id]}>
          {CONTACT_FAQ_PREVIEW.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id} trigger={faq.question}>
              {faq.answer}
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </SectionWrapper>
  );
}
