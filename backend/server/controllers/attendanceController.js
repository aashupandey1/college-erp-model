import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";

export const getAttendance = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate("student", "firstName lastName rollNumber")
      .sort({ date: -1 });

    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch attendance" });
  }
};

export const createAttendance = async (req, res) => {
  try {
    const student = await Student.findById(req.body.student);

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    const exists = await Attendance.findOne({
      student: req.body.student,
      date: req.body.date,
      subject: req.body.subject,
      period: req.body.period,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for this student.",
      });
    }
    const record = await Attendance.create({
      ...req.body,
      studentName: student.fullName,
      rollNumber: student.rollNumber,
      markedBy: req.user?._id,
    });

    res.status(201).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create attendance record" });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!record) {
      return res.status(404).json({ success: false, message: "Attendance record not found" });
    }

    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update attendance record" });
  }
};

export const deleteAttendance = async (req, res) => {
  try {
    const record = await Attendance.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({ success: false, message: "Attendance record not found" });
    }

    res.status(200).json({ success: true, message: "Attendance record deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete attendance record" });
  }
};
