// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/adminController");

// login/logout (unprotected)
router.post("/login", AdminController.login);
router.post("/logout", AdminController.logout);

// DASHBOARD STATS (for overview tab)
router.get(
  "/dashboard/stats",
  AdminController.requireAdmin,
  AdminController.getStats
);

// sales history
router.get(
  "/sales",
  AdminController.requireAdmin,
  AdminController.getSales
);

// inventory
router.get(
  "/inventory",
  AdminController.requireAdmin,
  AdminController.getInventory
);
router.post(
  "/inventory/update",
  AdminController.requireAdmin,
  AdminController.updateInventory
);

// users
router.get(
  "/users",
  AdminController.requireAdmin,
  AdminController.getUsers
);
router.post(
  "/users/update",
  AdminController.requireAdmin,
  AdminController.updateUser
);

module.exports = router;
