import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    studentName: { type: String, trim: true },
    rollNumber: { type: String, trim: true, uppercase: true },
    date: { type: Date, required: true },
    subject: { type: String, trim: true, default: "General" },
    period: { type: String, trim: true },
    status: {
      type: String,
      enum: ["Present", "Absent", "Late", "Leave"],
      default: "Present",
    },
    remarks: { type: String, trim: true },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

attendanceSchema.index(
  {
    student: 1,
    date: 1,
    subject: 1,
    period: 1,
  },
  { unique: true }
);

export default mongoose.model("Attendance", attendanceSchema);
