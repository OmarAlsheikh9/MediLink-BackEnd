import express from "express";
import { createMedicalReportSchema } from "../validationSchema/medicalReport.ValidationShema.js";
import { validate } from "../middlewares/validate.js";
import authenticate from "../middlewares/authenticate.js";
import { restrictTo } from "../controllers/authController.js";
import {
  getMedicalReportsForPatient,
  createMedicalReport,
} from "../controllers/medicalReportController.js";

const router = express.Router();
router.use(authenticate, restrictTo("doctor"));

router.get("/:patientId", getMedicalReportsForPatient);
router.post("/", validate(createMedicalReportSchema), createMedicalReport);

export default router;
