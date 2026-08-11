const express = require("express");

const { authenticateToken } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");

const router = express.Router();

router.get("/protected", authenticateToken, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "You have access to this protected endpoint",
    user: req.user,
  });
});

router.get(
  "/admin-only",
  authenticateToken,
  requireRole("ADMIN"),
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "You have admin access",
      user: req.user,
    });
  },
);

router.get(
  "/sales-only",
  authenticateToken,
  requireRole("SALES"),
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "You have sales access",
      user: req.user,
    });
  },
);

module.exports = router;
