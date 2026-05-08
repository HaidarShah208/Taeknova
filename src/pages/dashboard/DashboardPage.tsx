import { Heart, Package, ShoppingBag, Star } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { useAppSelector } from '@redux';
import { PageMeta } from '@components/layout/PageMeta';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { EmptyState } from '@components/ui/EmptyState';
import { ROUTES } from '@constants/routes';
import { selectCurrentUser } from '@redux/auth';
import { selectCartCount } from '@redux/cart';
import { selectWishlistIds } from '@redux/wishlist';

const STATS = [
  { id: 'orders', label: 'Active orders', icon: Package, value: 0 },
  { id: 'wishlist', label: 'Wishlist items', icon: Heart, value: 0 },
  { id: 'cart', label: 'In cart', icon: ShoppingBag, value: 0 },
  { id: 'rewards', label: 'Reward points', icon: Star, value: 240 },
];

export default function DashboardPage() {
  const location = useLocation();
  const user = useAppSelector(selectCurrentUser);
  const cartCount = useAppSelector(selectCartCount);
  const wishlistIds = useAppSelector(selectWishlistIds);

  const stats = STATS.map((stat) => {
    if (stat.id === 'wishlist') return { ...stat, value: wishlistIds.length };
    if (stat.id === 'cart') return { ...stat, value: cartCount };
    return stat;
  });

  return (
    <>
      <PageMeta title="Dashboard" />
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Dashboard
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome back{user ? `, ${user.firstName}` : ''}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here’s a snapshot of your account, orders, and saved items.
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.id} variant="outline" padding="md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <stat.icon className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-8" padding="lg">
        <CardHeader>
          <CardTitle>Recent orders</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="When you place your first order, it will appear here."
            action={
              <Link
                to={ROUTES.products}
                className="text-sm font-semibold text-primary hover:underline"
              >
                Start shopping →
              </Link>
            }
          />
        </CardContent>
      </Card>

      {location.pathname !== ROUTES.dashboard && (
        <p className="mt-6 text-xs text-muted-foreground">Section: {location.pathname}</p>
      )}
    </>
  );
}
