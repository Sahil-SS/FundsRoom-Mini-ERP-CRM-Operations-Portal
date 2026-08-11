import { z } from "zod";

export const challanItemSchema = z.object({
  productId: z.string().min(1, "Please select a product."),

  quantity: z
    .number({
      message: "Quantity is required.",
    })
    .int("Quantity must be a whole number.")
    .positive("Quantity must be greater than zero."),
});

export const createChallanSchema = z.object({
  customerId: z.string().min(1, "Please select a customer."),

  items: z
    .array(challanItemSchema)
    .min(1, "Add at least one product.")
    .superRefine((items, context) => {
      const productIds = items.map((item) => item.productId);

      const duplicates = productIds.filter(
        (id, index) => productIds.indexOf(id) !== index,
      );

      if (duplicates.length > 0) {
        context.addIssue({
          code: "custom",
          message: "A product can only appear once in a challan.",
          path: ["items"],
        });
      }
    }),
});

export type CreateChallanFormValues = z.infer<typeof createChallanSchema>;
