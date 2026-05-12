import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { ROUTES } from '@constants/routes';
import { AdminLayout } from '@layouts/AdminLayout';
import { AuthLayout } from '@layouts/AuthLayout';
import { ProfileLayout } from '@/layouts/ProfileLayout';
import { MainLayout } from '@layouts/MainLayout';

import { GuestRoute } from './GuestRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { RouteFallback } from './RouteFallback';
import { AdminRoute } from './AdminRoute';

const HomePage = lazy(() => import('@pages/home/HomePage'));
const ProductsPage = lazy(() => import('@pages/products/ProductsPage'));
const ProductDetailsPage = lazy(() => import('@/pages/products/ProductDetailsPage'));
const CategoriesPage = lazy(() => import('@pages/categories/CategoriesPage'));
const CartPage = lazy(() => import('@pages/cart/CartPage'));
const WishlistPage = lazy(() => import('@pages/wishlist/WishlistPage'));
const CheckoutPage = lazy(() => import('@pages/checkout/CheckoutPage'));
const LoginPage = lazy(() => import('@pages/auth/login/LoginPage'));
const RegisterPage = lazy(() => import('@pages/auth/register/RegisterPage'));
const ProfilePage = lazy(() => import('@pages/profile/ProfilePage'));
const OrdersPage = lazy(() => import('@pages/dashboard/OrdersPage'));
const OrderDetailPage = lazy(() => import('@pages/dashboard/OrderDetailPage'));
const AddressesPage = lazy(() => import('@pages/dashboard/AddressesPage'));
const ForgotPasswordPage = lazy(
  () => import('@pages/auth/forgot-password/ForgotPasswordPage'),
);
const ResetPasswordPage = lazy(
  () => import('@pages/auth/reset-password/ResetPasswordPage'),
);
 
 
const AdminDashboardPage = lazy(() => import('@pages/admin/dashboard/AdminDashboardPage'));
const AdminAnalyticsPage = lazy(() => import('@pages/admin/analytics/AdminAnalyticsPage'));
const AdminProductsPage = lazy(() => import('@pages/admin/products/AdminProductsPage'));
const AdminOrdersPage = lazy(() => import('@pages/admin/orders/AdminOrdersPage'));
const AdminInventoryPage = lazy(() => import('@pages/admin/inventory/AdminInventoryPage'));
const AdminUsersPage = lazy(() => import('@pages/admin/users/AdminUsersPage'));
const AdminSettingsPage = lazy(() => import('@pages/admin/settings/AdminSettingsPage'));
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
              <ProfileLayout />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.dashboardProfile} element={<ProfilePage />} />
          <Route path={ROUTES.dashboardOrders} element={<OrdersPage />} />
          <Route path={ROUTES.dashboardOrderDetails()} element={<OrderDetailPage />} />
          <Route path={ROUTES.dashboardAddresses} element={<AddressesPage />} />
        </Route>

        <Route
          path={ROUTES.adminRoot}
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="inventory" element={<AdminInventoryPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
