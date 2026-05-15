import { SUPPORT_EMAIL, SUPPORT_PHONE } from '@constants/app';

export const BRAND_NAME = 'TAEKNOVA';

export const COMPANY_CONTACT = {
  email: SUPPORT_EMAIL,
  phone: SUPPORT_PHONE,
  address: '1200 Champions Way, Suite 400, Austin, TX 78701, USA',
  hours: 'Mon – Fri, 9:00 AM – 6:00 PM CST',
} as const;

export const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/taeknova', network: 'instagram' as const },
  { label: 'Facebook', href: 'https://facebook.com/taeknova', network: 'facebook' as const },
  { label: 'TikTok', href: 'https://tiktok.com/@taeknova', network: 'tiktok' as const },
  { label: 'YouTube', href: 'https://youtube.com/@taeknova', network: 'youtube' as const },
] as const;

export const CONTACT_FAQ_PREVIEW = [
  {
    id: 'custom-order',
    question: 'How do I start a custom team kit order?',
    answer:
      'Browse our catalog, share your team brief via the contact form, or email us. Our design team delivers mockups within 48 hours.',
  },
  {
    id: 'lead-time',
    question: 'What is the typical production lead time?',
    answer:
      'Standard custom uniforms ship in 14 days after mockup approval. Rush production is available for select orders.',
  },
  {
    id: 'samples',
    question: 'Can I order samples before a bulk run?',
    answer:
      'Yes — single-piece samples are available on most styles so you can validate fit and fabric before committing to a full team order.',
  },
  {
    id: 'international',
    question: 'Do you ship outside the United States?',
    answer:
      'We ship to 30+ countries with tracked delivery. Duties and taxes may apply depending on your destination.',
  },
] as const;
