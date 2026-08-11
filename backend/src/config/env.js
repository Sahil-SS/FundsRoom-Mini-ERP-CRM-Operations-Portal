require("dotenv").config();

const requiredEnvVariables = ["DATABASE_URL", "JWT_SECRET"];

for (const variable of requiredEnvVariables) {
  if (!process.env[variable]) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
}

const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  databaseUrl: process.env.DATABASE_URL,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",

  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
};

module.exports = env;
