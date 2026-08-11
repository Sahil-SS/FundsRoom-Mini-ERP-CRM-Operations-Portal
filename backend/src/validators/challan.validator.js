const { z } = require("zod");

const challanItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),

  quantity: z
    .number()
    .int("Quantity must be an integer")
    .positive("Quantity must be greater than 0"),
});

const createChallanSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),

  items: z.array(challanItemSchema).min(1, "At least one product is required"),
});
module.exports = {
  createChallanSchema,
};
