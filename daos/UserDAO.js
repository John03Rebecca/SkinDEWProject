// daos/UserDAO.js
const db = require('../config/db');

class UserDAO {
  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
    return rows[0] || null;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM user WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async create({ email, passwordHash, firstName, lastName, addressId, isAdmin = false }) {
    const [result] = await db.query(
      `INSERT INTO user (email, password_hash, first_name, last_name, address_id, is_admin)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [email, passwordHash, firstName, lastName, addressId, isAdmin]
    );
    return result.insertId;
  }

  static async updateProfile(id, { firstName, lastName }) {
    await db.query(
      `UPDATE user
       SET first_name = ?, last_name = ?
       WHERE id = ?`,
      [firstName, lastName, id]
    );
  }
}

module.exports = UserDAO;
