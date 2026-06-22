import mongoose from "mongoose";
import { ACTIONS } from "../constant/activities.js";
const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: Object.values(ACTIONS),
    }
  },
  { timestamps: true },
);

activitySchema.index({ user: 1, createdAt: -1 });
const Activity = mongoose.model("Activity", activitySchema);
export default Activity;