import { CheckCircle2, Upload } from 'lucide-react';
import { type JSX, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Breadcrumb } from '@components/shared/Breadcrumb';
import { PageMeta } from '@components/layout/PageMeta';
import { Button } from '@components/ui/Button';
import { Card, CardContent } from '@components/ui/Card';
import { Container } from '@components/ui/Container';
import jazzcash from '../../assets/paymentLogo/new-Jazzcash-logo.png'
import easypesa from '../../assets/paymentLogo/Easypaisa-logo.png'
import meezanbank from '../../assets/paymentLogo/meezan-bank-logo.png'
import {
  CHECKOUT_HELP_PHONE,
  CHECKOUT_PAYMENT_METHOD,
  COD_FEE_PKR,
  MANUAL_PAYMENT_ACCOUNTS,
  type ManualPaymentKey,
} from '@constants/checkoutPayment';
import { ROUTES } from '@constants/routes';
import { useUnifiedCart } from '@hooks/commerce/useUnifiedCart';
import { useAppDispatch } from '@redux';
import { clearCart } from '@redux/cart';
import {
  useCreateOrderMutation,
  useGetCheckoutSummaryMutation,
  useUploadOrderPaymentProofMutation,
} from '@redux/customer';
import { cn } from '@lib/cn';
import env from '@lib/env';
import { formatPrice, type FormatPriceOptions } from '@lib/formatters';

const PKR: FormatPriceOptions = {
  currency: 'PKR',
  locale: 'en-PK',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
};

export interface CheckoutPaymentLocationState {
  addressId?: string;
  customerNotes?: string;
  mock?: boolean;
  mockSubtotal?: number;
  mockShipping?: number;
  mockTax?: number;
  mockTotal?: number;
  /** Totals from checkout summary before this page refetches (avoids a brief 0 display). */
  prefetchedTotal?: number;
}

const PAYMENT_BRAND_STYLES: Record<ManualPaymentKey, { initials: string; bg: string; icon: JSX.Element }> = {
  EASYPAISA: {
    initials: 'EP',
    bg: 'bg-emerald-600',
    icon: <img src={easypesa} className='w-12 h-9'/>,
  },
  JAZZCASH: {
    initials: 'JC',
    bg: 'bg-rose-600',
    icon: <img src={jazzcash} className='w-12 h-9'/>,
  },
  MEEZAN_BANK: {
    initials: 'MB',
    bg: 'bg-indigo-600',
    icon: <img src={meezanbank} className='w-12 h-12'/>,
  },
};

