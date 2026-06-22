import { z } from "zod";

export const egyptianPhone = z
  .string({
    required_error: "phone is required",
    invalid_type_error: "phone must be a string",
  })
  .trim()
  .regex(
    /^(?:\+20|0)?1[0125][0-9]{8}$/,
    "please provide a valid egyptian phone number",
  );

export const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
export const medicineSchema = z.object({
  name: z
    .string({ required_error: "medicine name is required" })
    .trim()
    .min(2, "medicine name must be at least 2 characters")
    .max(100, "medicine name must be at most 100 characters"),

  dose: z
    .string({ required_error: "medicine dose is required" })
    .trim()
    .min(1, "dose is required")
    .max(50, "dose must be at most 50 characters"),

  frequency: z
    .string({ required_error: "medicine frequency is required" })
    .trim()
    .min(1, "frequency is required")
    .max(100, "frequency must be at most 100 characters"),

  duration: z
    .string({ required_error: "medicine duration is required" })
    .trim()
    .min(1, "duration is required")
    .max(50, "duration must be at most 50 characters"),
});
