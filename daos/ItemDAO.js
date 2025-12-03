// daos/ItemDAO.js
const db = require('../config/db');

class ItemDAO {
  static async findAll({ category, brand, search, sortBy, sortDir }) {
    let sql = 'SELECT * FROM item WHERE 1=1';
    const params = [];

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (brand) {
      sql += ' AND brand = ?';
      params.push(brand);
    }
    if (search) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (sortBy === 'price') {
      sql += ' ORDER BY price ' + (sortDir === 'desc' ? 'DESC' : 'ASC');
    } else if (sortBy === 'name') {
      sql += ' ORDER BY name ' + (sortDir === 'desc' ? 'DESC' : 'ASC');
    }

    const [rows] = await db.query(sql, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM item WHERE id = ?', [id]);
    return rows[0] || null;
  }
}

module.exports = ItemDAO;
