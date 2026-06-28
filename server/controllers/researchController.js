import ResearchProject from "../models/ResearchProject.js";

export const getResearchProjects = async (req, res) => {
  try {
    const projects = await ResearchProject.find()
      .populate("facultyMembers", "name department")
      .sort({ endDate: 1 });

    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch research projects" });
  }
};

export const createResearchProject = async (req, res) => {
  try {
    const project = await ResearchProject.create({
      ...req.body,
      createdBy: req.user?._id,
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create research project" });
  }
};

export const updateResearchProject = async (req, res) => {
  try {
    const project = await ResearchProject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({ success: false, message: "Research project not found" });
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update research project" });
  }
};

export const deleteResearchProject = async (req, res) => {
  try {
    const project = await ResearchProject.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: "Research project not found" });
    }

    res.status(200).json({ success: true, message: "Research project deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete research project" });
  }
};
