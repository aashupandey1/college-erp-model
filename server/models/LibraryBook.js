import mongoose from "mongoose";

const libraryBookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, trim: true },
    category: { type: String, trim: true },
    isbn: { type: String, trim: true },
    edition: { type: String, trim: true },
    publisher: { type: String, trim: true },
    availableCopies: { type: Number, default: 1 },
    totalCopies: { type: Number, default: 1 },
    rackNo: { type: String, trim: true },
    status: {
      type: String,
      enum: ["Available", "Issued", "Reserved", "Damaged"],
      default: "Available",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
libraryBookSchema.index(
  {
    isbn: 1,
  },
  { unique: true, sparse: true }
);
export default mongoose.model("LibraryBook", libraryBookSchema);
