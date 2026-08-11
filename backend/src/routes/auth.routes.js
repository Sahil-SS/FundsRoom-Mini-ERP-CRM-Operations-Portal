const express = require("express");

const authController = require("../controllers/auth.controller");
const validate = require("../middleware/validation.middleware");
const { loginSchema } = require("../validators/auth.validator");

const router = express.Router();

router.post("/login", validate(loginSchema), authController.login);

module.exports = router;
