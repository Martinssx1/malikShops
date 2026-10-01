// orders.js
// Every database write for an order goes through one of these functions,
// so there's a single place that knows the table shape. All totals passed
// in here are expected to already be server-computed (see pricing.js) --
// nothing in this file trusts a price from the client.

const pool = require("../config/db");

/**
 * Creates a pending order plus its line items, in one transaction so an
 * order is never left half-written if something fails partway through.
 */
async function createPendingOrder({
  reference,
  email,
  customer_name,
  phone,
  address,
  subtotal,
  delivery,
  total,
  planMonths,
  dueToday,
  items, // [{ product_id, name, unit_price, quantity }]
}) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      `INSERT INTO orders
         (paystack_reference, email, customer_name, phone, address,
          subtotal, delivery_fee, total, plan_months, due_today, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        reference,
        email,
        customer_name || null,
        phone || null,
        address || null,
        subtotal,
        delivery,
        total,
        planMonths,
        dueToday,
      ],
    );
    const orderId = result.insertId;

    for (const item of items) {
      await conn.query(
        `INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.name, item.unit_price, item.quantity],
      );
    }

    await conn.commit();
    return orderId;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

/**
 * Called from the webhook when Paystack confirms a charge.success event.
 * The order should already exist (created above) -- this just flips it to
 * paid. If Paystack's charged amount doesn't match what we told it to
 * charge, that's logged as a red flag rather than silently accepted.
 */
async function markOrderPaid(event) {
  const reference = event.data.reference;
  const paidKobo = event.data.amount;

  const [rows] = await pool.query(
    `SELECT due_today FROM orders WHERE paystack_reference = ?`,
    [reference],
  );

  if (rows.length === 0) {
    console.warn(`Webhook for unknown order reference: ${reference}`);
    return;
  }

  const expectedKobo = rows[0].due_today * 100;
  if (paidKobo !== expectedKobo) {
    console.warn(
      `Amount mismatch on ${reference}: expected ${expectedKobo} kobo, Paystack charged ${paidKobo} kobo`,
    );
  }

  await pool.query(
    `UPDATE orders SET status = 'paid', paid_at = NOW() WHERE paystack_reference = ?`,
    [reference],
  );
}

async function markOrderFailed(reference) {
  await pool.query(
    `UPDATE orders SET status = 'failed' WHERE paystack_reference = ?`,
    [reference],
  );
}

module.exports = { createPendingOrder, markOrderPaid, markOrderFailed };
