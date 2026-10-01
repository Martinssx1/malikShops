

CREATE DATABASE IF NOT EXISTS malikshops;
USE malikshops;

-- PRODUCTS: the one place prices live. The backend always reads price
-- from here -- never from anything the client sends.
CREATE TABLE IF NOT EXISTS products (
  id          INT PRIMARY KEY,           -- matches the ids already used in the frontend's data.ts
  name        VARCHAR(255) NOT NULL,
  category    VARCHAR(50)  NOT NULL,
  price       INT NOT NULL,              -- naira (not kobo) -- converted to kobo only when calling Paystack
  active      TINYINT(1) NOT NULL DEFAULT 1  -- set to 0 to retire a product without deleting its order history
);

INSERT INTO products (id, name, category, price) VALUES
  (1,  'Ankara Bomber Jacket',         'Fashion', 38500),
  (2,  'Leather Weekender Bag',        'Fashion', 27000),
  (3,  'Everyday Court Sneakers',      'Fashion', 32000),
  (4,  'Tinted Sunglasses',            'Fashion', 9500),
  (5,  'Noise-Cancelling Headphones',  'Tech',    85000),
  (6,  'Smartwatch Series K',          'Tech',    62000),
  (7,  'Portable Bluetooth Speaker',   'Tech',    24500),
  (8,  'Android Phone 128GB',          'Tech',    210000),
  (9,  'Two-Seater Linen Sofa',        'Home',    320000),
  (10, 'Brass Reading Lamp',           'Home',    18000),
  (11, 'Stoneware Coffee Set',         'Home',    14000),
  (12, 'Shea & Aloe Glow Set',         'Beauty',  11500)
ON DUPLICATE KEY UPDATE
  name = VALUES(name), category = VALUES(category), price = VALUES(price);

-- ORDERS: totals here are always server-computed, never taken from the
-- client. due_today is what Paystack was actually told to charge.
CREATE TABLE IF NOT EXISTS orders (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  paystack_reference  VARCHAR(100) NOT NULL UNIQUE,

  email               VARCHAR(255) NOT NULL,
  customer_name       VARCHAR(255),
  phone               VARCHAR(30),
  address             VARCHAR(500),

  subtotal            INT NOT NULL,          -- naira, sum of product prices x qty
  delivery_fee        INT NOT NULL,          -- naira
  total               INT NOT NULL,          -- naira, subtotal + delivery_fee
  plan_months         TINYINT NOT NULL DEFAULT 0,  -- 0 = paid in full, else 2/3/4
  due_today           INT NOT NULL,          -- naira, what was actually charged now

  status              ENUM('pending', 'paid', 'failed') NOT NULL DEFAULT 'pending',
  paid_at             DATETIME NULL,

  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ORDER_ITEMS: a snapshot of what was in the cart, with the price at the
-- moment of purchase -- so a later price change in `products` never
-- rewrites history.
CREATE TABLE IF NOT EXISTS order_items (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  order_id      INT NOT NULL,
  product_id    INT NOT NULL,
  product_name  VARCHAR(255) NOT NULL,   -- snapshot, in case the product is later renamed
  unit_price    INT NOT NULL,            -- naira, snapshot of products.price at purchase time
  quantity      INT NOT NULL,
  FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

