// controllers/authController.js
const bcrypt = require('bcrypt');
const UserDAO = require('../daos/UserDAO');
const AddressDAO = require('../daos/AddressDAO');

// ✅ Password strength helper
// At least 8 chars, 1 lower, 1 upper, 1 number, 1 special character
function isStrongPassword(password) {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
  return re.test(password);
}

const AuthController = {
  register: async (req, res) => {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        street,
        province,
        country,
        zip,
        phone
      } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // ✅ NEW: enforce strong password
      if (!isStrongPassword(password)) {
        return res.status(400).json({
          message:
            'Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.'
        });
      }

      const existing = await UserDAO.findByEmail(email);
      if (existing) {
        return res.status(409).json({ message: 'Email already registered' });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const addressId = await AddressDAO.create({
        street: street || "Not provided",
        province: province || "Not provided",
        country: country || "Not provided",
        zip: zip || "00000",
        phone: phone || "0000000000"
      });

      const userId = await UserDAO.create({
        email,
        passwordHash,
        firstName,
        lastName,
        addressId
      });

      // store in session
      req.session.userId = userId;
      req.session.isAdmin = false;

      res.status(201).json({ message: 'Registered successfully', userId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error during registration' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await UserDAO.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      req.session.userId = user.id;
      req.session.isAdmin = !!user.is_admin;

      res.json({ message: 'Logged in', userId: user.id, isAdmin: !!user.is_admin });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error during login' });
    }
  },

  logout: (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error logging out' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out' });
    });
  },

  me: async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(200).json({ loggedIn: false });
      }

      const user = await UserDAO.findById(req.session.userId);
      if (!user) {
        return res.status(200).json({ loggedIn: false });
      }

      res.json({
        loggedIn: true,
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        isAdmin: !!user.is_admin
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching current user' });
    }
  }
};

module.exports = AuthController;
