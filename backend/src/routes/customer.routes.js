const express = require("express");

const customerController = require("../controllers/customer.controller");

const validate = require("../middleware/validation.middleware");

const {
  createCustomerSchema,
  updateCustomerSchema,
} = require("../validators/customer.validator");

const { authenticateToken } = require("../middleware/auth.middleware");

const { requireRole } = require("../middleware/role.middleware");

const router = express.Router();

// Create customer
router.post(
  "/",
  authenticateToken,
  requireRole("ADMIN", "SALES"),
  validate(createCustomerSchema),
  customerController.createCustomer,
);

// Get customers
router.get(
  "/",
  authenticateToken,
  requireRole("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"),
  customerController.getCustomers,
);

// Get customer details
router.get(
  "/:id",
  authenticateToken,
  requireRole("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"),
  customerController.getCustomerById,
);

// Update customer
router.put(
  "/:id",
  authenticateToken,
  requireRole("ADMIN", "SALES"),
  validate(updateCustomerSchema),
  customerController.updateCustomer,
);

module.exports = router;
