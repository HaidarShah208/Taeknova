import { ROUTES } from '@constants/routes';
import env from '@lib/env';

export function buildProductPageUrl(slug: string): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}${ROUTES.productDetails(slug)}`;
}

function buildProductOgEndpointUrl(slug: string): string {
  const path = `/public/og/product/${encodeURIComponent(slug)}`;
  const raw = env.apiBaseUrl.replace(/\/$/, '');
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return `${raw}${path}`;
  }
  const base = raw.startsWith('/') ? raw : `/${raw}`;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}${base}${path}`;
}

/** Link to put in WhatsApp / copy: crawlers get HTML with Open Graph tags when using the real API. */
export function buildProductShareLinkUrl(slug: string): string {
  if (env.enableMockApi) return buildProductPageUrl(slug);
  return buildProductOgEndpointUrl(slug);
}
