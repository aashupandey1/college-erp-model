import mongoose from "mongoose";

const alumniSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    batch: { type: String, required: true, trim: true },
    branch: { type: String, trim: true },
    company: { type: String, trim: true },
    role: { type: String, trim: true },
    city: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Alumni", alumniSchema);
