import { SUPPORT_EMAIL, SUPPORT_PHONE } from '@constants/app';

export const BRAND_NAME = 'TAEKNOVA';

export const COMPANY_CONTACT = {
  email: SUPPORT_EMAIL,
  phone: SUPPORT_PHONE,
  address: 'Jhumra Road, Chiniot',
  hours: 'Mon – Sat, 9:00 AM – 6:00 PM PKT',
} as const;

export const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/taeknova', network: 'instagram' as const },
  { label: 'Facebook', href: 'https://facebook.com/taeknova', network: 'facebook' as const },
  { label: 'TikTok', href: 'https://tiktok.com/@taeknova', network: 'tiktok' as const },
  { label: 'YouTube', href: 'https://youtube.com/@taeknova', network: 'youtube' as const },
] as const;

