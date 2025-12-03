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
    // This assumes your address table has these columns:
    // (street, province, country, zip, phone)
    const [result] = await db.query(
      `INSERT INTO address (street, province, country, zip, phone)
       VALUES (?, ?, ?, ?, ?)`,
      [street, province, country, zip, phone]
    );

    return result.insertId;
  }
}

module.exports = AddressDAO;
