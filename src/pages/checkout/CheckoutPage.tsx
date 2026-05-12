import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { useAppDispatch, useAppSelector } from '@redux';
import { Breadcrumb } from '@components/shared/Breadcrumb';
import { FormField } from '@components/forms/FormField';
import { PageMeta } from '@components/layout/PageMeta';
import { Button } from '@components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Container } from '@components/ui/Container';
import { EmptyState } from '@components/ui/EmptyState';
import { ROUTES } from '@constants/routes';
import env from '@lib/env';
import { useUnifiedCart } from '@hooks/commerce/useUnifiedCart';
import {
  useCreateOrderMutation,
  useGetCheckoutSummaryMutation,
  useListAddressesQuery,
} from '@redux/customer';
import { clearCart, selectCartItems, selectCartSubtotal } from '@redux/cart';
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
  const apiMode = !env.enableMockApi;
  const { items, subtotal, clearAll, isAuthenticated } = useUnifiedCart();
  const mockItems = useAppSelector(selectCartItems);
  const mockSubtotal = useAppSelector(selectCartSubtotal);

  const displayItems = apiMode ? items : mockItems;
  const displaySubtotal = apiMode ? subtotal : mockSubtotal;

  const { data: addresses } = useListAddressesQuery(undefined, {
    skip: !apiMode || !isAuthenticated,
  });
  const [getSummary, { data: summary, isLoading: summaryLoading }] = useGetCheckoutSummaryMutation();
  const [placeOrder, { isLoading: placingOrder }] = useCreateOrderMutation();
  const [addressId, setAddressId] = useState('');

  const defaultAddressId = useMemo(
    () => addresses?.find((a) => a.isDefault)?.id ?? addresses?.[0]?.id ?? '',
    [addresses],
  );

  useEffect(() => {
    if (defaultAddressId && !addressId) setAddressId(defaultAddressId);
  }, [addressId, defaultAddressId]);

  useEffect(() => {
    if (!apiMode || !isAuthenticated || displayItems.length === 0) return;
    void getSummary({ fromCart: true });
  }, [apiMode, displayItems.length, getSummary, isAuthenticated]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onBlur',
  });

  const shipping = displaySubtotal > 150 ? 0 : 12;
  const tax = Math.round(displaySubtotal * 0.07 * 100) / 100;
  const total = displaySubtotal + shipping + tax;

  const onSubmitMock = async (_values: CheckoutValues) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    dispatch(clearCart());
    toast.success('Order placed! Confirmation sent to your inbox.');
    navigate(ROUTES.dashboardOrders);
  };

  const onSubmitApi = async () => {
    if (!addressId) {
      toast.error('Select a shipping address');
      return;
    }
    try {
      await placeOrder({ addressId }).unwrap();
      await clearAll();
      toast.success('Order placed!');
      navigate(ROUTES.dashboardOrders);
    } catch {
      toast.error('Could not place order');
    }
  };

  if (displayItems.length === 0) {
    return (
      <Container className="py-12">
        <EmptyState
          title="Your cart is empty"
          description="Add some items before checking out."
          action={<Button onClick={() => navigate(ROUTES.products)}>Browse products</Button>}
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

        {apiMode ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void onSubmitApi();
            }}
            className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]"
          >
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Shipping address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {!addresses?.length ? (
                    <p className="text-sm text-muted-foreground">
                      No saved addresses yet. Add one through your account (addresses API) or complete a
                      profile address flow.
                    </p>
                  ) : (
                    <label className="block text-sm font-medium text-foreground" htmlFor="addr">
                      Select address
                      <select
                        id="addr"
                        className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                        value={addressId}
                        onChange={(e) => setAddressId(e.target.value)}
                      >
                        {addresses.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.label} — {a.city}, {a.country}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Order summary</CardTitle>
              </CardHeader>
              <CardContent>
                {summaryLoading && (
                  <p className="text-sm text-muted-foreground">Calculating totals…</p>
                )}
                <ul className="divide-y divide-border">
                  {displayItems.map((item) => (
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
                    <dd>{formatPrice(summary?.subtotalAmount ?? displaySubtotal)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Shipping</dt>
                    <dd>
                      {(summary?.shippingAmount ?? shipping) === 0
                        ? 'Free'
                        : formatPrice(summary?.shippingAmount ?? shipping)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Tax</dt>
                    <dd>{formatPrice(summary?.taxAmount ?? tax)}</dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-3 text-base">
                    <dt className="font-semibold">Total</dt>
                    <dd className="text-lg font-bold">
                      {formatPrice(summary?.totalAmount ?? total)}
                    </dd>
                  </div>
                </dl>
                <Button
                  fullWidth
                  size="lg"
                  type="submit"
                  isLoading={placingOrder}
                  className="mt-6"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                  disabled={!addressId}
                >
                  Place order
                </Button>
              </CardContent>
            </Card>
          </form>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmitMock)}
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
                  {displayItems.map((item) => (
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
                    <dd>{formatPrice(displaySubtotal)}</dd>
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
        )}
      </Container>
    </>
  );
}
