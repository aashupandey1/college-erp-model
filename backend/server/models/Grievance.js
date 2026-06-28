import mongoose from "mongoose";

const grievanceSchema = new mongoose.Schema(
  {
    grievanceId: { type: String, required: true, trim: true, unique: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    studentName: { type: String, trim: true },
    branch: { type: String, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    filedDate: { type: Date, default: Date.now },
    assignedTo: { type: String, trim: true },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved"],
      default: "Open",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Grievance", grievanceSchema);
