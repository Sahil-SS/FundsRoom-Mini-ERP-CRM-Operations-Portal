const app = require("./app");
const env = require("./config/env");

const { connectDatabase, disconnectDatabase } = require("./config/database");

const startServer = async () => {
  await connectDatabase();

  const server = app.listen(env.port, () => {
    console.log(`FundsRoom API running on http://localhost:${env.port}`);

    console.log(`Environment: ${env.nodeEnv}`);
  });

  const shutdown = async () => {
    console.log("Shutting down server...");

    server.close(async () => {
      await disconnectDatabase();

      console.log("Database connection closed");

      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1);
  });

  process.on("unhandledRejection", (error) => {
    console.error("Unhandled Rejection:", error);
    process.exit(1);
  });
};

startServer();
