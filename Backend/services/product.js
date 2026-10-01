// products.js
// The backend's only source of truth for price. Never trust a price or
// amount sent by the client -- always look it up here.

const pool = require("../config/db");

/**
 * Looks up active products by id. Returns only the ones that exist and
 * are active, so a stale/retired/fake product id is simply dropped rather
 * than trusted.
 */
async function getProductsByIds(ids) {
  if (!ids.length) return [];
  const [rows] = await pool.query(
    `SELECT id, name, category, price FROM products WHERE id IN (?) AND active = 1`,
    [ids],
  );
  return rows;
}

module.exports = { getProductsByIds };
