import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "medicine name is required"],
      trim: true,
    },
    dose: {
      type: String,
      required: [true, "medicine dose is required"],
      trim: true,
    },
    frequency: {
      type: String,
      required: [true, "medicine frequency is required"],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, "medicine duration is required"],
      trim: true,
    },
  },
  { _id: false }
);

const prescriptionSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "prescription must belong to a patient"],
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "prescription must belong to a doctor"],
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: [true, "prescription must belong to an appointment"],
    },
    medicines: {
      type: [medicineSchema],
      validate: {
        validator: (val) => val.length > 0,
        message: "prescription must have at least one medicine",
      },
    },
  },
  { timestamps: true }
);

prescriptionSchema.index({ patient: 1, createdAt: -1 });
prescriptionSchema.index({ appointment: 1 },{ unique: true });

const Prescription = mongoose.model("Prescription", prescriptionSchema);
export default Prescription;