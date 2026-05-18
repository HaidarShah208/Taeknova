import { APP_NAME } from '@constants/app';
import { COMPANY_CONTACT } from '@constants/company';

/** E.164-style digits for wa.me (Pakistan: 92 + number without leading 0). */
export function toWhatsAppDigits(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('92')) return digits;
  if (digits.startsWith('0')) return `92${digits.slice(1)}`;
  return digits;
}

export function getWhatsAppChatUrl(
  phone = COMPANY_CONTACT.phone,
  message = `Hello ${APP_NAME}, I would like to inquire about your products.`,
): string {
  const digits = toWhatsAppDigits(phone);
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
