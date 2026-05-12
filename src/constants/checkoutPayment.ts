/** Must match backend `CheckoutPaymentMethod`. */
export const CHECKOUT_PAYMENT_METHOD = {
  COD: 'COD',
  EASYPAISA: 'EASYPAISA',
  JAZZCASH: 'JAZZCASH',
  MEEZAN_BANK: 'MEEZAN_BANK',
} as const;

export type CheckoutPaymentMethodId = (typeof CHECKOUT_PAYMENT_METHOD)[keyof typeof CHECKOUT_PAYMENT_METHOD];

export const COD_FEE_PKR = 100;

export const CHECKOUT_HELP_PHONE = '03164288921';

export type ManualPaymentKey = 'EASYPAISA' | 'JAZZCASH' | 'MEEZAN_BANK';

export interface ManualPaymentAccount {
  key: ManualPaymentKey;
  label: string;
  shortLabel: string;
  /** Lines shown in the detail panel */
  lines: { label: string; value: string }[];
}

export const MANUAL_PAYMENT_ACCOUNTS: ManualPaymentAccount[] = [
  {
    key: 'EASYPAISA',
    label: 'Easypaisa',
    shortLabel: 'Easypaisa',
    lines: [
      { label: 'Account number', value: '0346-7383686' },
      { label: 'Account name', value: 'Ali Raza — Easypaisa' },
    ],
  },
  {
    key: 'JAZZCASH',
    label: 'JazzCash',
    shortLabel: 'JazzCash',
    lines: [
      { label: 'Account number', value: '0300-0000000' },
      { label: 'Account name', value: 'Ali Raza — JazzCash' },
    ],
  },
  {
    key: 'MEEZAN_BANK',
    label: 'Meezan Bank',
    shortLabel: 'Meezan Bank',
    lines: [
      { label: 'Account holder', value: 'Ali Raza — Meezan Bank' },
      { label: 'Branch', value: 'Meezan Bank — CHINIOT BRANCH' },
      { label: 'Account no.', value: '48010104279973' },
      { label: 'IBAN', value: 'PK58MEZN0048010104279973' },
    ],
  },
];
