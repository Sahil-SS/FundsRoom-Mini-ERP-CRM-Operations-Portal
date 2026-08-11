const express = require("express");

const inventoryController = require("../controllers/inventory.controller");

const validate = require("../middleware/validation.middleware");

const {
  createStockMovementSchema,
} = require("../validators/inventory.validator");

const { authenticateToken } = require("../middleware/auth.middleware");

const { requireRole } = require("../middleware/role.middleware");

const router = express.Router();

// Create stock movement
router.post(
  "/movements",
  authenticateToken,
  requireRole("ADMIN", "WAREHOUSE"),
  validate(createStockMovementSchema),
  inventoryController.createStockMovement,
);

// Get all stock movements
router.get(
  "/movements",
  authenticateToken,
  requireRole("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"),
  inventoryController.getStockMovements,
);

// Get stock movement by ID
router.get(
  "/movements/:id",
  authenticateToken,
  requireRole("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"),
  inventoryController.getStockMovementById,
);

// Get movements for a product
router.get(
  "/products/:productId/stock-movements",
  authenticateToken,
  requireRole("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"),
  inventoryController.getProductStockMovements,
);

module.exports = router;
