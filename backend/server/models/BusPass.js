import mongoose from "mongoose";

const busPassSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransportRoute",
    },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended", "Expired"],
      default: "Active",
    },

    passNumber: { type: String, required: true, trim: true, unique: true },

    issueDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true },

    feeAmount: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Partial"],
      default: "Pending",
    },

    // Optional reason/notes
    notes: { type: String, trim: true },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("BusPass", busPassSchema);

