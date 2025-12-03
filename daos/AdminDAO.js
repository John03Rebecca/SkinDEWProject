// daos/AdminDAO.js
const db = require("../config/db");

class AdminDAO {
  // --- SALES HISTORY ---
  // GET /api/admin/sales?userId=&itemId=&from=&to=
  static async getSales({ userId, itemId, from, to }) {
    let sql = `
      SELECT
        po.id AS orderId,
        po.user_id AS userId,
        COALESCE(u.email, 'Guest') AS userEmail,
        po.total_amount AS totalAmount,
        po.created_at AS createdAt,
        po.status AS status,
        i.name AS productName,
        poi.quantity AS quantity,
        poi.unit_price AS unitPrice
      FROM purchase_order po
      LEFT JOIN user u ON u.id = po.user_id
      JOIN purchase_order_item poi ON poi.order_id = po.id
      JOIN item i ON i.id = poi.item_id
      WHERE 1=1
    `;
    const params = [];

    if (userId) {
      sql += ` AND po.user_id = ?`;
      params.push(Number(userId));
    }
    if (itemId) {
      sql += ` AND poi.item_id = ?`;
      params.push(Number(itemId));
    }
    if (from) {
      sql += ` AND po.created_at >= ?`;
      params.push(from);
    }
    if (to) {
      sql += ` AND po.created_at <= ?`;
      params.push(to);
    }

    sql += ` ORDER BY po.created_at DESC, po.id DESC`;

    const [rows] = await db.query(sql, params);
    return rows;
  }

  // --- INVENTORY ---
  // GET /api/admin/inventory
  static async getInventory() {
    const [rows] = await db.query(`
      SELECT
        id,
        name,
        brand,
        category,
        price,
        quantity,
        image_url
      FROM item
      ORDER BY name ASC
    `);
    return rows;
  }

  // POST /api/admin/inventory/update  { itemId, quantity }
  static async updateInventoryQuantity(itemId, quantity) {
    await db.query(`UPDATE item SET quantity = ? WHERE id = ?`, [
      Number(quantity),
      Number(itemId),
    ]);
  }

  // --- USERS ---
  // GET /api/admin/users
  static async getUsers() {
    const [rows] = await db.query(`
      SELECT
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        u.address_id
      FROM user u
      ORDER BY u.id DESC
    `);
    return rows;
  }

  // used by AdminController.updateUser
  static async updateUserBasic(userId, { firstName, lastName }) {
    await db.query(
      `UPDATE user SET first_name = ?, last_name = ? WHERE id = ?`,
      [firstName, lastName, Number(userId)]
    );
  }
}

module.exports = AdminDAO;
