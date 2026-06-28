import Student from "../models/Student.js";

const REQUIRED_CREATE_FIELDS = ["firstName", "lastName", "rollNumber"];

const validateStudentPayload = (body, { isUpdate = false } = {}) => {
  const errors = [];

  if (!isUpdate) {
    for (const field of REQUIRED_CREATE_FIELDS) {
      const value = body[field];
      if (!value || (typeof value === "string" && !value.trim())) {
        errors.push(`${field} is required`);
      }
    }
  }

  if (body.rollNumber !== undefined && !String(body.rollNumber).trim()) {
    errors.push("rollNumber cannot be empty");
  }

  if (body.personalEmail && !/^\S+@\S+\.\S+$/.test(body.personalEmail)) {
    errors.push("Invalid personal email address");
  }

  if (body.guardianEmail && !/^\S+@\S+\.\S+$/.test(body.guardianEmail)) {
    errors.push("Invalid guardian email address");
  }

  return errors;
};

const mapStudentPayload = (body) => {
  const payload = { ...body };

  if (payload.admYear && !payload.admissionYear) {
    payload.admissionYear = payload.admYear;
    delete payload.admYear;
  }

  if (payload.admDate && !payload.admissionDate) {
    payload.admissionDate = payload.admDate;
    delete payload.admDate;
  }

  if (payload.personalPhone && !payload.phone) {
    payload.phone = payload.personalPhone;
    delete payload.personalPhone;
  }

  if (payload.rollNumber) {
    payload.rollNumber = String(payload.rollNumber).trim().toUpperCase();
  }

  return payload;
};

export const getStudents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      branch,
      semester,
      status,
      admissionYear,
      sort = "-createdAt",
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { fullName: { $regex: search, $options: "i" } },
        { rollNumber: { $regex: search, $options: "i" } },
      ];
    }

    if (branch) query.branch = branch;
    if (semester) query.semester = semester;
    if (status) query.status = status;
    if (admissionYear) query.admissionYear = admissionYear;

    const pageNumber = Math.max(Number(page) || 1, 1);
    const pageLimit = Math.min(Math.max(Number(limit) || 10, 1), 500);

    const totalStudents = await Student.countDocuments(query);

    const students = await Student.find(query)
      .sort(sort)
      .skip((pageNumber - 1) * pageLimit)
      .limit(pageLimit);

    res.status(200).json({
      success: true,
      totalStudents,
      totalPages: Math.ceil(totalStudents / pageLimit) || 1,
      currentPage: pageNumber,
      data: students,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
    });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch student" });
  }
};

export const createStudent = async (req, res) => {
  try {
    const validationErrors = validateStudentPayload(req.body);

    if (validationErrors.length) {
      return res.status(400).json({
        success: false,
        message: validationErrors.join(", "),
      });
    }

    const student = await Student.create({
      ...mapStudentPayload(req.body),
      createdBy: req.user?._id,
    });

    res.status(201).json({ success: true, data: student });
  } catch (error) {
    console.error("========== CREATE STUDENT ERROR ==========");
    console.error(error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Roll number already exists",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((err) => err.message)
          .join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const validationErrors = validateStudentPayload(req.body, { isUpdate: true });

    if (validationErrors.length) {
      return res.status(400).json({
        success: false,
        message: validationErrors.join(", "),
      });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      mapStudentPayload(req.body),
      {
        new: true,
        runValidators: true,
      }
    );

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    console.error("UPDATE STUDENT ERROR:", error.message);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Roll number already exists",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((err) => err.message)
          .join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update student",
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete student" });
  }
};
