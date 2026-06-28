import Lab from "../models/Lab.js";

export const getLabs = async (req, res) => {
  try {
    const labs = await Lab.find().sort({ name: 1 });
    return res.status(200).json({ success: true, data: labs });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch labs" });
  }
};

export const createLab = async (req, res) => {
  try {
    const lab = await Lab.create({
      ...req.body,
      createdBy: req.user?._id,
    });

    return res.status(201).json({ success: true, data: lab });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to create lab" });
  }
};

export const updateLab = async (req, res) => {
  try {
    const lab = await Lab.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!lab) {
      return res.status(404).json({ success: false, message: "Lab not found" });
    }

    return res.status(200).json({ success: true, data: lab });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update lab" });
  }
};

export const deleteLab = async (req, res) => {
  try {
    const lab = await Lab.findByIdAndDelete(req.params.id);
    if (!lab) {
      return res.status(404).json({ success: false, message: "Lab not found" });
    }

    return res.status(200).json({ success: true, message: "Lab deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete lab" });
  }
};

