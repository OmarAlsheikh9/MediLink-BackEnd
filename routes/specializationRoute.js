import express from "express";
import authenticate from "../middlewares/authenticate.js";
import { restrictTo } from "../controllers/authController.js";
import { validate } from "../middlewares/validate.js";
import { specializationSchema } from "../utils/validators.js";
import {getAllSpecializations, createSpecialization, updateSpecialization, deleteSpecialization} from "../controllers/specializationController.js";


const specializationRouter = express.Router();

specializationRouter.use(authenticate, restrictTo("admin"));

specializationRouter.get(
  "/",
  getAllSpecializations,
);

specializationRouter.post(
  "/",
  validate(specializationSchema),
  createSpecialization,
);
specializationRouter.put(
  "/:id",
  validate(specializationSchema),
  updateSpecialization,
);
specializationRouter.delete(
  "/:id",
  deleteSpecialization,
);
export default specializationRouter;
