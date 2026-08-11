import { z } from "zod";

export const customerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Customer name must be at least 2 characters")
    .max(100, "Customer name cannot exceed 100 characters"),

  mobile: z
    .string()
    .trim()
    .min(10, "Mobile number must be at least 10 characters")
    .max(15, "Mobile number cannot exceed 15 characters")
    .regex(/^[0-9+\-\s()]+$/, "Enter a valid mobile number"),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .or(z.literal("")),

  businessName: z
    .string()
    .trim()
    .max(150, "Business name cannot exceed 150 characters"),

  gstNumber: z
    .string()
    .trim()
    .max(15, "GST number cannot exceed 15 characters"),

  type: z.enum(["RETAIL", "WHOLESALE", "DISTRIBUTOR"]),

  address: z.string().trim().max(500, "Address cannot exceed 500 characters"),

  status: z.enum(["LEAD", "ACTIVE", "INACTIVE"]),

  followUpDate: z.string(),

  notes: z.string().trim().max(1000, "Notes cannot exceed 1000 characters"),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
