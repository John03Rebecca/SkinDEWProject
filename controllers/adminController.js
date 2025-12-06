// controllers/adminController.js
const AdminDAO = require('../daos/AdminDAO');
const AddressDAO = require('../daos/AddressDAO');
const UserDAO = require('../daos/UserDAO');
const db = require('../config/db');
const bcrypt = require('bcrypt');

/** ---------- middleware: admin guard ---------- */
function requireAdmin(req, res, next) {
  if (!req.session.userId || req.session.isAdmin !== true) {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
}

const AdminController = {
  requireAdmin,

  /** ---------- POST /api/admin/login ---------- */
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
      }

      const [rows] = await db.query(
        `SELECT id, email, password_hash, is_admin
         FROM user
         WHERE email = ?`,
        [email]
      );

      const user = rows[0];
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const ok = await bcrypt.compare(password, user.password_hash);
      if (!ok) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isAdmin = Number(user.is_admin) === 1;
      if (!isAdmin) {
        return res.status(403).json({ message: 'Admin access only' });
      }

      // create admin session
      req.session.userId = user.id;
      req.session.isAdmin = true;

      res.json({ message: 'Admin login successful' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Admin login failed' });
    }
  },

  /** ---------- POST /api/admin/logout ---------- */
  logout: async (req, res) => {
    req.session.destroy(() => {
      res.json({ message: 'Logged out' });
    });
  },

  /** ---------- GET /api/admin/dashboard/stats ---------- */
  getStats: async (req, res) => {
    try {
      const [[revenue]] = await db.query(
        `SELECT COALESCE(SUM(total_amount), 0) AS totalRevenue FROM purchase_order`
      );

      const [[orders]] = await db.query(
        `SELECT COUNT(*) AS orderCount FROM purchase_order`
      );

      const [[customers]] = await db.query(
        `SELECT COUNT(DISTINCT user_id) AS customerCount
         FROM purchase_order
         WHERE user_id IS NOT NULL`
      );

      const [[low]] = await db.query(
        `SELECT COUNT(*) AS lowCount FROM item WHERE quantity <= 5`
      );

      res.json({
        totalRevenue: Number(revenue.totalRevenue || 0),
        orderCount: Number(orders.orderCount || 0),
        customerCount: Number(customers.customerCount || 0),
        lowInventoryCount: Number(low.lowCount || 0),
      });
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      res.status(500).json({ message: 'Error fetching dashboard stats' });
    }
  },

  /** ---------- GET /api/admin/sales?userId=&itemId=&from=&to= ---------- */
  getSales: async (req, res) => {
    try {
      const { userId, itemId, from, to } = req.query;
      const sales = await AdminDAO.getSales({
        userId: userId || null,
        itemId: itemId || null,
        from: from || null,
        to: to || null,
      });
      res.json(sales);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error loading sales history' });
    }
  },

  /** ---------- GET /api/admin/inventory ---------- */
  getInventory: async (req, res) => {
    try {
      const inventory = await AdminDAO.getInventory();
      res.json(inventory);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error loading inventory' });
    }
  },

  /** ---------- POST /api/admin/inventory/update ---------- */
  updateInventory: async (req, res) => {
    try {
      const { itemId, quantity } = req.body;
      if (!itemId || quantity == null) {
        return res.status(400).json({ message: 'itemId and quantity are required' });
      }

      await AdminDAO.updateInventoryQuantity(itemId, quantity);
      res.json({ message: 'Inventory updated' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating inventory' });
    }
  },

  /** ---------- GET /api/admin/users ---------- */
  getUsers: async (req, res) => {
    try {
      const users = await AdminDAO.getUsers();
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error loading users' });
    }
  },

  /** ---------- POST /api/admin/users/update ---------- */
  updateUser: async (req, res) => {
    try {
      const {
        userId,
        firstName,
        lastName,
        street,
        province,
        country,
        zip,
        phone,
      } = req.body;

      if (!userId || !firstName || !lastName) {
        return res
          .status(400)
          .json({ message: 'userId, firstName, lastName are required' });
      }

      const user = await UserDAO.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // update user name
      await AdminDAO.updateUserBasic(userId, { firstName, lastName });

      // update/create address if provided
      if (street && province && country && zip) {
        if (user.address_id) {
          // update existing address
          await AddressDAO.update(user.address_id, {
            street,
            province,
            country,
            zip,
            phone,
          });
        } else {
          // create new address + link to user
          const newAddressId = await AddressDAO.create({
            street,
            province,
            country,
            zip,
            phone,
          });
          await db.query(
            'UPDATE user SET address_id = ? WHERE id = ?',
            [newAddressId, userId]
          );
        }
      }

      res.json({ message: 'User updated' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating user' });
    }
  },
};

module.exports = AdminController;
