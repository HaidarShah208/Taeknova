export const ROUTES = {
  home: '/',
  products: '/products',
  productDetails: (slug = ':slug') => `/products/${slug}`,
  categories: '/categories',
  categoryDetails: (slug = ':slug') => `/categories/${slug}`,
  cart: '/cart',
  wishlist: '/wishlist',
  checkout: '/checkout',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  dashboard: '/dashboard',
  dashboardOrders: '/dashboard/orders',
  dashboardOrderDetails: (id = ':id') => `/dashboard/orders/${id}`,
  dashboardProfile: '/dashboard/profile',
  dashboardAddresses: '/dashboard/addresses',
  notFound: '*',
} as const;

export type RouteKey = keyof typeof ROUTES;
