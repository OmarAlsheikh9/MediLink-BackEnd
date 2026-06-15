import express from 'express';
import { validate } from '../middlewares/validate.js';
import { createPrescriptionSchema } from '../validationSchema/prescription.ValidationSchema.js';
import { createPrescription, getPrescriptionsByPatient } from '../controllers/prescriptionController.js';
const router = express.Router();
router.use(authenticate, restrictTo("doctor"));
router.post('/', validate(createPrescriptionSchema), createPrescription);
router.get('/:patientId',getPrescriptionsByPatient);
export default router;