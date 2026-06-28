import Grievance from "../models/Grievance.js";

export const getGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find()
      .populate("student", "firstName lastName rollNumber")
      .sort({ filedDate: -1 });

    res.status(200).json({ success: true, data: grievances });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch grievances" });
  }
};

export const createGrievance = async (req, res) => {
  try {
    const grievance = await Grievance.create({
      ...req.body,
      createdBy: req.user?._id,
    });

    res.status(201).json({ success: true, data: grievance });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create grievance" });
  }
};

export const updateGrievance = async (req, res) => {
  try {
    const grievance = await Grievance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!grievance) {
      return res.status(404).json({ success: false, message: "Grievance not found" });
    }

    res.status(200).json({ success: true, data: grievance });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update grievance" });
  }
};

export const deleteGrievance = async (req, res) => {
  try {
    const grievance = await Grievance.findByIdAndDelete(req.params.id);

    if (!grievance) {
      return res.status(404).json({ success: false, message: "Grievance not found" });
    }

    res.status(200).json({ success: true, message: "Grievance deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete grievance" });
  }
};
