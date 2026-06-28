import mongoose from "mongoose";

const scholarshipApplicationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    studentName: { type: String, trim: true },
    branch: { type: String, trim: true },
    scheme: { type: String, required: true, trim: true },
    amount: { type: Number, default: 0 },
    appliedDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["Approved", "Pending", "Under Review", "Rejected"],
      default: "Pending",
    },
    description: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("ScholarshipApplication", scholarshipApplicationSchema);
