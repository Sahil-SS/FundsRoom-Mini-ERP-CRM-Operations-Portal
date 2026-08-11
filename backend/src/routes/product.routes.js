const express = require("express");

const productController = require("../controllers/product.controller");

const validate = require("../middleware/validation.middleware");

const {
  createProductSchema,
  updateProductSchema,
} = require("../validators/product.validator");

const { authenticateToken } = require("../middleware/auth.middleware");

const { requireRole } = require("../middleware/role.middleware");

const router = express.Router();

// Create product
router.post(
  "/",
  authenticateToken,
  requireRole("ADMIN", "WAREHOUSE"),
  validate(createProductSchema),
  productController.createProduct,
);

// List products
router.get(
  "/",
  authenticateToken,
  requireRole("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"),
  productController.getProducts,
);

// Get product details
router.get(
  "/:id",
  authenticateToken,
  requireRole("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"),
  productController.getProductById,
);

// Update product
router.put(
  "/:id",
  authenticateToken,
  requireRole("ADMIN", "WAREHOUSE"),
  validate(updateProductSchema),
  productController.updateProduct,
);

module.exports = router;
