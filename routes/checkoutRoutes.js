// routes/checkoutRoutes.js
const express = require("express");
const router = express.Router();
const CheckoutController = require("../controllers/checkoutController");

// POST /api/checkout
router.post("/", CheckoutController.checkout);

module.exports = router;
