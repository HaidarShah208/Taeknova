import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { ROUTES } from '@constants/routes';
import { AuthLayout } from '@layouts/AuthLayout';
import { DashboardLayout } from '@layouts/DashboardLayout';
import { MainLayout } from '@layouts/MainLayout';

import { GuestRoute } from './GuestRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { RouteFallback } from './RouteFallback';

const HomePage = lazy(() => import('@pages/home/HomePage'));
const ProductsPage = lazy(() => import('@pages/products/ProductsPage'));
const ProductDetailsPage = lazy(() => import('@/pages/products/ProductDetailsPage'));
const CategoriesPage = lazy(() => import('@pages/categories/CategoriesPage'));
const CartPage = lazy(() => import('@pages/cart/CartPage'));
const WishlistPage = lazy(() => import('@pages/wishlist/WishlistPage'));
const CheckoutPage = lazy(() => import('@pages/checkout/CheckoutPage'));
const LoginPage = lazy(() => import('@pages/auth/login/LoginPage'));
const RegisterPage = lazy(() => import('@pages/auth/register/RegisterPage'));
const ForgotPasswordPage = lazy(
  () => import('@pages/auth/forgot-password/ForgotPasswordPage'),
);
const ResetPasswordPage = lazy(
  () => import('@pages/auth/reset-password/ResetPasswordPage'),
);
const DashboardPage = lazy(() => import('@pages/dashboard/DashboardPage'));
const NotFoundPage = lazy(() => import('@pages/not-found/NotFoundPage'));

export function AppRouter() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.home} element={<HomePage />} />
          <Route path={ROUTES.products} element={<ProductsPage />} />
          <Route path={ROUTES.productDetails()} element={<ProductDetailsPage />} />
          <Route path={ROUTES.categories} element={<CategoriesPage />} />
          <Route path={ROUTES.categoryDetails()} element={<ProductsPage />} />
          <Route path={ROUTES.cart} element={<CartPage />} />
          <Route path={ROUTES.wishlist} element={<WishlistPage />} />
          <Route
            path={ROUTES.checkout}
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route element={<AuthLayout />}>
          <Route
            path={ROUTES.login}
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path={ROUTES.register}
            element={
              <GuestRoute>
                <RegisterPage />
              </GuestRoute>
            }
          />
          <Route
            path={ROUTES.forgotPassword}
            element={
              <GuestRoute>
                <ForgotPasswordPage />
              </GuestRoute>
            }
          />
          <Route
            path={ROUTES.resetPassword}
            element={
              <GuestRoute>
                <ResetPasswordPage />
              </GuestRoute>
            }
          />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.dashboard} element={<DashboardPage />} />
          <Route path={ROUTES.dashboardOrders} element={<DashboardPage />} />
          <Route path={ROUTES.dashboardProfile} element={<DashboardPage />} />
          <Route path={ROUTES.dashboardAddresses} element={<DashboardPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
