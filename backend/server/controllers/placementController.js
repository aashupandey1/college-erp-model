import PlacementDrive from "../models/PlacementDrive.js";

export const getPlacementDrives = async (req, res) => {
  try {
    const drives = await PlacementDrive.find()
      .populate("studentsApplied", "firstName lastName rollNumber")
      .populate("selectedStudents", "firstName lastName rollNumber")
      .sort({ driveDate: 1 });

    res.status(200).json({ success: true, data: drives });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch placement drives" });
  }
};

export const createPlacementDrive = async (req, res) => {
  try {
    const drive = await PlacementDrive.create({
      ...req.body,
      createdBy: req.user?._id,
    });

    res.status(201).json({ success: true, data: drive });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create placement drive" });
  }
};

export const updatePlacementDrive = async (req, res) => {
  try {
    const drive = await PlacementDrive.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!drive) {
      return res.status(404).json({ success: false, message: "Placement drive not found" });
    }

    res.status(200).json({ success: true, data: drive });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update placement drive" });
  }
};

export const deletePlacementDrive = async (req, res) => {
  try {
    const drive = await PlacementDrive.findByIdAndDelete(req.params.id);

    if (!drive) {
      return res.status(404).json({ success: false, message: "Placement drive not found" });
    }

    res.status(200).json({ success: true, message: "Placement drive deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete placement drive" });
  }
};
