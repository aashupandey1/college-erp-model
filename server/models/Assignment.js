import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    subject: { type: String, required: true, trim: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },

    // Links an assignment to a class/batch context without requiring another model.
    branch: { type: String, trim: true },
    batch: { type: String, trim: true },
    section: { type: String, trim: true },
    semester: { type: String, trim: true },

    dueDate: { type: Date, required: true },

    // File references/URLs (actual file storage can be added later)
    attachments: [{ type: String, trim: true }],

    status: {
      type: String,
      enum: ["Draft", "Published", "Closed"],
      default: "Draft",
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

assignmentSchema.index({ subject: 1, dueDate: -1 });

export default mongoose.model("Assignment", assignmentSchema);

