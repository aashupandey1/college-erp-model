import Fee from "../models/Fee.js";
import Student from "../models/Student.js";

export const getFees = async (req, res) => {
  try {
    const fees = await Fee.find().populate("student", "firstName lastName rollNumber").sort({ dueDate: 1 });
    res.status(200).json({ success: true, data: fees });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch fees" });
  }
};

export const createFee = async (req, res) => {
  try {
    const student = await Student.findById(req.body.student);

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    const exists = await Fee.findOne({
      student: req.body.student,
      feeType: req.body.feeType,
      dueDate: req.body.dueDate,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Fee record already exists.",
      });
    }
    const fee = await Fee.create({
      ...req.body,
      studentName: student.fullName,
      rollNumber: student.rollNumber,
      createdBy: req.user?._id,
    });

    res.status(201).json({ success: true, data: fee });
  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Fee record already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create fee record",
    });
  }
};

export const updateFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!fee) {
      return res.status(404).json({ success: false, message: "Fee record not found" });
    }

    res.status(200).json({ success: true, data: fee });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update fee record" });
  }
};

export const deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndDelete(req.params.id);

    if (!fee) {
      return res.status(404).json({ success: false, message: "Fee record not found" });
    }

    res.status(200).json({ success: true, message: "Fee record deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete fee record" });
  }
};
