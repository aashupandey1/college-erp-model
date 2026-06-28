import Exam from "../models/Exam.js";

export const getExams = async (req, res) => {
  try {
    const exams = await Exam.find().sort({ date: 1 });
    res.status(200).json({ success: true, data: exams });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch exams" });
  }
};

export const createExam = async (req, res) => {
  try {
    const exists = await Exam.findOne({
      title: req.body.title,
      subject: req.body.subject,
      branch: req.body.branch,
      semester: req.body.semester,
      date: req.body.date,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Exam already scheduled.",
      });
    }
    const exam = await Exam.create({
      ...req.body,
      createdBy: req.user?._id,
    });

    res.status(201).json({ success: true, data: exam });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Exam already scheduled.",
      });
    }
    res.status(500).json({ success: false, message: "Failed to create exam" });
  }
};

export const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    res.status(200).json({ success: true, data: exam });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update exam" });
  }
};

export const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);

    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    res.status(200).json({ success: true, message: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete exam" });
  }
};
