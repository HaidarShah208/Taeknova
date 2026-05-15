import { motion } from 'framer-motion';

import { SocialLinks } from '@components/marketing/SocialLinks';
import { SectionWrapper } from '@components/shared/SectionWrapper';
import { BRAND_NAME } from '@constants/company';
import { viewportOnce } from '@lib/motion';

export function ContactSocialSection() {
  return (
    <SectionWrapper
      tone="dark"
      eyebrow="Follow us"
      title="Join the TAEKNOVA community"
      description={`Training tips, new drops, and behind-the-scenes from the ${BRAND_NAME} team — follow us on social.`}
      align="center"
    >
      <motion.div
        className="flex flex-col items-center gap-6"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.45 }}
      >
        <SocialLinks size="md" className="justify-center" />
        <p className="max-w-md text-center text-sm text-background/70">
          Tag <span className="font-semibold text-background">@taeknova</span> in your team photos —
          we feature academies every week.
        </p>
      </motion.div>
    </SectionWrapper>
  );
}
