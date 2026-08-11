const { z } = require("zod");

const createFollowUpSchema = z.object({
  note: z
    .string()
    .trim()
    .min(1, "Follow-up note is required")
    .max(1000, "Follow-up note cannot exceed 1000 characters"),

  followUpDate: z.string().datetime({
    message: "Follow-up date must be a valid ISO date",
  }),
});

module.exports = {
  createFollowUpSchema,
};
