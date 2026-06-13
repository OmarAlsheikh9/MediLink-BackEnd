import express from "express";
import authenticate from "../middlewares/authenticate.js";
import { restrictTo } from "../controllers/authController.js";
import { validate } from "../middlewares/validate.js";
import { createreceptionistSchema } from "../utils/validators.js";
import {
  createReceptionist,
  getAllReceptionist,
  updateReceptionist,
  getReceptionist,
  deleteReceptionist,
} from "../controllers/receptionistController.js";
const receptionistRouter = express.Router();

receptionistRouter.use(authenticate, restrictTo("admin"));
receptionistRouter.post(
  "/",
  validate(createreceptionistSchema),
  createReceptionist,
);

receptionistRouter.get("/", getAllReceptionist);

receptionistRouter
  .route("/:id")
  .patch(updateReceptionist)
  .delete(deleteReceptionist)
  .get(getReceptionist);
export default receptionistRouter;
