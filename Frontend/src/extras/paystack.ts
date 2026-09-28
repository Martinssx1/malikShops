/**
 * Paystack helper (frontend only).
 *
 * Uses the inline popup loaded in index.html. Only the PUBLIC key belongs here.
 * Never put your secret key in frontend code, and always verify the payment
 * on your server (GET /transaction/verify/:reference) before shipping an order.
 *
 * PAYMENT PLANS
 * Create three plans in the Paystack dashboard (Products → Plans), each with:
 *   - amount:   ₦100  (the base unit)
 *   - interval: monthly
 *   - invoice limit: 2, 3 and 4 respectively
 * Put the plan codes (PLN_xxx) in .env. At checkout we pass `plan` plus a
 * `quantity`, and Paystack charges base amount × quantity every month, so
 * quantity = instalment ÷ 100. Until the codes are set, the popup simply
 * charges the first instalment as a one-off, which is handy for testing.
 

interface PaystackResponse {
  reference: string;
  status: string;
  message?: string;
}

interface PaystackSetupOptions {
  key: string;
  email: string;
  amount: number; // kobo
  currency?: string;
  ref?: string;
  plan?: string;
  quantity?: number;
  metadata?: Record<string, unknown>;
  callback: (response: PaystackResponse) => void;
  onClose: () => void;
}

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: PaystackSetupOptions) => { openIframe: () => void };
    };
  }
}

const PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as
  | string
  | undefined;

const PLAN_CODES: Record<number, string | undefined> = {
  2: import.meta.env.VITE_PAYSTACK_PLAN_2 as string | undefined,
  3: import.meta.env.VITE_PAYSTACK_PLAN_3 as string | undefined,
  4: import.meta.env.VITE_PAYSTACK_PLAN_4 as string | undefined,
};

export const paystackReady = () => Boolean(PUBLIC_KEY && window.PaystackPop);

interface PayArgs {
  email: string;
  /** Amount to charge today, in naira (full total, or the first instalment). */
// amountNaira: number;
/** 0 = pay in full, otherwise number of monthly payments. 
  months: number;
  instalmentNaira?: number;
  metadata?: Record<string, unknown>;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}

export function payWithPaystack({
  email,
  amountNaira,
  months,
  instalmentNaira,
  metadata,
  onSuccess,
  onClose,
}: PayArgs) {
  if (!PUBLIC_KEY || !window.PaystackPop) {
    throw new Error(
      "Paystack is not ready. Check VITE_PAYSTACK_PUBLIC_KEY and your connection.",
    );
  }

  const planCode = months ? PLAN_CODES[months] : undefined;
  /*
  const handler = window.PaystackPop.setup({
    key: PUBLIC_KEY,
    email,
    amount: Math.round(amountNaira * 100),
    currency: 'NGN',
    ref: `MS-${Date.now()}`,
    ...(planCode && instalmentNaira
      ? { plan: planCode, quantity: Math.round(instalmentNaira / 100) }
      : {}),
    metadata: { store: 'malikshops', plan_months: months, ...metadata },
    callback: (response) => onSuccess(response.reference),
    onClose,
  });

  handler.openIframe();
  *
}*/
