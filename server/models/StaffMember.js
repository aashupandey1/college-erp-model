import mongoose from "mongoose";

const staffMemberSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true, trim: true, unique: true },
    name: { type: String, required: true, trim: true },
    department: { type: String, trim: true },
    designation: { type: String, trim: true },
    employeeType: {
      type: String,
      enum: ["Teaching", "Non-Teaching"],
      required: true,
    },
    joinedDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["Active", "On Leave", "Inactive"],
      default: "Active",
    },
    contactNumber: { type: String, trim: true },
    email: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("StaffMember", staffMemberSchema);
