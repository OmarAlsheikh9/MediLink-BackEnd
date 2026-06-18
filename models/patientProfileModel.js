// models/patientProfileModel.js
import mongoose from "mongoose";

const patientProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    bloodType: {
      type: String,
      enum: {
        values: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        message: "invalid blood type",
      },
    },
    tall: Number,
    weight: Number,
    chronicMedications: [String],
    allergies: [String],
    chronicConditions: [String],
    medicalFiles: [
      {
        url: { type: String, required: true },
        fileId: { type: String, required: true }, // for deletion from ImageKit
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    favoriteDoctors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

const PatientProfile = mongoose.model("PatientProfile", patientProfileSchema);
export default PatientProfile;
