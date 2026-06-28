import mongoose from "mongoose";

const hostelRoomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, trim: true, uppercase: true },
    block: { type: String, trim: true },
    capacity: { type: Number, default: 2 },
    occupied: { type: Number, default: 0 },
    type: { type: String, trim: true, default: "Shared" },
    rent: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Available", "Occupied", "Maintenance"],
      default: "Available",
    },
    assignedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
hostelRoomSchema.index(
  {
    roomNumber: 1,
    block: 1,
  },
  { unique: true }
);
export default mongoose.model("HostelRoom", hostelRoomSchema);
