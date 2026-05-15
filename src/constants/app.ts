export const APP_NAME = 'Tiknova';
export const APP_TAGLINE = 'Premium Custom Uniforms';
export const APP_DESCRIPTION =
  'Tiknova crafts premium custom uniforms and team apparel engineered for performance, fit, and style.';

export const SUPPORT_EMAIL = 'alhi7896542@gmail.com';
export const SUPPORT_PHONE = '0328-7675072';

export const DEFAULT_CURRENCY = 'USD';
export const DEFAULT_LOCALE = 'en-US';
export const DEFAULT_PAGE_SIZE = 12;

export const STORAGE_KEYS = {
  cart: 'tikwando.cart',
  wishlist: 'tikwando.wishlist',
  authToken: 'tikwando.auth.token',
  /** Full user object for rehydration (mock tokens are not JWTs). */
  authUser: 'tikwando.auth.user',
  recentlyViewed: 'tikwando.recently-viewed',
  theme: 'tikwando.theme',
} as const;
