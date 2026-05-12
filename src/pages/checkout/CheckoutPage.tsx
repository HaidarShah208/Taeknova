import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useEffect, useLayoutEffect, useMemo } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
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
  useCreateAddressMutation,
  useCreateOrderMutation,
  useGetCheckoutSummaryMutation,
} from '@redux/customer';
import { clearCart, selectCartItems, selectCartSubtotal } from '@redux/cart';
import { formatPrice, type FormatPriceOptions } from '@lib/formatters';
import { closeAllOverlays } from '@redux/ui';

const shippingShape = {
  email: z.string().email('Enter a valid email'),
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  phone: z.string().min(7, 'Enter a valid phone'),
  line1: z.string().min(4, 'Street address required'),
  city: z.string().min(2, 'Required'),
  state: z.string().min(1, 'Required'),
  postalCode: z.string().min(3, 'PIN / ZIP required'),
  country: z.string().min(2, 'Required'),
};

const checkoutSchemaApi = z.object(shippingShape);

const checkoutSchemaMock = z.object({
  ...shippingShape,
  cardNumber: z.string().min(12, 'Enter a valid card number'),
  cardExpiry: z.string().min(4, 'Required'),
  cardCvc: z.string().min(3, 'Required'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchemaMock>;

const defaultFormValues: CheckoutFormValues = {
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  line1: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'Pakistan',
  cardNumber: '',
  cardExpiry: '',
  cardCvc: '',
};

const PKR: FormatPriceOptions = {
  currency: 'PKR',
  locale: 'en-PK',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const apiMode = !env.enableMockApi;
  const { items, subtotal, clearAll, isAuthenticated } = useUnifiedCart();
  const mockItems = useAppSelector(selectCartItems);
  const mockSubtotal = useAppSelector(selectCartSubtotal);

  const displayItems = apiMode ? items : mockItems;
  const displaySubtotal = apiMode ? subtotal : mockSubtotal;

  const [getSummary, { data: summary, isLoading: summaryLoading }] = useGetCheckoutSummaryMutation();
  const [placeOrder, { isLoading: placingOrder }] = useCreateOrderMutation();
  const [createAddress, { isLoading: creatingAddress }] = useCreateAddressMutation();

  const resolver = useMemo(
    () =>
      zodResolver(apiMode ? checkoutSchemaApi : checkoutSchemaMock) as Resolver<CheckoutFormValues>,
    [apiMode],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver,
    mode: 'onBlur',
    defaultValues: defaultFormValues,
  });

  useLayoutEffect(() => {
    dispatch(closeAllOverlays());
  }, [dispatch]);

  const cartQtySignature = useMemo(
    () => displayItems.map((i) => `${i.variantId}:${i.quantity}`).join('|'),
    [displayItems],
  );

  useEffect(() => {
    if (!apiMode || !isAuthenticated || displayItems.length === 0) return;
    void getSummary({ fromCart: true });
  }, [apiMode, cartQtySignature, displayItems.length, getSummary, isAuthenticated]);

  const shipping = displaySubtotal > 150 ? 0 : 12;
  const tax = Math.round(displaySubtotal * 0.07 * 100) / 100;
  const total = displaySubtotal + shipping + tax;

  const onSubmitMock = async (_values: CheckoutFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    dispatch(clearCart());
    toast.success('Order placed! Confirmation sent to your inbox.');
    navigate(ROUTES.dashboardOrders);
  };

  const onSubmitApi = async (values: CheckoutFormValues) => {
    try {
      const recipientName = `${values.firstName} ${values.lastName}`.trim();
      const addr = await createAddress({
        label: 'Checkout shipping',
        recipientName,
        phone: values.phone,
        line1: values.line1,
        city: values.city,
        state: values.state,
        postalCode: values.postalCode,
        country: values.country,
        isDefault: false,
      }).unwrap();

      await placeOrder({
        addressId: addr.id,
        customerNotes: `Contact email: ${values.email}`,
      }).unwrap();

      await clearAll();
      toast.success('Order placed!');
      navigate(ROUTES.dashboardOrders);
    } catch {
      toast.error('Could not complete checkout. Check your details and try again.');
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

  const saving = apiMode ? placingOrder || creatingAddress : isSubmitting;

  return (
    <>
      <PageMeta title="Checkout" />
      <Container className="py-8 lg:py-12">
        <Breadcrumb items={[{ label: 'Cart', to: ROUTES.cart }, { label: 'Checkout' }]} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Checkout</h1>

        <form
          onSubmit={handleSubmit(apiMode ? onSubmitApi : onSubmitMock)}
          className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px] lg:items-stretch"
        >
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contact</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
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
                <FormField
                  name="phone"
                  label="Phone"
                  type="tel"
                  autoComplete="tel"
                  register={register}
                  errors={errors}
                />
                <FormField
                  name="email"
                  label="Email"
                  type="email"
                  autoComplete="email"
                  register={register}
                  errors={errors}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Shipping address</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <FormField
                    name="line1"
                    label="Street address"
                    autoComplete="street-address"
                    register={register}
                    errors={errors}
                  />
                </div>
                <FormField
                  name="city"
                  label="City"
                  autoComplete="address-level2"
                  register={register}
                  errors={errors}
                />
                <FormField
                  name="state"
                  label="State / Province"
                  autoComplete="address-level1"
                  register={register}
                  errors={errors}
                />
                <FormField
                  name="postalCode"
                  label="PIN / Postal code"
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

            {!apiMode ? (
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
                    Secure 256-bit SSL encryption (demo checkout).
                  </p>
                </CardContent>
              </Card>
            ) : null}
          </div>

          <Card className="flex h-full min-h-[min(70vh,28rem)] flex-col overflow-hidden lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:self-start">
            <CardHeader className="shrink-0">
              <CardTitle>Order summary</CardTitle>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col gap-0 pt-2">
              {apiMode && summaryLoading && (
                <p className="mb-3 shrink-0 text-sm text-muted-foreground">Calculating totals…</p>
              )}
              <div className="min-h-0 flex-1 overflow-y-auto">
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
                          {[item.size, item.color].filter(Boolean).join(' • ') || '—'}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold tabular-nums">
                        {formatPrice(item.price * item.quantity, PKR)}
                      </p>
                    </li>
                  ))}
                </ul>
                <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd className="tabular-nums">
                      {formatPrice(Number(summary?.subtotalAmount ?? displaySubtotal), PKR)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Shipping</dt>
                    <dd className="tabular-nums">
                      {(summary?.shippingAmount ?? shipping) === 0
                        ? 'Free'
                        : formatPrice(Number(summary?.shippingAmount ?? shipping), PKR)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Tax</dt>
                    <dd className="tabular-nums">
                      {formatPrice(Number(summary?.taxAmount ?? tax), PKR)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Quantity</dt>
                    <dd className="tabular-nums">
                      {displayItems.reduce((sum, i) => sum + i.quantity, 0)} units
                    </dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-3 text-base">
                    <dt className="font-semibold">Total</dt>
                    <dd className="text-lg font-bold tabular-nums">
                      {formatPrice(Number(summary?.totalAmount ?? total), PKR)}
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="mt-auto shrink-0   bg-card pt-4">
                <Button
                  fullWidth
                  size="lg"
                  type="submit"
                  isLoading={saving}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Place order
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Container>
    </>
  );
}
