import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { useAppDispatch, useAppSelector } from '@app/store';
import { Breadcrumb } from '@components/shared/Breadcrumb';
import { FormField } from '@components/forms/FormField';
import { PageMeta } from '@components/layout/PageMeta';
import { Button } from '@components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Container } from '@components/ui/Container';
import { EmptyState } from '@components/ui/EmptyState';
import { ROUTES } from '@constants/routes';
import {
  clearCart,
  selectCartItems,
  selectCartSubtotal,
} from '@features/cart/cartSlice';
import { formatPrice } from '@lib/formatters';

const checkoutSchema = z.object({
  email: z.string().email('Enter a valid email'),
  firstName: z.string().min(2, 'Required'),
  lastName: z.string().min(2, 'Required'),
  address: z.string().min(4, 'Required'),
  city: z.string().min(2, 'Required'),
  zip: z.string().min(3, 'Required'),
  country: z.string().min(2, 'Required'),
  cardNumber: z.string().min(12, 'Enter a valid card number'),
  cardExpiry: z.string().min(4, 'Required'),
  cardCvc: z.string().min(3, 'Required'),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onBlur',
  });

  const shipping = subtotal > 150 ? 0 : 12;
  const tax = Math.round(subtotal * 0.07 * 100) / 100;
  const total = subtotal + shipping + tax;

  const onSubmit = async (_values: CheckoutValues) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    dispatch(clearCart());
    toast.success('Order placed! Confirmation sent to your inbox.');
    navigate(ROUTES.dashboardOrders);
  };

  if (items.length === 0) {
    return (
      <Container className="py-12">
        <EmptyState
          title="Your cart is empty"
          description="Add some items before checking out."
          action={
            <Button onClick={() => navigate(ROUTES.products)}>Browse products</Button>
          }
        />
      </Container>
    );
  }

  return (
    <>
      <PageMeta title="Checkout" />
      <Container className="py-8 lg:py-12">
        <Breadcrumb items={[{ label: 'Cart', to: ROUTES.cart }, { label: 'Checkout' }]} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Checkout</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]"
        >
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <FormField
                  name="email"
                  label="Email"
                  type="email"
                  autoComplete="email"
                  register={register}
                  errors={errors}
                />
                <div />
                <FormField
                  name="firstName"
                  label="First name"
                  autoComplete="given-name"
                  register={register}
                  errors={errors}
                />
                <FormField
                  name="lastName"
                  label="Last name"
                  autoComplete="family-name"
                  register={register}
                  errors={errors}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping address</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <FormField
                  name="address"
                  label="Address"
                  autoComplete="street-address"
                  register={register}
                  errors={errors}
                />
                <FormField
                  name="city"
                  label="City"
                  autoComplete="address-level2"
                  register={register}
                  errors={errors}
                />
                <FormField
                  name="zip"
                  label="ZIP / Postal code"
                  autoComplete="postal-code"
                  register={register}
                  errors={errors}
                />
                <FormField
                  name="country"
                  label="Country"
                  autoComplete="country-name"
                  register={register}
                  errors={errors}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <FormField
                    name="cardNumber"
                    label="Card number"
                    placeholder="1234 5678 9012 3456"
                    autoComplete="cc-number"
                    register={register}
                    errors={errors}
                  />
                </div>
                <FormField
                  name="cardExpiry"
                  label="Expiry"
                  placeholder="MM / YY"
                  autoComplete="cc-exp"
                  register={register}
                  errors={errors}
                />
                <FormField
                  name="cardCvc"
                  label="CVC"
                  autoComplete="cc-csc"
                  register={register}
                  errors={errors}
                />
                <p className="sm:col-span-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Secure 256-bit SSL encryption.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Order summary</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-border">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 py-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.size} • {item.color} • Qty {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>
              <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Tax</dt>
                  <dd>{formatPrice(tax)}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3 text-base">
                  <dt className="font-semibold">Total</dt>
                  <dd className="text-lg font-bold">{formatPrice(total)}</dd>
                </div>
              </dl>
              <Button
                fullWidth
                size="lg"
                type="submit"
                isLoading={isSubmitting}
                className="mt-6"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Place order
              </Button>
            </CardContent>
          </Card>
        </form>
      </Container>
    </>
  );
}
