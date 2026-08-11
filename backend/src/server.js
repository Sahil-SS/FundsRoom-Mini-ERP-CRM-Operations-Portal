const app = require("./app");
const env = require("./config/env");

const server = app.listen(env.port, () => {
  console.log(`FundsRoom API running on http://localhost:${env.port}`);
  console.log(`Environment: ${env.nodeEnv}`);
});

// Handle unexpected errors
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  server.close(() => {
    process.exit(1);
  });
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
  server.close(() => {
    process.exit(1);
  });
});
