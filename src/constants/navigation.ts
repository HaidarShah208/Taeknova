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
  { label: 'About', to: ROUTES.about },
  { label: 'Contact', to: ROUTES.contact },
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
      { label: 'About', to: ROUTES.about },
      { label: 'Contact', to: ROUTES.contact },
      { label: 'Track Order', to: '/track-order' },
      { label: 'Size Guide', to: '/size-guide' },


    ],
  },
   
];

 

export const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', to: ROUTES.adminDashboard },
  { label: 'Analytics', to: ROUTES.adminAnalytics },
  { label: 'Products', to: ROUTES.adminProducts },
  { label: 'Orders', to: ROUTES.adminOrders },
  { label: 'Inventory', to: ROUTES.adminInventory },
  { label: 'Users', to: ROUTES.adminUsers },
  { label: 'Settings', to: ROUTES.adminSettings },
];
