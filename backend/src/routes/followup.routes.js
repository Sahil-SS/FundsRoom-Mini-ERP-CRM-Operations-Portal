const express = require("express");

const followUpController = require("../controllers/followup.controller");

const validate = require("../middleware/validation.middleware");

const { createFollowUpSchema } = require("../validators/followup.validator");

const { authenticateToken } = require("../middleware/auth.middleware");

const { requireRole } = require("../middleware/role.middleware");

const router = express.Router();

router.post(
  "/customers/:id/follow-ups",
  authenticateToken,
  requireRole("ADMIN", "SALES"),
  validate(createFollowUpSchema),
  followUpController.createFollowUp,
);

router.get(
  "/customers/:id/follow-ups",
  authenticateToken,
  requireRole("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"),
  followUpController.getCustomerFollowUps,
);

module.exports = router;
