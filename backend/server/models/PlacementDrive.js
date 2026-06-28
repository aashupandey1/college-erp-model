import mongoose from "mongoose";

const placementDriveSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    packageLpa: { type: Number, default: 0 },
    location: { type: String, trim: true },
    driveDate: { type: Date, required: true },
    eligibilityBranch: { type: String, trim: true },
    eligibilityBatch: { type: String, trim: true },
    status: {
      type: String,
      enum: ["Scheduled", "Ongoing", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    description: { type: String, trim: true },
    studentsApplied: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    selectedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("PlacementDrive", placementDriveSchema);
