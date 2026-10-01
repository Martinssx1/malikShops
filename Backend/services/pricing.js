// pricing.js
// Server-side mirror of the pricing rules in the frontend's src/data.ts.
// Keep these two in sync if you ever change the numbers on the frontend.

const DELIVERY_FEE = 2500;
const FREE_DELIVERY_FROM = 50000;
const MIN_PLAN_ORDER = 20000;
const PLAN_OPTIONS = [2, 3, 4];

/** Rounds an instalment up to the nearest naira100, same as the frontend. */
function installmentOf(total, months) {
  return Math.ceil(total / months / 100) * 100;
}

/**
 * Computes every number the order needs, from server-trusted unit prices.
 * `items` here must already have {unit_price, quantity} looked up from the
 * products table -- never from anything the client sent.
 */
function computeTotals(items, planMonths) {
  const subtotal = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
  const delivery =
    subtotal === 0 || subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  const months = Number(planMonths) || 0;

  if (months && (!PLAN_OPTIONS.includes(months) || total < MIN_PLAN_ORDER)) {
    // Client asked for a plan that isn't actually allowed for this order --
    // fall back to paying in full rather than trusting the request.
    return { subtotal, delivery, total, planMonths: 0, dueToday: total };
  }

  const dueToday = months ? installmentOf(total, months) : total;
  return { subtotal, delivery, total, planMonths: months, dueToday };
}

module.exports = {
  DELIVERY_FEE,
  FREE_DELIVERY_FROM,
  MIN_PLAN_ORDER,
  PLAN_OPTIONS,
  installmentOf,
  computeTotals,
};
