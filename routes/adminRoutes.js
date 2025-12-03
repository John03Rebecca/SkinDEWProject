// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/adminController");

// optional: protect all admin routes
// router.use(AdminController.requireAdmin);

// login/logout
router.post("/login", AdminController.login);
router.post("/logout", AdminController.logout);

// sales history
router.get("/sales", AdminController.requireAdmin, AdminController.getSales);

// inventory
router.get("/inventory", AdminController.requireAdmin, AdminController.getInventory);
router.post("/inventory/update", AdminController.requireAdmin, AdminController.updateInventory);

// users
router.get("/users", AdminController.requireAdmin, AdminController.getUsers);
router.post("/users/update", AdminController.requireAdmin, AdminController.updateUser);

module.exports = router;
