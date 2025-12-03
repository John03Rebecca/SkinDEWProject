// controllers/profileController.js
const db = require("../config/db");
const OrderDAO = require("../daos/OrderDAO");

// Helper to fetch user + address
async function loadUserWithAddress(userId) {
  const [userRows] = await db.query(
    `SELECT id, first_name, last_name, email, address_id
     FROM user
     WHERE id = ?`,
    [userId]
  );

  const user = userRows[0];
  if (!user) return null;

  let address = null;

  if (user.address_id) {
    const [addrRows] = await db.query(
      `SELECT id, street, province, country, zip, phone
       FROM address
       WHERE id = ?`,
      [user.address_id]
    );
    address = addrRows[0] || null;
  }

  return { user, address };
}

const ProfileController = {
  // GET /api/profile
  getProfile: async (req, res) => {
    try {
      if (!req.session.userId) return res.status(401).json({});

      const userId = req.session.userId;
      const result = await loadUserWithAddress(userId);
      if (!result) return res.status(404).json({ message: "User not found" });

      const { user, address } = result;
      const orders = await OrderDAO.getOrdersByUser(userId);

      res.json({
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        address,
        orders
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error loading profile" });
    }
  },

  // PUT /api/profile/update  { firstName, lastName }
  updateProfile: async (req, res) => {
    try {
      if (!req.session.userId) return res.status(401).json({ message: "Not logged in" });

      const { firstName, lastName } = req.body;
      if (!firstName || !lastName) {
        return res.status(400).json({ message: "First and last name required" });
      }

      await db.query(
        `UPDATE user SET first_name = ?, last_name = ? WHERE id = ?`,
        [firstName, lastName, req.session.userId]
      );

      res.json({ message: "Profile updated" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error updating profile" });
    }
  },

  // PUT /api/profile/password  { password }
  updatePassword: async (req, res) => {
    try {
      if (!req.session.userId) return res.status(401).json({ message: "Not logged in" });

      const { password } = req.body;
      if (!password) return res.status(400).json({ message: "Password required" });

      await db.query(
        `UPDATE user SET password_hash = ? WHERE id = ?`,
        [password, req.session.userId]
      );

      res.json({ message: "Password updated" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error updating password" });
    }
  },

  // PUT /api/profile/address { street, province, country, zip, phone }
  updateAddress: async (req, res) => {
    try {
      if (!req.session.userId) return res.status(401).json({ message: "Not logged in" });

      const { street, province, country, zip, phone } = req.body;
      if (!street || !province || !country || !zip) {
        return res.status(400).json({ message: "Street, province, country, zip required" });
      }

      const userId = req.session.userId;
      const result = await loadUserWithAddress(userId);
      if (!result) return res.status(404).json({ message: "User not found" });

      const { address } = result;

      if (!address) {
        const [addrInsert] = await db.query(
          `INSERT INTO address (street, province, country, zip, phone)
           VALUES (?, ?, ?, ?, ?)`,
          [street, province, country, zip, phone || null]
        );
        const addrId = addrInsert.insertId;

        await db.query(
          `UPDATE user SET address_id = ? WHERE id = ?`,
          [addrId, userId]
        );
      } else {
        await db.query(
          `UPDATE address
           SET street = ?, province = ?, country = ?, zip = ?, phone = ?
           WHERE id = ?`,
          [street, province, country, zip, phone || null, address.id]
        );
      }

      res.json({ message: "Address updated" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error updating address" });
    }
  },

  // GET /api/profile/payment
  getPaymentMethod: async (req, res) => {
    try {
      if (!req.session.userId) return res.status(401).json({ message: "Not logged in" });

      const userId = req.session.userId;
      const [rows] = await db.query(
        `SELECT cardholder_name, brand, last4, exp_month, exp_year
         FROM payment_method
         WHERE user_id = ?`,
        [userId]
      );

      res.json({ payment: rows[0] || null });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error loading payment method" });
    }
  },

  // PUT /api/profile/payment
  updatePaymentMethod: async (req, res) => {
    try {
      if (!req.session.userId) return res.status(401).json({ message: "Not logged in" });

      const userId = req.session.userId;
      const { cardholderName, brand, last4, expMonth, expYear } = req.body;

      if (!cardholderName || !brand || !last4 || !expMonth || !expYear) {
        return res.status(400).json({ message: "All payment fields are required" });
      }

      if (!/^\d{4}$/.test(String(last4))) {
        return res.status(400).json({ message: "last4 must be exactly 4 digits" });
      }

      const month = Number(expMonth);
      const year = Number(expYear);

      if (!Number.isInteger(month) || month < 1 || month > 12) {
        return res.status(400).json({ message: "expMonth must be 1-12" });
      }
      if (!Number.isInteger(year) || year < 2020 || year > 2100) {
        return res.status(400).json({ message: "expYear must be a 4-digit year" });
      }

      await db.query(
        `INSERT INTO payment_method (user_id, cardholder_name, brand, last4, exp_month, exp_year)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           cardholder_name = VALUES(cardholder_name),
           brand = VALUES(brand),
           last4 = VALUES(last4),
           exp_month = VALUES(exp_month),
           exp_year = VALUES(exp_year)`,
        [userId, cardholderName, brand, last4, month, year]
      );

      res.json({ message: "Payment method updated" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error updating payment method" });
    }
  }
};

module.exports = ProfileController;
