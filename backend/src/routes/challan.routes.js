const express = require("express");

const challanController = require("../controllers/challan.controller");

const validate = require("../middleware/validation.middleware");

const { createChallanSchema } = require("../validators/challan.validator");

const { authenticateToken } = require("../middleware/auth.middleware");

const { requireRole } = require("../middleware/role.middleware");

const router = express.Router();

// Create challan
router.post(
  "/",
  authenticateToken,
  requireRole("ADMIN", "SALES"),
  validate(createChallanSchema),
  challanController.createChallan,
);

// List challans
router.get(
  "/",
  authenticateToken,
  requireRole("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"),
  challanController.getChallans,
);

// Confirm challan
router.post(
  "/:id/confirm",
  authenticateToken,
  requireRole("ADMIN", "SALES"),
  challanController.confirmChallan,
);

// Get challan details
router.get(
  "/:id",
  authenticateToken,
  requireRole("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"),
  challanController.getChallanById,
);

module.exports = router;
