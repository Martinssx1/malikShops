import { useState } from "react";
import { Check, Lock, X } from "lucide-react";
import {
  MIN_PLAN_ORDER,
  PLAN_OPTIONS,
  formatNaira,
  installmentOf,
  type PlanMonths,
} from "../data";
import { fieldClass } from "../styles";
import { useCart } from "../context/useContext";
import { useUI } from "../context/useContext";
//import { payWithPaystack, paystackReady } from "./paystack";
import { PlanOption } from "./PlanOption";
import PaystackPop from "@paystack/inline-js";

export function Checkout() {
  const { lines, subtotal, delivery, total, clear } = useCart();
  const { checkoutOpen, closeCheckout } = useUI();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [months, setMonths] = useState<PlanMonths>(0);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  if (!checkoutOpen) return null;

  const planAllowed = total >= MIN_PLAN_ORDER;

  const instalment = months ? installmentOf(total, months) : 0;
  const dueToday = months ? instalment : total;

  const close = () => {
    closeCheckout();
    // Reset for next time, after the closing transition would have finished.
    setTimeout(() => {
      setReference(null);
      setError("");
    }, 200);
  };

  const pay = () => {
    setError("");
    if (!name.trim() || !address.trim())
      return setError("Enter your name and delivery address.");
    if (!/^\S+@\S+\.\S+$/.test(email))
      return setError(
        "Enter a valid email address. Paystack sends your receipt there.",
      );
    if (phone.replace(/\D/g, "").length < 10)
      return setError("Enter a phone number the rider can call.");

    // try {
    setPaying(true);

    async function responseCode() {
      console.log("items", lines);
      try {
        const response = await fetch(
          `${import.meta.env["VITE_FRONT_END_URL"]}/payment-paystack`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              customer_name: name,
              phone,
              address,
              items: lines,
              plan_months: months,
            }),
          },
        );
        const data = await response.json();
        if (!response.ok) {
          console.error(data.message);
        }

        if (!data.status) return;
        const popup = new PaystackPop();
        popup.resumeTransaction(data.data.access_code, {
          onSuccess: (transaction) => {
            setPaying(false);
            setReference(transaction.reference);
            clear();
          },

          onError: (error) => {
            setPaying(false);
            setError(
              error instanceof Error
                ? error.message
                : "Payment could not start. Try again.",
            );
          },
        });
      } catch (error) {
        console.log("Error initiating payment:", error);
      } finally {
        setPaying(false);
      }
    }
    responseCode();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Checkout"
    >
      <div className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-line bg-bg sm:rounded-3xl">
        {reference ? (
          <div className="px-8 py-14 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand text-brand-ink">
              <Check className="h-7 w-7" />
            </span>
            <h2 className="mt-6 font-display text-3xl font-extrabold">
              Payment received
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
              We sent a receipt to {email}.{" "}
              {months
                ? `Your remaining ${months - 1} payment${months - 1 > 1 ? "s" : ""} will be charged monthly to the same card.`
                : "Your order is on its way to being packed."}
            </p>
            <p className="mt-4 text-xs text-muted">
              Reference{" "}
              <span className="font-semibold text-ink">{reference}</span>
            </p>
            <button
              type="button"
              onClick={close}
              className="mt-8 rounded-full bg-brand px-6 py-3 text-sm font-bold text-brand-ink"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h2 className="font-display text-xl font-bold">Checkout</h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close checkout"
                className="rounded-full p-2 hover:bg-tint"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-8 p-6 md:grid-cols-[1.2fr_1fr]">
              <div className="space-y-6">
                <fieldset className="space-y-3">
                  <legend className="mb-1 font-display text-base font-bold">
                    Delivery details
                  </legend>
                  <input
                    className={fieldClass}
                    placeholder="Full name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      className={fieldClass}
                      type="email"
                      placeholder="Email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                      className={fieldClass}
                      type="tel"
                      placeholder="Phone number"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <input
                    className={fieldClass}
                    placeholder="Delivery address"
                    autoComplete="street-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </fieldset>

                <fieldset>
                  <legend className="mb-3 font-display text-base font-bold">
                    How would you like to pay?
                  </legend>
                  <div className="space-y-2.5">
                    <PlanOption
                      selected={months === 0}
                      onSelect={() => setMonths(0)}
                      title="Pay in full"
                      detail={formatNaira(total)}
                    />
                    {PLAN_OPTIONS.map((m) => (
                      <PlanOption
                        key={m}
                        disabled={!planAllowed}
                        selected={months === m}
                        onSelect={() => setMonths(m)}
                        title={`${m} monthly payments`}
                        detail={`${formatNaira(installmentOf(total, m))} / month`}
                        note={
                          planAllowed
                            ? "First payment today"
                            : `Orders of ${formatNaira(MIN_PLAN_ORDER)}+ only`
                        }
                      />
                    ))}
                  </div>
                </fieldset>
              </div>

              <div className="h-fit rounded-2xl border border-line bg-surface p-5">
                <h3 className="font-display text-base font-bold">
                  Order summary
                </h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {lines.map(({ product, qty }) => (
                    <li key={product.id} className="flex justify-between gap-3">
                      <span className="text-muted">
                        {qty} × {product.name}
                      </span>
                      <span className="shrink-0 font-semibold">
                        {formatNaira(product.price * qty)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
                  <div className="flex justify-between text-muted">
                    <span>Subtotal</span>
                    <span>{formatNaira(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Delivery</span>
                    <span>
                      {delivery === 0 ? "Free" : formatNaira(delivery)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 font-bold">
                    <span>Order total</span>
                    <span>{formatNaira(total)}</span>
                  </div>
                  <div className="flex justify-between rounded-xl bg-tint px-3 py-2.5 font-display text-base font-extrabold text-brand">
                    <span>Due today</span>
                    <span>{formatNaira(dueToday)}</span>
                  </div>
                  {months > 0 && (
                    <p className="pt-1 text-xs text-muted">
                      Then {months - 1} more monthly payment
                      {months - 1 > 1 ? "s" : ""} of {formatNaira(instalment)}.
                    </p>
                  )}
                </div>

                {error && (
                  <p
                    role="alert"
                    className="mt-4 rounded-xl border border-line bg-tint px-3 py-2.5 text-sm"
                  >
                    {error}
                  </p>
                )}

                {/*!paystackReady() && (
                  <p className="mt-4 text-xs text-muted">
                    Paystack isn&apos;t configured yet. Add your public key to{" "}
                    <code>.env</code> to accept payments.
                  </p>
                )*/}

                <button
                  type="button"
                  onClick={pay}
                  disabled={paying}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-bold text-brand-ink transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  <Lock className="h-4 w-4" />
                  {paying
                    ? "Opening Paystack…"
                    : `Pay ${formatNaira(dueToday)}`}
                </button>
                <p className="mt-3 text-center text-xs text-muted">
                  Secured by Paystack. Card details never touch our site.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
