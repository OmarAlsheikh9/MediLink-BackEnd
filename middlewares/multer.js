// config/multer.js
import multer from "multer";
import AppError from "../utils/appError.js";

const storage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("only images are allowed", 400), false);
  }
};

const medicalFileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image") ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new AppError("only images and PDFs are allowed", 400), false);
  }
};

const uploadImage = multer({ storage, fileFilter: imageFilter });
const uploadMedicalFiles = multer({ storage, fileFilter: medicalFileFilter });

export const uploadSingleImage = (field) => uploadImage.single(field);
export const uploadMultipleImages = (field, max = 5) =>
  uploadImage.array(field, max);

// for medical files — up to 5 files per upload
export const uploadMedicalFilesMiddleware = uploadMedicalFiles.array(
  "medicalFiles",
  5,
);
