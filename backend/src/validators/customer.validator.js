const { z } = require("zod");

const customerTypeEnum = z.enum(["RETAIL", "WHOLESALE", "DISTRIBUTOR"]);

const customerStatusEnum = z.enum(["LEAD", "ACTIVE", "INACTIVE"]);

const createCustomerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Customer name must be at least 2 characters")
    .max(100, "Customer name cannot exceed 100 characters"),

  mobile: z
    .string()
    .trim()
    .min(10, "Mobile number must be at least 10 characters")
    .max(15, "Mobile number cannot exceed 15 characters"),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),

  businessName: z
    .string()
    .trim()
    .max(150, "Business name cannot exceed 150 characters")
    .optional()
    .or(z.literal("")),

  gstNumber: z
    .string()
    .trim()
    .max(15, "GST number cannot exceed 15 characters")
    .optional()
    .or(z.literal("")),

  type: customerTypeEnum,

  address: z
    .string()
    .trim()
    .max(500, "Address cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),

  status: customerStatusEnum.optional(),

  followUpDate: z
    .string()
    .datetime({
      message: "Follow-up date must be a valid ISO date",
    })
    .optional(),

  notes: z
    .string()
    .trim()
    .max(1000, "Notes cannot exceed 1000 characters")
    .optional()
    .or(z.literal("")),
});

const updateCustomerSchema = createCustomerSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required for update",
  });

module.exports = {
  createCustomerSchema,
  updateCustomerSchema,
};
