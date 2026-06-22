import { z } from "zod";
import {medicineSchema} from "./shared.validation.js"

export const createPrescriptionSchema = z.object({
  patient: z
    .string({ required_error: "patient id is required" })
    .regex(/^[a-f\d]{24}$/i, "invalid patient id"),
  appointment: z
    .string({ required_error: "appointment id is required" })
    .regex(/^[a-f\d]{24}$/i, "invalid appointment id"),

  medicines: z
    .array(medicineSchema, { required_error: "medicines are required" })
    .min(1, "prescription must have at least one medicine"),
});
