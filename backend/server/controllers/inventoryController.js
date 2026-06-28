import InventoryItem from "../models/InventoryItem.js";

export const getInventoryItems = async (req, res) => {
  try {
    const items = await InventoryItem.find().sort({ itemName: 1 });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch inventory items" });
  }
};

export const createInventoryItem = async (req, res) => {
  try {
    const item = await InventoryItem.create({
      ...req.body,
      createdBy: req.user?._id,
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create inventory item" });
  }
};

export const updateInventoryItem = async (req, res) => {
  try {
    const item = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: "Inventory item not found" });
    }

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update inventory item" });
  }
};

export const deleteInventoryItem = async (req, res) => {
  try {
    const item = await InventoryItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Inventory item not found" });
    }

    res.status(200).json({ success: true, message: "Inventory item deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete inventory item" });
  }
};
