import mongoose from "mongoose";

const transportSchema = new mongoose.Schema(
  {
    routeName: { type: String, required: true, trim: true },
    vehicleNumber: { type: String, required: true, trim: true, uppercase: true },
    driverName: { type: String, trim: true },
    capacity: { type: Number, default: 0 },
    fare: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Maintenance"],
      default: "Active",
    },
    stops: [{ type: String, trim: true }],
    assignedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("TransportRoute", transportSchema);
