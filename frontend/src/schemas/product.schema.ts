import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Product name is required.")
    .max(150, "Product name cannot exceed 150 characters."),

  sku: z
    .string()
    .trim()
    .min(1, "SKU is required.")
    .max(50, "SKU cannot exceed 50 characters.")
    .regex(
      /^[A-Za-z0-9._-]+$/,
      "SKU can contain only letters, numbers, dots, hyphens, and underscores.",
    ),

  category: z
    .string()
    .trim()
    .min(1, "Category is required.")
    .max(100, "Category cannot exceed 100 characters."),

  unitPrice: z
    .number({
      message: "Unit price is required.",
    })
    .finite("Enter a valid unit price.")
    .nonnegative("Unit price cannot be negative."),

  minimumStock: z
    .number({
      message: "Minimum stock is required.",
    })
    .int("Minimum stock must be a whole number.")
    .nonnegative("Minimum stock cannot be negative."),

  warehouseLocation: z
    .string()
    .trim()
    .min(1, "Warehouse location is required.")
    .max(150, "Warehouse location cannot exceed 150 characters."),
});

export type ProductFormValues = z.infer<typeof productSchema>;
