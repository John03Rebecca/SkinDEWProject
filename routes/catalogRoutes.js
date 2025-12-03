// routes/catalogRoutes.js
const express = require("express");
const router = express.Router();
const CatalogController = require("../controllers/catalogController");

router.get("/", CatalogController.listItems);
router.get("/:id", CatalogController.getItem); // ✅ must match the name

module.exports = router;
