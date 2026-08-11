const express = require("express");

const dashboardController = require("../controllers/dashboard.controller");

const { authenticateToken } = require("../middleware/auth.middleware");

const { requireRole } = require("../middleware/role.middleware");

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  requireRole("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"),
  dashboardController.getDashboard,
);

module.exports = router;
