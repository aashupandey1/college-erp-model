import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema(
  {
    day: { type: String, required: true, trim: true },
    startTime: { type: String, required: true, trim: true },
    endTime: { type: String, required: true, trim: true },

    // Basic scheduling references (expand later when Class model is added)
    classRef: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },

    // Optional but useful for real scheduling without requiring a separate model
    branch: { type: String, trim: true },
    batch: { type: String, trim: true },
    section: { type: String, trim: true },
    semester: { type: String, trim: true },

    subject: { type: String, trim: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
    room: { type: String, trim: true },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Draft"],
      default: "Active",
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Avoid duplicate entries for same slot
// (If you add stronger class references later, update index accordingly)

timetableSchema.index(
  { day: 1, startTime: 1, endTime: 1, classRef: 1, branch: 1, batch: 1, section: 1, semester: 1 },
  { unique: false }
);

export default mongoose.model("Timetable", timetableSchema);

