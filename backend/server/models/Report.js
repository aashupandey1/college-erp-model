import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    description: { type: String, trim: true },
    type: {
      type: String,
      enum: ["attendance", "fees", "exams", "placement", "students", "faculty", "hostel", "library", "naac"],
      required: true,
    },
    format: {
      type: String,
      enum: ["pdf", "excel", "csv", "json"],
      default: "pdf",
    },
    status: {
      type: String,
      enum: ["draft", "ready", "generated"],
      default: "ready",
    },
    generatedAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
