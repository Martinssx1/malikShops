# MalikShops

A full-stack ecommerce application built to learn how frontend,
backend, database, and payment systems work together.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

### Backend

- Node.js
- Express
- MySQL

### Payments

- Paystack

## Project Structure

malikShops/
├── Backend/
│ ├── config/
│ ├── services/
│ ├── index.js
│ └── schema.sql
│
├── Frontend/
│ └── src/
│
└── README.md

## Database

The MySQL schema is located in `Backend/schema.sql`.

The database contains:

- Products
- Orders
- Order items

## Payment Flow

1. Customer adds products to the cart.
2. Frontend sends product IDs and quantities to the backend.
3. Backend retrieves product prices from MySQL.
4. Backend calculates the order total.
5. Backend creates a pending order.
6. Backend initializes the Paystack transaction.
7. Customer completes payment through Paystack.
8. Paystack sends a webhook to the backend.
9. Backend verifies the webhook signature.
10. The order is marked as paid.
