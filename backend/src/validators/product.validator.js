const { z } = require("zod");

const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters")
    .max(150, "Product name cannot exceed 150 characters"),

  sku: z
    .string()
    .trim()
    .min(2, "SKU must be at least 2 characters")
    .max(50, "SKU cannot exceed 50 characters"),

  category: z
    .string()
    .trim()
    .min(2, "Category is required")
    .max(100, "Category cannot exceed 100 characters"),

  unitPrice: z.number().positive("Unit price must be greater than 0"),

  minimumStock: z
    .number()
    .int("Minimum stock must be an integer")
    .min(0, "Minimum stock cannot be negative")
    .optional(),

  warehouseLocation: z
    .string()
    .trim()
    .max(150, "Warehouse location cannot exceed 150 characters")
    .optional()
    .or(z.literal("")),
});

const updateProductSchema = createProductSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required for update",
  });

module.exports = {
  createProductSchema,
  updateProductSchema,
};
