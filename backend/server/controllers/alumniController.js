import Alumni from "../models/Alumni.js";

export const getAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.find().sort({ batch: -1, fullName: 1 });
    res.status(200).json({ success: true, data: alumni });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch alumni" });
  }
};

export const createAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.create({
      ...req.body,
      createdBy: req.user?._id,
    });

    res.status(201).json({ success: true, data: alumni });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create alumni record" });
  }
};

export const updateAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!alumni) {
      return res.status(404).json({ success: false, message: "Alumni record not found" });
    }

    res.status(200).json({ success: true, data: alumni });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update alumni record" });
  }
};

export const deleteAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndDelete(req.params.id);

    if (!alumni) {
      return res.status(404).json({ success: false, message: "Alumni record not found" });
    }

    res.status(200).json({ success: true, message: "Alumni record deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete alumni record" });
  }
};
