// daos/AdminDAO.js
const db = require("../config/db");

class AdminDAO {
  static async getSales({ userId, itemId, from, to }) {
    let sql = `
      SELECT
        po.id            AS orderId,
        po.user_id       AS user_id,
        po.total_amount  AS total_amount,
        po.status        AS status,
        po.created_at    AS created_at,

        u.email          AS email,
        u.first_name     AS first_name,
        u.last_name      AS last_name,

        poi.item_id      AS item_id,
        poi.quantity     AS quantity,
        poi.unit_price   AS unit_price,

        i.name           AS item_name,
        i.brand          AS brand
      FROM purchase_order po
      LEFT JOIN user u
        ON po.user_id = u.id
      JOIN purchase_order_item poi
        ON poi.order_id = po.id
      JOIN item i
        ON i.id = poi.item_id
      WHERE 1 = 1
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

  // keep your existing methods (getUsers, getInventory, etc.) as they are
}

module.exports = AdminDAO;
