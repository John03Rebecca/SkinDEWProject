// controllers/cartController.js
const CartDAO = require("../daos/CartDAO");

// helper
function getSessionKey(req) {
  // Force session to be saved for guests so browser receives connect.sid cookie
  if (!req.session.guest) {
    req.session.guest = true; // marks session as modified so cookie is issued
  }
  return req.sessionID;
}

const CartController = {
  getCart: async (req, res) => {
    try {
      if (req.session.userId) {
        const items = await CartDAO.getCartByUser(req.session.userId);
        return res.json(items);
      }

      // guest cart
      const sessionId = getSessionKey(req);
      const items = await CartDAO.getCartBySession(sessionId);
      return res.json(items);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error loading cart" });
    }
  },

  add: async (req, res) => {
    try {
      const { itemId, quantity } = req.body;
      if (itemId == null || quantity == null) {
        return res.status(400).json({ message: "itemId and quantity required" });
      }

      if (req.session.userId) {
        await CartDAO.addOrUpdateForUser(
          req.session.userId,
          Number(itemId),
          Number(quantity)
        );
        return res.json({ message: "Item added to cart" });
      }

      // guest cart
      const sessionId = getSessionKey(req);
      await CartDAO.addOrUpdateForSession(sessionId, Number(itemId), Number(quantity));
      return res.json({ message: "Item added to cart (guest)" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error adding to cart" });
    }
  },

  remove: async (req, res) => {
    try {
      const itemId = Number(req.params.itemId);
      if (!Number.isInteger(itemId) || itemId <= 0) {
        return res.status(400).json({ message: "Invalid itemId" });
      }

      if (req.session.userId) {
        await CartDAO.removeForUser(req.session.userId, itemId);
        return res.json({ message: "Item removed" });
      }

      const sessionId = getSessionKey(req);
      await CartDAO.removeForSession(sessionId, itemId);
      return res.json({ message: "Item removed (guest)" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error removing item" });
    }
  },
};

module.exports = CartController;