export default function CheckoutPaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as CheckoutPaymentLocationState | null;
  const dispatch = useAppDispatch();
  const apiMode = !env.enableMockApi;
  const { clearAll } = useUnifiedCart();

  const [category, setCategory] = useState<'manual' | 'cod'>('manual');
  const [manualKey, setManualKey] = useState<ManualPaymentKey>('EASYPAISA');
  const [proofFile, setProofFile] = useState<File | null>(null);

  const [getSummary, { data: summary, isLoading: summaryLoading }] = useGetCheckoutSummaryMutation();
  const [createOrder, { isLoading: placing }] = useCreateOrderMutation();
  const [uploadProof, { isLoading: uploading }] = useUploadOrderPaymentProofMutation();

  useEffect(() => {
    if (!state || (!state.mock && !state.addressId)) {
      toast.error('Please complete checkout first.');
      navigate(ROUTES.checkout, { replace: true });
      return;
    }
    if (apiMode && !state.mock) void getSummary({ fromCart: true });
  }, [apiMode, getSummary, navigate, state]);

  const baseTotal = useMemo(() => {
    if (state?.mock && state.mockTotal != null) return state.mockTotal;
    const t = Number(summary?.totalAmount);
    if (!Number.isNaN(t) && t > 0) return t;
    const p = state?.prefetchedTotal;
    if (p != null && !Number.isNaN(p) && p > 0) return p;
    return 0;
  }, [state?.mock, state?.mockTotal, state?.prefetchedTotal, summary?.totalAmount]);

  const codTotal = baseTotal + COD_FEE_PKR;
  const selectedAccount =
    MANUAL_PAYMENT_ACCOUNTS.find((a) => a.key === manualKey) ??
    MANUAL_PAYMENT_ACCOUNTS[0] ?? {
      key: 'EASYPAISA' as ManualPaymentKey,
      label: 'Easypaisa',
      shortLabel: 'Easypaisa',
      lines: [],
    };

  const busy = placing || uploading;

  const submitCod = async () => {
    if (!apiMode || state?.mock) {
      dispatch(clearCart());
      toast.success('Order placed!');
      navigate(ROUTES.dashboardOrders);
      return;
    }
    if (!state?.addressId) return;
    try {
      await createOrder({
        addressId: state.addressId,
        customerNotes: state.customerNotes,
        paymentMethod: CHECKOUT_PAYMENT_METHOD.COD,
        paymentProofUrl: null,
      }).unwrap();
      await clearAll();
      toast.success('Order placed!');
      navigate(ROUTES.dashboardOrders);
    } catch {
      toast.error('Could not place order.');
    }
  };

  const submitManual = async () => {
    if (!proofFile) {
      toast.error('Upload a payment screenshot (JPG or PNG, max 5MB).');
      return;
    }
    if (proofFile.size > 5 * 1024 * 1024) {
      toast.error('File must be 5MB or smaller.');
      return;
    }
    if (!apiMode || state?.mock) {
      dispatch(clearCart());
      toast.success('Order placed!');
      navigate(ROUTES.dashboardOrders);
      return;
    }
    if (!state?.addressId) return;
    try {
      const { url } = await uploadProof(proofFile).unwrap();
      const paymentMethod =
        manualKey === 'EASYPAISA'
          ? CHECKOUT_PAYMENT_METHOD.EASYPAISA
          : manualKey === 'JAZZCASH'
            ? CHECKOUT_PAYMENT_METHOD.JAZZCASH
            : CHECKOUT_PAYMENT_METHOD.MEEZAN_BANK;
      await createOrder({
        addressId: state.addressId,
        customerNotes: state.customerNotes,
        paymentMethod,
        paymentProofUrl: url,
      }).unwrap();
      await clearAll();
      toast.success('Order placed! We will verify your payment.');
      navigate(ROUTES.dashboardOrders);
    } catch {
      toast.error('Could not complete order. Try again.');
    }
  };

  if (!state || (!state.mock && !state.addressId)) {
    return null;
  }

  return (
    <>
      <PageMeta title="Confirm payment" />
      <Container className="py-8 lg:py-12">
        <Breadcrumb
          items={[
            { label: 'Cart', to: ROUTES.cart },
            { label: 'Checkout', to: ROUTES.checkout },
            { label: 'Payment' },
          ]}
        />
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Confirm payment</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose how you will pay. For bank or wallet transfers, upload proof after sending the amount.
        </p>

        <div className="mx-auto mt-10 max-w-2xl">
          <Card className="overflow-hidden border-border/80 bg-gradient-to-b from-card to-muted/10 shadow-card">
            <CardContent className="space-y-6 p-6 sm:p-8">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCategory('manual')}
                  className={cn(
                    'rounded-xl border-2 px-3 py-3 text-left text-sm font-semibold transition-colors',
                    category === 'manual'
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'border-border bg-card text-muted-foreground hover:bg-muted/50',
                  )}
                >
                  Bank / wallet
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('cod')}
                  className={cn(
                    'rounded-xl border-2 px-3 py-3 text-left text-sm font-semibold transition-colors',
                    category === 'cod'
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'border-border bg-card text-muted-foreground hover:bg-muted/50',
                  )}
                >
                  Cash on delivery
                </button>
              </div>

              {apiMode && summaryLoading && (
                <p className="text-sm text-muted-foreground">Updating your total…</p>
              )}

              <div className="rounded-xl border border-border/70 bg-background/60 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Current total
                </p>
                <p className="mt-1 text-xl font-bold tabular-nums text-foreground">
                  {formatPrice(baseTotal, PKR)}
                </p>
              </div>

              {category === 'cod' ? (
                <div className="space-y-5">
                  <label
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-xl border-2 border-amber-200/80 bg-amber-50/50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20',
                    )}
                  >
                    <input type="checkbox" checked readOnly className="mt-1 h-4 w-4 rounded border-input" />
                    <div className="flex-1">
                      <p className="font-semibold italic text-primary">Cash on delivery (COD)</p>
                      <p className="text-xs text-muted-foreground">Pay when you receive your order.</p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-primary">
                      + {formatPrice(COD_FEE_PKR, PKR)}
                    </span>
                  </label>
                  <div className="rounded-lg bg-muted/40 px-4 py-3 text-center">
                    <p className="text-xs font-medium text-muted-foreground">Your amount</p>
                    <p className="text-xl font-bold tabular-nums">{formatPrice(codTotal, PKR)}</p>
                  </div>
                  <Button
                    fullWidth
                    size="lg"
                    className="bg-foreground font-semibold italic tracking-wide text-background"
                    isLoading={busy}
                    onClick={() => void submitCod()}
                  >
                    Confirm COD order
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="rounded-xl border border-border/70 bg-background/50 p-4">
                    <p className="text-sm font-semibold text-foreground">Step 1: Send payment</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Send the required amount to the selected account, then upload your screenshot below.
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Select payment method
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {MANUAL_PAYMENT_ACCOUNTS.map((acc) => (
                        <button
                          key={acc.key}
                          type="button"
                          onClick={() => setManualKey(acc.key)}
                          className={cn(
                            'flex flex-col items-center gap-2 rounded-xl border-2 px-2 py-3 text-center text-xs font-semibold transition-all',
                            manualKey === acc.key
                              ? 'border-primary bg-primary/10 text-foreground shadow-soft'
                              : 'border-border bg-muted/30 text-muted-foreground hover:bg-muted/60',
                          )}
                        >
                           
                          <span className="inline-flex items-center text-muted-foreground">
                            {PAYMENT_BRAND_STYLES[acc.key].icon}
                             
                          </span>
                          <span className="leading-tight">{acc.shortLabel}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-muted/20 p-4">
                    <ul className="space-y-2 text-sm">
                      {selectedAccount.lines.map((line) => (
                        <li key={line.label} className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
                          <span className="text-muted-foreground">{line.label}</span>
                          <span className="font-semibold text-primary sm:text-right">{line.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-lg bg-muted/40 px-4 py-3 text-center">
                    <p className="text-xs font-medium text-muted-foreground">Your amount</p>
                    <p className="text-xl font-bold tabular-nums">{formatPrice(baseTotal, PKR)}</p>
                  </div>

                  <div className="space-y-2 rounded-xl border border-border/70 bg-background/50 p-4">
                    <p className="text-sm font-semibold text-foreground">Step 2: Upload screenshot</p>
                    <p className="text-xs text-muted-foreground">
                      After payment, take a clear screenshot and upload it here (JPG or PNG, max 5MB).
                    </p>
                    <label className="mt-2 block cursor-pointer">
                      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                        Payment screenshot
                      </span>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/jpeg,image/png"
                          className="absolute inset-0 z-10 h-full min-h-[2.75rem] w-full cursor-pointer opacity-0"
                          onChange={(e) => {
                            const f = e.target.files?.[0] ?? null;
                            setProofFile(f);
                          }}
                        />
                        <div className="pointer-events-none flex min-h-[2.75rem] items-center rounded-lg border border-border bg-background px-3 text-sm text-muted-foreground">
                          <Upload className="mr-2 h-4 w-4 shrink-0" aria-hidden />
                          <span className="truncate">{proofFile ? proofFile.name : 'Choose file'}</span>
                        </div>
                      </div>
                    </label>
                  </div>

                  <Button
                    fullWidth
                    size="lg"
                    className="font-semibold uppercase tracking-wide"
                    isLoading={busy}
                    onClick={() => void submitManual()}
                  >
                    Upload &amp; submit proof
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden />
                <span>Secure confirmation flow</span>
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Need help? Call{' '}
                <a href={`tel:${CHECKOUT_HELP_PHONE}`} className="font-semibold text-primary underline-offset-2 hover:underline">
                  {CHECKOUT_HELP_PHONE}
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </Container>
    </>
  );
}
