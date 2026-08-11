import { z } from "zod";

export const stockMovementSchema = z.object({
  productId: z.string().min(1, "Please select a product."),

  type: z.enum(["IN", "OUT"], {
    message: "Please select a movement type.",
  }),

  quantity: z
    .number({
      message: "Quantity is required.",
    })
    .int("Quantity must be a whole number.")
    .positive("Quantity must be greater than zero."),

  reason: z
    .string()
    .trim()
    .min(1, "Reason is required.")
    .max(500, "Reason cannot exceed 500 characters."),
});

export type StockMovementFormValues = z.infer<typeof stockMovementSchema>;
