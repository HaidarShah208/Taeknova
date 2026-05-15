import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

import { SectionWrapper } from '@components/shared/SectionWrapper';
import { COMPANY_CONTACT } from '@constants/company';
import { viewportOnce } from '@lib/motion';

export function ContactMapSection() {
  return (
    <SectionWrapper tone="default" eyebrow="Visit us" title="Our headquarters" align="center">
      <motion.div
        className="overflow-hidden rounded-3xl border border-border bg-muted/30"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="relative flex min-h-[280px] flex-col items-center justify-center bg-gradient-to-br from-foreground/90 via-[#1a2332] to-[#101A2F] px-6 py-16 text-center sm:min-h-[320px]"
          whileHover={{ scale: 1.005 }}
          transition={{ duration: 0.4 }}
        >
          <span
            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-primary"
            aria-hidden="true"
          >
            <MapPin className="h-7 w-7" />
          </span>
          <p className="mt-4 max-w-md text-sm text-background/75">
            Map embed placeholder — connect Google Maps or Mapbox when your production address is
            finalized.
          </p>
          <address className="mt-3 text-base font-semibold not-italic text-white">
            {COMPANY_CONTACT.address}
          </address>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(COMPANY_CONTACT.address)}`}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-5 text-sm font-semibold text-primary-300 underline-offset-4 hover:underline"
          >
            Open in Google Maps
          </a>
        </motion.div>
      </motion.div>
    </SectionWrapper>
  );
}
