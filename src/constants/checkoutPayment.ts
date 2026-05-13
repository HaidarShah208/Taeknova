
export const CHECKOUT_PAYMENT_METHOD = {
  COD: 'COD',
  EASYPAISA: 'EASYPAISA',
  JAZZCASH: 'JAZZCASH',
  MEEZAN_BANK: 'MEEZAN_BANK',
} as const;

export type CheckoutPaymentMethodId = (typeof CHECKOUT_PAYMENT_METHOD)[keyof typeof CHECKOUT_PAYMENT_METHOD];

export const COD_FEE_PKR = 100;

export const CHECKOUT_HELP_PHONE = '0310-7580073';

export type ManualPaymentKey = 'EASYPAISA' | 'JAZZCASH' | 'MEEZAN_BANK';

export interface ManualPaymentAccount {
  key: ManualPaymentKey;
  label: string;
  shortLabel: string;
  lines: { label: string; value: string }[];
}

export const MANUAL_PAYMENT_ACCOUNTS: ManualPaymentAccount[] = [
  {
    key: 'EASYPAISA',
    label: 'Easypaisa',
    shortLabel: 'Easypaisa',
    lines: [
      { label: 'Account number', value: '03107580073' },
      { label: 'Account name', value: 'Ali Haidar — Easypaisa' },
    ],
  },
  {
    key: 'JAZZCASH',
    label: 'JazzCash',
    shortLabel: 'JazzCash',
    lines: [
      { label: 'Account number', value: '0307-9732429' },
      { label: 'Account name', value: 'Ali Haidar — JazzCash' },
    ],
  },
  {
    key: 'MEEZAN_BANK',
    label: 'Meezan Bank',
    shortLabel: 'Meezan Bank',
    lines: [
      { label: 'Account holder', value: 'Ali Haidar — Meezan Bank' },
      { label: 'Account no.', value: '02750113164681' },
      { label: 'IBAN', value: 'PK44MEZN0002750113164681' },
    ],
  },
];
