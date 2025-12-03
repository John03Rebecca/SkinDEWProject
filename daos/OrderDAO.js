// daos/OrderDAO.js
const db = require('../config/db');

class OrderDAO {
  /**
   * Create an order + its order_items from the current cart items.
   * items is an array of rows from CartDAO.getCartByUser:
   *   [{ cartId, itemId, quantity, name, price, image_url, inventory }, ...]
   */
  static async createOrder({ userId, items, totalAmount }) {
    // 1) Create order row
    const [orderResult] = await db.query(
      `INSERT INTO purchase_order (user_id, total_amount)
       VALUES (?, ?)`,
      [userId, totalAmount]
    );

    const orderId = orderResult.insertId;

    // 2) Insert order items + update inventory
    for (const item of items) {
      // IMPORTANT: CartDAO calls this field "itemId"
      const itemId = item.itemId;   // <-- this was the bug

      // (Optional safety check)
      if (itemId == null) {
        console.error('Checkout error: itemId missing in cart item:', item);
        throw new Error('Internal error: itemId missing in cart item');
      }

      await db.query(
        `INSERT INTO purchase_order_item (order_id, item_id, quantity, unit_price)
         VALUES (?, ?, ?, ?)`,
        [orderId, itemId, item.quantity, item.price]
      );

      // reduce inventory
      await db.query(
        `UPDATE item
         SET quantity = quantity - ?
         WHERE id = ?`,
        [item.quantity, itemId]
      );
    }

    return orderId;
  }

  static async getOrdersByUser(userId) {
    const [rows] = await db.query(
      `SELECT id, total_amount, created_at, status
       FROM purchase_order
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  }
}

module.exports = OrderDAO;
