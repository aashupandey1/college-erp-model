import ScholarshipApplication from "../models/ScholarshipApplication.js";

export const getScholarshipApplications = async (req, res) => {
  try {
    const applications = await ScholarshipApplication.find()
      .populate("student", "firstName lastName rollNumber")
      .sort({ appliedDate: -1 });

    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch scholarship applications" });
  }
};

export const createScholarshipApplication = async (req, res) => {
  try {
    const application = await ScholarshipApplication.create({
      ...req.body,
      createdBy: req.user?._id,
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create scholarship application" });
  }
};

export const updateScholarshipApplication = async (req, res) => {
  try {
    const application = await ScholarshipApplication.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!application) {
      return res.status(404).json({ success: false, message: "Scholarship application not found" });
    }

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update scholarship application" });
  }
};

export const deleteScholarshipApplication = async (req, res) => {
  try {
    const application = await ScholarshipApplication.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: "Scholarship application not found" });
    }

    res.status(200).json({ success: true, message: "Scholarship application deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete scholarship application" });
  }
};
