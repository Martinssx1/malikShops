/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PAYSTACK_PUBLIC_KEY?: string;
  readonly VITE_PAYSTACK_PLAN_2?: string;
  readonly VITE_PAYSTACK_PLAN_3?: string;
  readonly VITE_PAYSTACK_PLAN_4?: string;
  readonly VITE_FRONT_END_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
