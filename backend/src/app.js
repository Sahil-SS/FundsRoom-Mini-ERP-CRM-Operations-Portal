const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const env = require("./config/env");

const authRoutes = require("./routes/auth.routes");
const errorHandler = require("./middleware/error.middleware");
const testRoutes = require("./routes/test.routes");
const customerRoutes = require("./routes/customer.routes");
const followUpRoutes = require("./routes/followup.routes");

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  }),
);

// Request body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api", followUpRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "FundsRoom API is running",
    environment: env.nodeEnv,
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
