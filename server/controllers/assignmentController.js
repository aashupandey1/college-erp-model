import Assignment from "../models/Assignment.js";

export const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("faculty", "firstName lastName name")
      .sort({ dueDate: 1 });

    return res.status(200).json({ success: true, data: assignments });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch assignments" });
  }
};

export const createAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.create({
      ...req.body,
      createdBy: req.user?._id,
    });

    return res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to create assignment" });
  }
};

export const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    return res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update assignment" });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete assignment" });
  }
};

