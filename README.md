`# malikshops

An e-commerce storefront with Paystack checkout and split-payment plans. Currently running in **Paystack test mode**, with a Node/Express backend that verifies payments via webhook rather than trusting the frontend.

---

## Tech stack

| Layer    | Tools                                                                                    |
| -------- | ---------------------------------------------------------------------------------------- |
| Frontend | React, TypeScript, Tailwind CSS, Vite                                                    |
| Backend  | Node.js, Express                                                                         |
| Payments | Paystack (test mode) — inline checkout on the client, webhook verification on the server |
| Data     | None yet — no database. Verified payments aren't persisted anywhere yet.                 |

---

## Features

- Light/dark mode toggle with sun/moon icons, persisted across visits
- Product catalogue with search, category filter, and sorting
- Cart drawer and checkout flow
- Pay in full(only pay in full works now) or split any order over ₦20,000 into 2, 3, or 4 monthly Paystack payments
- Backend endpoint that verifies each payment is genuinely from Paystack, using webhook signature verification — not just trusting the "success" callback in the browser

---

## Project structure

```
malikshops/
  client/                    React + TypeScript + Tailwind frontend
    src/
      context/                Theme, Cart, and UI (drawer/modal) state — React Context, no prop drilling
      components/
        layout/                Header, Footer, Logo,Hero

        extras/                Product card and art Checkout modal
      data.ts                  Product catalogue, pricing, plan rules
      paystack.ts               Paystack inline-checkout wrapper
    .env                       VITE_FRONT_END_URL

  backend/                     Node.js + Express backend


        index.js             POST /webhook/paystack — verifies signature, handles events
    .env                       PAYSTACK_SECRET_KEY, PORT
```

---

## Getting started

### 1. Frontend

```bash
cd client
npm install

npm run dev
```

### 2. Backend

```bash
cd server
npm install
cp .env.example .env      # add your Paystack SECRET key (sk_test_...)
npm run dev
```

### Environment variables

**`backend/.env`**

```
PAYSTACK_SECRET_KEY
PORT


```

Never commit either `.env` file, and never put the secret key anywhere in the frontend.

---

## How Test Payments Work Right Now (No Real Money Is Involved)

1. **The customer starts checkout** from the frontend.

2. The frontend sends the customer's **email and amount** to our backend.

3. The backend sends a request to **Paystack's API** to initialize the transaction and gets back a checkout URL.

4. The customer is redirected to the **Paystack test checkout page**, where they can use a Paystack test card. No real money is charged.

5. ggAfter the payment attempt, Paystack redirects the customer back to our frontend using the callback URL.

6. Separately, **Paystack sends a webhook event to our backend** when the transaction status changes.

7. The backend **verifies the webhook signature** to make sure the request actually came from Paystack before processing the event.

8. The **webhook is treated as the source of truth** for confirming payment — not the frontend callback, since a browser callback can be interrupted or manipulated.

9. **Right now, we don't have an orders/payments database connected to this flow**, so a verified successful payment is only handled/logged by the backend. The next milestone is to persist the transaction/order information in the database so we can track which orders are actually paid.

---

## Challenges

### Verifying Paystack webhook signatures

This was the hardest part of the backend so far. Paystack signs every webhook request with an HMAC-SHA512 hash of the **raw request body**, sent in the `x-paystack-signature` header. The signature only matches if you hash the exact raw bytes Paystack sent — if Express's normal JSON body-parser runs first and reformats the body into a JS object before you get to hash it, the recomputed signature never matches, even for a completely genuine webhook. That mismatch looks identical to an actual forged/attacker request, which made it confusing to debug at first — it wasn't obvious whether the signature check itself was wrong or whether the body had already been altered before it got there.

The fix: mount a **raw body parser** specifically on the webhook route (before any JSON parsing touches it), compute the HMAC over those raw bytes using the secret key, and compare it to the header — only trusting the event if they match exactly.

````ts
// index.js
import express from "express";
import crypto from "crypto";
### Webhook Signature Verification

Paystack signs webhook requests using the **raw request body** and the Paystack secret key. My backend recreates that signature and compares it with the `x-paystack-signature` header sent by Paystack.

#### 1. Preserve the raw request body

```js
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);
````

Normally, `express.json()` parses the incoming JSON body and makes it available as `req.body`.

However, Paystack's signature is calculated from the **original raw request body**, before it is parsed or transformed.

The `verify` function gives access to the raw request data as a `Buffer`. I store that buffer on `req.rawBody` so it can later be used to verify the webhook signature.

#### 2. Receive the webhook

````js
app.post("/paystack/webhook", async (req, res) => {
  console.log("webhook running");
})```

Paystack sends webhook events to this endpoint whenever a relevant payment event occurs.

#### 3. Recreate Paystack's signature

```js
const hash = crypto
  .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
  .update(req.rawBody)
  .digest("hex");
````

The backend uses HMAC-SHA512 with the Paystack secret key to create a hash from the **raw request body**.

In simple terms:

**Raw Paystack request + Paystack secret key → calculated hash**

#### 4. Compare the signatures

```js
if (hash == req.headers["x-paystack-signature"])
```

Paystack sends its own signature in the `x-paystack-signature` header.

The backend compares Paystack's signature with the signature it calculated itself.

If they match, the request was signed with the expected secret key and the webhook can be processed.

```js
const event = req.body;
console.log(event);

// Do something with event
```

At this point, `req.body` can be used because `express.json()` has already parsed the JSON for us.

#### Why not just use `req.body`?

Because the signature is generated from the **raw request body**, not the JavaScript object created after JSON parsing.

That's why the application keeps both:

- `req.rawBody` → used for **signature verification**
- `req.body` → used for **reading and processing the webhook event**

Finally, the server responds to Paystack:

```js
res.send(200);
```

This tells Paystack that the webhook was received successfully.

```

---

## Roadmap

- [ ] Add a database (orders, customers, payment plan schedules)
- [ ] Persist verified webhook events instead of only checking them
- [ ] Admin view of orders and payment-plan status
- [ ] Real product images and inventory

---

## Disclaimer

This project currently runs in Paystack **test mode** — no real money moves. It is a portfolio/learning project, not a production store. Going live would require switching to live keys, adding a database, and a proper security pass (rate limiting, input validation, HTTPS, etc.) beyond what's here today.
```
