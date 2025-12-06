// daos/AddressDAO.js
const db = require("../config/db");

class AddressDAO {
  static async create({
    street = "Not provided",
    province = "Not provided",
    country = "Not provided",
    zip = "00000",
    phone = "0000000000",
  }) {
    const [result] = await db.query(
      `INSERT INTO address (street, province, country, zip, phone)
       VALUES (?, ?, ?, ?, ?)`,
      [street, province, country, zip, phone]
    );

    return result.insertId;
  }

  // 🔹 NEW: update existing address
  static async update(id, {
    street = "Not provided",
    province = "Not provided",
    country = "Not provided",
    zip = "00000",
    phone = "0000000000",
  }) {
    const [result] = await db.query(
      `UPDATE address
       SET street = ?, province = ?, country = ?, zip = ?, phone = ?
       WHERE id = ?`,
      [street, province, country, zip, phone, id]
    );

    return result.affectedRows;
  }
}

module.exports = AddressDAO;
