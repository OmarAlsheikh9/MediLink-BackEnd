import express from "express";
import authenticate from "../middlewares/authenticate.js";
import { restrictTo } from "../controllers/authController.js";
import {
  completeMyProfile,
  getAllPatients,
  getPatientById,
  deletePatient,
  changeActiveStatus,
  deleteManyPatients,
} from "../controllers/patientController.js";
import { uploadMedicalFilesMiddleware } from "../middlewares/multer.js";
import { uploadMultipleToImageKit } from "../utils/imageKit.js";
const router = express.Router();
router.patch(
  "/complete-profile",
  authenticate,
  restrictTo("patient"),
  uploadMedicalFilesMiddleware,
  uploadMultipleToImageKit("medical-files"),
  completeMyProfile,
);
router.get("/:id", authenticate, restrictTo("admin doctor"), getPatientById);
router.use(authenticate, restrictTo("admin"));

router.get("/", getAllPatients);

router.delete("/:id", deletePatient);
router.patch("/:id/active", changeActiveStatus);
router.delete("/deleteMany", deleteManyPatients);
export default router;
