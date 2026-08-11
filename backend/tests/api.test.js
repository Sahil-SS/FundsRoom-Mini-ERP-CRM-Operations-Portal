const request = require("supertest");

const app = require("../src/app");

describe("FundsRoom API", () => {
  describe("Health Check", () => {
    test("GET /api/health should return 200", async () => {
      const response = await request(app).get("/api/health");

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("FundsRoom API is running");
    });
  });

  describe("Authentication", () => {
    test("POST /api/auth/login should login with valid credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "admin@fundsroom.local",
        password: "Admin@123",
      });

      expect(response.statusCode).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.data).toHaveProperty("token");

      expect(response.body.data).toHaveProperty("user");

      expect(response.body.data.user).toHaveProperty("id");

      expect(response.body.data.user).toHaveProperty("email");

      expect(response.body.data.user).toHaveProperty("role");
    });

    test("POST /api/auth/login should reject invalid password", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "admin@fundsroom.local",
        password: "WrongPassword123",
      });

      expect(response.statusCode).toBe(401);

      expect(response.body.success).toBe(false);

      expect(response.body.message).toBe("Invalid email or password");
    });

    test("POST /api/auth/login should reject nonexistent user", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "doesnotexist@fundsroom.local",
        password: "Admin@123",
      });

      expect(response.statusCode).toBe(401);

      expect(response.body.success).toBe(false);

      expect(response.body.message).toBe("Invalid email or password");
    });

    test("POST /api/auth/login should reject missing email", async () => {
      const response = await request(app).post("/api/auth/login").send({
        password: "Admin@123",
      });

      expect(response.statusCode).toBe(400);

      expect(response.body.success).toBe(false);
    });

    test("POST /api/auth/login should reject missing password", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "admin@fundsroom.local",
      });

      expect(response.statusCode).toBe(400);

      expect(response.body.success).toBe(false);
    });
  });
});
