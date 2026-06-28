import mongoose from "mongoose";

const accountTransactionSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    type: {
      type: String,
      enum: ["Credit", "Debit"],
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now },
    reference: { type: String, trim: true },
    notes: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("AccountTransaction", accountTransactionSchema);
