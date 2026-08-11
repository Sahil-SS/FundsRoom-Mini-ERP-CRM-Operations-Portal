const express = require("express");

const customerController = require("../controllers/customer.controller");
const validate = require("../middleware/validation.middleware");
const { createCustomerSchema } = require("../validators/customer.validator");

const { authenticateToken } = require("../middleware/auth.middleware");

const { requireRole } = require("../middleware/role.middleware");

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  requireRole("ADMIN", "SALES"),
  validate(createCustomerSchema),
  customerController.createCustomer,
);

module.exports = router;
