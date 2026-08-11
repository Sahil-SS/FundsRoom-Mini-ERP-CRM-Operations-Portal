const { z } = require("zod");

const movementTypeEnum = z.enum(["IN", "OUT"]);

const createStockMovementSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),

  quantity: z
    .number()
    .int("Quantity must be an integer")
    .positive("Quantity must be greater than 0"),

  type: movementTypeEnum,

  reason: z
    .string()
    .trim()
    .min(1, "Reason is required")
    .max(255, "Reason cannot exceed 255 characters"),
});

module.exports = {
  createStockMovementSchema,
};
