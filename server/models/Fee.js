import mongoose from "mongoose";

const feeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    studentName: { type: String, trim: true },
    rollNumber: { type: String, trim: true, uppercase: true },
    feeType: { type: String, trim: true, default: "Tuition" },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Partially Paid", "Overdue"],
      default: "Pending",
    },
    paymentMode: { type: String, trim: true },
    receiptNumber: { type: String, trim: true },
    remarks: { type: String, trim: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
feeSchema.index(
  {
    student: 1,
    feeType: 1,
    dueDate: 1,
  },
  { unique: true }
);
export default mongoose.model("Fee", feeSchema);
