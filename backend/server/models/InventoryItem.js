import mongoose from "mongoose";

const inventoryItemSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    quantity: { type: Number, default: 0 },
    unit: { type: String, trim: true },
    value: { type: Number, default: 0 },
    vendor: { type: String, trim: true },
    status: {
      type: String,
      enum: ["In Stock", "Low Stock", "Out of Stock"],
      default: "In Stock",
    },
    reorderLevel: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("InventoryItem", inventoryItemSchema);
