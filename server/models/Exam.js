import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    examType: { type: String, trim: true, default: "Internal" },
    semester: { type: String, trim: true },
    branch: { type: String, trim: true },
    subject: { type: String, trim: true },
    date: { type: Date, required: true },
    time: { type: String, trim: true },
    room: { type: String, trim: true },
    maxMarks: { type: Number, default: 100 },
    status: {
      type: String,
      enum: ["Scheduled", "Ongoing", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
examSchema.index(
  {
    title: 1,
    subject: 1,
    branch: 1,
    semester: 1,
    date: 1,
  },
  { unique: true }
);
export default mongoose.model("Exam", examSchema);
