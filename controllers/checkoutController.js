// controllers/checkoutController.js
const db = require("../config/db");
const CartDAO = require("../daos/CartDAO");

function getSessionKey(req) {
  if (!req.session.guest) req.session.guest = true; // force cookie save for guests
  return req.sessionID;
}

const CheckoutController = {
  // POST /api/checkout
  checkout: async (req, res) => {
    const {
      billingName,
      billingStreet,
      billingProvince,
      billingCountry,
      billingZip,
      shippingName,
      shippingStreet,
      shippingProvince,
      shippingCountry,
      shippingZip,
      cardNumber,
    } = req.body;

    if (
      !billingName || !billingStreet || !billingProvince || !billingCountry || !billingZip ||
      !shippingName || !shippingStreet || !shippingProvince || !shippingCountry || !shippingZip ||
      !cardNumber
    ) {
      return res.status(400).json({ message: "Missing required checkout fields" });
    }

    const userId = req.session.userId || null;
    const sessionId = userId ? null : getSessionKey(req);

    try {
      // 1) load cart (user or guest)
      const items = userId
        ? await CartDAO.getCartByUser(userId)
        : await CartDAO.getCartBySession(sessionId);

      if (!items || items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      // 2) inventory validation
      for (const it of items) {
        if (Number(it.quantity) > Number(it.inventory)) {
          return res.status(400).json({
            message: `Not enough inventory for "${it.name}". Requested ${it.quantity}, only ${it.inventory} left.`,
          });
        }
      }

      // 3) fake payment authorization rule
      const digitsOnly = String(cardNumber).replace(/\D/g, "");
      if (!digitsOnly || digitsOnly.length < 4 || digitsOnly.endsWith("0")) {
        return res.status(400).json({ message: "Credit Card Authorization Failed." });
      }

      const conn = await db.getConnection();
      try {
        await conn.beginTransaction();

        const totalAmount = items.reduce(
          (sum, it) => sum + Number(it.price) * Number(it.quantity),
          0
        );

        // 4) create purchase_order (user_id can be NULL)
        const [orderResult] = await conn.query(
          `INSERT INTO purchase_order
           (user_id, total_amount, created_at, status,
            billing_name, billing_street, billing_province, billing_country, billing_zip,
            shipping_name, shipping_street, shipping_province, shipping_country, shipping_zip)
           VALUES (?, ?, NOW(), 'PAID',
                   ?, ?, ?, ?, ?,
                   ?, ?, ?, ?, ?)`,
          [
            userId,
            totalAmount,
            billingName, billingStreet, billingProvince, billingCountry, billingZip,
            shippingName, shippingStreet, shippingProvince, shippingCountry, shippingZip,
          ]
        );

        const orderId = orderResult.insertId;

        // 5) insert purchase_order_item + decrement inventory
        for (const it of items) {
          await conn.query(
            `INSERT INTO purchase_order_item (order_id, item_id, quantity, unit_price)
             VALUES (?, ?, ?, ?)`,
            [orderId, it.itemId, it.quantity, it.price]
          );

          await conn.query(
            `UPDATE item
             SET quantity = quantity - ?
             WHERE id = ?`,
            [it.quantity, it.itemId]
          );
        }

        // 6) clear cart
        if (userId) {
          await conn.query(`DELETE FROM cart_item WHERE user_id = ?`, [userId]);
        } else {
          await conn.query(`DELETE FROM cart_item WHERE session_id = ?`, [sessionId]);
        }

        await conn.commit();

        return res.json({ message: "Order placed successfully", orderId, totalAmount });
      } catch (err) {
        await conn.rollback();
        throw err;
      } finally {
        conn.release();
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error processing checkout" });
    }
  },
};

module.exports = CheckoutController;
