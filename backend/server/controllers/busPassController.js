import BusPass from "../models/BusPass.js";

export const getBusPasses = async (req, res) => {
  try {
    const passes = await BusPass.find()
      .populate("student", "firstName lastName rollNumber")
      .populate("route", "routeName vehicleNumber")
      .sort({ issueDate: -1 });

    return res.status(200).json({ success: true, data: passes });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch bus passes" });
  }
};

export const createBusPass = async (req, res) => {
  try {
    const busPass = await BusPass.create({
      ...req.body,
      createdBy: req.user?._id,
    });

    return res.status(201).json({ success: true, data: busPass });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to create bus pass" });
  }
};

export const updateBusPass = async (req, res) => {
  try {
    const busPass = await BusPass.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!busPass) {
      return res.status(404).json({ success: false, message: "Bus pass not found" });
    }

    return res.status(200).json({ success: true, data: busPass });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update bus pass" });
  }
};

export const deleteBusPass = async (req, res) => {
  try {
    const busPass = await BusPass.findByIdAndDelete(req.params.id);
    if (!busPass) {
      return res.status(404).json({ success: false, message: "Bus pass not found" });
    }

    return res.status(200).json({ success: true, message: "Bus pass deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete bus pass" });
  }
};

