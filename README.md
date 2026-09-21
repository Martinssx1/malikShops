# malikshops (frontend)

React + TypeScript + Tailwind CSS storefront with light/dark mode and Paystack payment plans.

## Setup

```bash
npm create vite@latest malikshops -- --template react-ts
cd malikshops
npm install lucide-react
npm install -D tailwindcss@3 postcss autoprefixer
```

Then copy these files over the generated ones:

- `index.html`, `tailwind.config.js`, `postcss.config.js`, `.env.example`
- everything in `src/` (delete the default `App.css` and `assets/`)

```bash
cp .env.example .env     # add your Paystack public key
npm run dev
```

## Paystack payment plans

1. In the Paystack dashboard, create three plans: amount ₦100, monthly, with invoice limits 2, 3 and 4.
2. Put their `PLN_` codes in `.env`.
3. At checkout the app passes the plan code plus a quantity (instalment ÷ 100), so Paystack charges the right monthly amount.

Without plan codes the popup charges the first instalment once, which is fine for testing the UI.

Instalments are rounded up to the nearest ₦100, so a customer can pay up to ₦100 × months over the order total.

## Before going live

This is frontend only. Your server must verify each payment
(`GET https://api.paystack.co/transaction/verify/:reference` with your secret key)
before you ship an order, and should listen for Paystack webhooks for recurring charges.

Product art is placeholder icons. Add an `image` URL to any product in `src/data.ts` to show a real photo.
