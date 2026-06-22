import { z } from "zod";

export const createMedicalReportSchema = z.object({
  patient: z
    .string({ required_error: "patient id is required" })
    .regex(/^[a-f\d]{24}$/i, "invalid patient id"),

  appointment: z
    .string({ required_error: "appointment id is required" })
    .regex(/^[a-f\d]{24}$/i, "invalid appointment id"),

  diagnosis: z
    .string({ required_error: "diagnosis is required" })
    .trim()
    .min(2, "diagnosis must be at least 2 characters")
    .max(200, "diagnosis must be at most 200 characters"),

  notes: z
    .string()
    .trim()
    .max(1000, "notes must be at most 1000 characters")
    .optional(),
});
