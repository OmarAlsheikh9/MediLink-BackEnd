import express from 'express';
import {createMedicalReportSchema} from '../validationSchema/medicalReport.ValidationShema.js';
import { validate } from '../middlewares/validate';
import authnticate from '../middlewares/authenticate';
import { restrictTo } from '../controllers/authController';
import {getMedicalReportForPatient,createMedicalReport} from '../controllers/medicalReportController.js';

const router = express.Router();
router.use(authnticate,restrictTo('doctor'));

router.get('/:patientId',getMedicalReportsForPatient);

router.post('/',validate(createMedicalReportSchema),createMedicalReport);


export default router;