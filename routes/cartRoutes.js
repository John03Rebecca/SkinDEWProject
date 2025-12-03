const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');

// GET /api/cart → view cart
router.get('/', CartController.getCart);

// POST /api/cart/add → add/update
router.post('/add', CartController.add);

// DELETE /api/cart/remove/:itemId → remove item
router.delete('/remove/:itemId', CartController.remove);

module.exports = router;
