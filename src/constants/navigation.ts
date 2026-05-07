import { ROUTES } from '@constants/routes';

export interface NavItem {
  label: string;
  to: string;
  description?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const PRIMARY_NAV: NavItem[] = [
  { label: 'Home', to: ROUTES.home },
  { label: 'Shop', to: ROUTES.products },
  { label: 'Categories', to: ROUTES.categories },
  { label: 'Wishlist', to: ROUTES.wishlist },
];

export const FOOTER_NAV: NavGroup[] = [
  {
    title: 'Shop',
    items: [
      { label: 'All Products', to: ROUTES.products },
      { label: 'Categories', to: ROUTES.categories },
      { label: 'New Arrivals', to: `${ROUTES.products}?sort=new` },
      { label: 'Best Sellers', to: `${ROUTES.products}?sort=popular` },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Sign In', to: ROUTES.login },
      { label: 'Create Account', to: ROUTES.register },
      { label: 'Orders', to: ROUTES.dashboardOrders },
      { label: 'Wishlist', to: ROUTES.wishlist },
    ],
  },
  {
    title: 'Company',
    items: [
      { label: 'About', to: '/about' },
      { label: 'Sustainability', to: '/sustainability' },
      { label: 'Careers', to: '/careers' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Support',
    items: [
      { label: 'Help Center', to: '/help' },
      { label: 'Shipping & Returns', to: '/shipping-returns' },
      { label: 'Size Guide', to: '/size-guide' },
      { label: 'Track Order', to: '/track-order' },
    ],
  },
];

export const DASHBOARD_NAV: NavItem[] = [
  { label: 'Overview', to: ROUTES.dashboard },
  { label: 'Orders', to: ROUTES.dashboardOrders },
  { label: 'Addresses', to: ROUTES.dashboardAddresses },
  { label: 'Profile', to: ROUTES.dashboardProfile },
];
