require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const crypto = require("crypto");
app.use(cors());
//app.use(express.json());
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.post("/paystack/webhook", async (req, res) => {
  console.log("webhook running");
  //validate event
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(req.rawBody)
    .digest("hex");
  if (hash == req.headers["x-paystack-signature"]) {
    // Retrieve the request's body
    const event = req.body;
    console.log(event);
    // Do something with event
  }
  res.send(200);
});

app.post("/payment-paystack", async (req, res) => {
  const { email, amount } = req.body;
  try {
    if (!email || !amount)
      return res.status(400).json({ error: "Email and amount are required" });
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
          amount,
        }),
      },
    );
    const data = await response.json();
    if (!response.ok) {
      console.error("Paystack initialization error:", data);
      throw new Error(data.message || "Failed to initialize payment");
    }

    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Error initializing payment:", error);
    return res.status(500).json({ error: "Failed to initialize payment" });
  }
});

app.listen(3000, () => {
  console.log("Backend server is running on port 3000");
});
