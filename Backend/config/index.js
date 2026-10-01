require("dotenv").config();
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const {
  createPendingOrder,
  markOrderPaid,
  markOrderFailed,
} = require("../services/orders");
const { getProductsByIds } = require("../services/product");
const { computeTotals } = require("../services/pricing");

const app = express();

app.use(
  cors({
    origin: "https://malikshopsfrontend.vercel.app",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.post("/paystack/webhook", async (req, res) => {
  //validate event

  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(req.rawBody)
    .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    return res.sendStatus(401);
  }

  const event = req.body;

  try {
    if (event.event === "charge.success") {
      await markOrderPaid(event);
      // console.log("order marked as paid:", event.data.reference);
    } else if (event.event === "charge.failed") {
      await markOrderFailed(event.data.reference);
      console.log("order marked as failed:", event.data.reference);
    }
  } catch (err) {
    console.error("Error saving webhook event:", err);
  }

  res.sendStatus(200);
});

// The client sends WHAT is in the cart (product ids + quantities).
// It never sends a price or an amount -- the server looks those up itself.
app.post("/payment-paystack", async (req, res) => {
  //doesnt need amount from frontend will check backend
  const { email, customer_name, phone, address, items, plan_months } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart items are required" });
    }

    const requestedIds = items.map((i) => Number(i.product.id));
    const products = await getProductsByIds(requestedIds);

    if (products.length !== new Set(requestedIds).size) {
      // Some id in the cart doesn't exist, or is no longer active.
      return res
        .status(400)
        .json({ error: "One or more items are no longer available" });
    }

    const priceById = new Map(products.map((p) => [p.id, p]));

    const orderItems = items.map((i) => {
      const product = priceById.get(Number(i.product.id));

      const quantity = Math.max(1, Math.floor(Number(i.qty)) || 1);
      return {
        product_id: product.id,
        name: product.name,
        unit_price: product.price, // from the DB, never from the client
        quantity,
      };
    });

    const { subtotal, delivery, total, planMonths, dueToday } = computeTotals(
      orderItems,
      plan_months,
    );

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: dueToday * 100, // kobo -- computed server-side, not from req.body
          metadata: {
            customer_name,
            phone,
            address,
            order_total: total,
            plan_months: planMonths,
          },
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Paystack initialization error:", data);
      throw new Error(data.message || "Failed to initialize payment");
    }

    await createPendingOrder({
      reference: data.data.reference,
      email,
      customer_name,
      phone,
      address,
      subtotal,
      delivery,
      total,
      planMonths,
      dueToday,
      items: orderItems,
    });

    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Error initializing payment:", error);
    return res
      .status(500)
      .json({ message: "Failed to initialize payment", error: error.message });
  }
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
