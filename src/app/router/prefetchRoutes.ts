/** Preload common lazy route chunks during idle time so first navigation stays in-app. */
const COMMON_ROUTE_IMPORTS: Array<() => Promise<unknown>> = [
  () => import('@pages/about/AboutPage'),
  () => import('@pages/contact/ContactPage'),
  () => import('@pages/products/ProductsPage'),
  () => import('@/pages/products/ProductDetailsPage'),
  () => import('@pages/categories/CategoriesPage'),
  () => import('@pages/cart/CartPage'),
  () => import('@pages/wishlist/WishlistPage'),
  () => import('@pages/size-guide/SizeGuidePage'),
  () => import('@pages/auth/login/LoginPage'),
  () => import('@pages/auth/register/RegisterPage'),
];

let prefetched = false;

export function prefetchCommonRoutes() {
  if (prefetched) return;
  prefetched = true;
  for (const load of COMMON_ROUTE_IMPORTS) {
    void load();
  }
}
