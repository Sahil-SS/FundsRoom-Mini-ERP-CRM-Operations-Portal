const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const env = require("./config/env");

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

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "FundsRoom API is running",
    environment: env.nodeEnv,
  });
});

module.exports = app;
