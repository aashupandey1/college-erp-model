import Faculty from "../models/Faculty.js";

export const getFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch faculty" });
  }
};

export const getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);

    if (!faculty) {
      return res.status(404).json({ success: false, message: "Faculty not found" });
    }

    res.status(200).json({ success: true, data: faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch faculty" });
  }
};

export const createFaculty = async (req, res) => {
  try {
    // Get last faculty
    const lastFaculty = await Faculty.findOne().sort({ createdAt: -1 });

    let nextNumber = 1;

    if (lastFaculty?.id) {
      const match = lastFaculty.id.match(/\d+$/);

      if (match) {
        nextNumber = parseInt(match[0], 10) + 1;
      }
    }

    const facultyId = `FAC-${String(nextNumber).padStart(4, "0")}`;

    const faculty = await Faculty.create({
      ...req.body,
      id: facultyId,
      createdBy: req.user?._id,
    });

    res.status(201).json({
      success: true,
      data: faculty,
    });

  } catch (error) {

    console.error(error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Faculty ID already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create faculty",
    });
  }
};

export const updateFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!faculty) {
      return res.status(404).json({ success: false, message: "Faculty not found" });
    }

    res.status(200).json({ success: true, data: faculty });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Faculty ID already exists" });
    }

    res.status(500).json({ success: false, message: "Failed to update faculty" });
  }
};

export const deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);

    if (!faculty) {
      return res.status(404).json({ success: false, message: "Faculty not found" });
    }

    res.status(200).json({ success: true, message: "Faculty deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete faculty" });
  }
};
