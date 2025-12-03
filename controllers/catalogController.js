// controllers/catalogController.js
const ItemDAO = require("../daos/ItemDAO");

const CatalogController = {
  // GET /api/catalog
  listItems: async (req, res) => {
    try {
      const { category, brand, search, sortBy, sortDir } = req.query;
      const items = await ItemDAO.findAll({ category, brand, search, sortBy, sortDir });
      res.json(items);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error loading catalog" });
    }
  },

  // GET /api/catalog/:id
  getItem: async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "Invalid item id" });
      }

      const item = await ItemDAO.findById(id);
      if (!item) return res.status(404).json({ message: "Item not found" });

      res.json(item);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error loading item" });
    }
  },
};

module.exports = CatalogController;
