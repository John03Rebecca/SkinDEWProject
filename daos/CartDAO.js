// daos/CartDAO.js
const db = require("../config/db");

class CartDAO {
  static async getCartByUser(userId) {
    const [rows] = await db.query(
      `SELECT c.item_id AS itemId, c.quantity,
              i.name, i.price, i.image_url, i.brand, i.quantity AS inventory
       FROM cart_item c
       JOIN item i ON c.item_id = i.id
       WHERE c.user_id = ?`,
      [userId]
    );
    return rows;
  }

  static async getCartBySession(sessionId) {
    const [rows] = await db.query(
      `SELECT c.item_id AS itemId, c.quantity,
              i.name, i.price, i.image_url, i.brand, i.quantity AS inventory
       FROM cart_item c
       JOIN item i ON c.item_id = i.id
       WHERE c.session_id = ?`,
      [sessionId]
    );
    return rows;
  }

  static async addOrUpdateForUser(userId, itemId, quantity) {
    await db.query(
      `INSERT INTO cart_item (user_id, item_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)`,
      [userId, itemId, quantity]
    );
  }

  static async addOrUpdateForSession(sessionId, itemId, quantity) {
    await db.query(
      `INSERT INTO cart_item (session_id, item_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)`,
      [sessionId, itemId, quantity]
    );
  }

  static async removeForUser(userId, itemId) {
    await db.query(`DELETE FROM cart_item WHERE user_id = ? AND item_id = ?`, [
      userId,
      itemId,
    ]);
  }

  static async removeForSession(sessionId, itemId) {
    await db.query(`DELETE FROM cart_item WHERE session_id = ? AND item_id = ?`, [
      sessionId,
      itemId,
    ]);
  }

  static async clearForUser(userId) {
    await db.query(`DELETE FROM cart_item WHERE user_id = ?`, [userId]);
  }

  static async clearForSession(sessionId) {
    await db.query(`DELETE FROM cart_item WHERE session_id = ?`, [sessionId]);
  }
}

module.exports = CartDAO;
