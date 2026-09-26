import { MIN_PLAN_ORDER, formatNaira, installmentOf } from "../data";

const STEPS = [
  {
    title: "Choose a plan at checkout",
    body: `Available on orders of ${formatNaira(MIN_PLAN_ORDER)} or more. Pick 2, 3 or 4 monthly payments.`,
  },
  {
    title: "Pay the first part today",
    body: "Pay securely with your card through Paystack. Your order is confirmed straight away.",
  },
  {
    title: "The rest is charged monthly",
    body: "Paystack charges the same card each month until the plan is complete. No paperwork.",
  },
];

export function PlanBand() {
  return (
    <section id="plans" className="scroll-mt-20 border-y border-line bg-tint">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Payment plans
          </h2>
          <p className="mt-4 max-w-sm text-muted">
            A {formatNaira(85000)} pair of headphones becomes{" "}
            {formatNaira(installmentOf(85000, 4))} a month for four months.
          </p>
        </div>
        <ol className="space-y-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-4 rounded-2xl bg-surface p-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand font-display text-sm font-bold text-brand-ink">
                {i + 1}
              </span>
              <div>
                <h3 className="font-display text-lg font-bold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
