// routes/profileRoutes.js
const express = require("express");
const router = express.Router();
const ProfileController = require("../controllers/profileController");

router.get("/", ProfileController.getProfile);
router.put("/update", ProfileController.updateProfile);
router.put("/password", ProfileController.updatePassword);
router.put("/address", ProfileController.updateAddress);
router.get("/payment", ProfileController.getPaymentMethod);
router.put("/payment", ProfileController.updatePaymentMethod);

module.exports = router;

