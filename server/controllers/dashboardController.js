import Student from "../models/Student.js";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";
import Fee from "../models/Fee.js";
import Exam from "../models/Exam.js";
import Grievance from "../models/Grievance.js";
import ScholarshipApplication from "../models/ScholarshipApplication.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const today = new Date();

    const [
      totalStudents,
      activeStudents,
      totalFaculty,
      totalAdmins,
      totalHODs,
      totalParents,
      totalAccountants,

      totalAttendance,
      presentAttendance,

      paidFees,
      pendingFees,

      pendingGrievances,
      pendingScholarships,

      upcomingExams,
    ] = await Promise.all([

      Student.countDocuments(),
      Student.countDocuments({ status: "Active" }),

      User.countDocuments({ role: "faculty" }),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "hod" }),
      User.countDocuments({ role: "parent" }),
      User.countDocuments({ role: "accountant" }),

      Attendance.countDocuments(),
      Attendance.countDocuments({ status: "Present" }),

      Fee.aggregate([
        { $match: { status: "Paid" } },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),

      Fee.countDocuments({
        status: { $in: ["Pending", "Overdue"] },
      }),

      Grievance.countDocuments({
        status: { $ne: "Resolved" },
      }),

      ScholarshipApplication.countDocuments({
        status: {
          $in: ["Pending", "Under Review"],
        },
      }),

      Exam.find({
        date: { $gte: today },
        status: "Scheduled",
      })
        .sort({ date: 1 })
        .limit(5),
    ]);

    const attendancePercentage =
      totalAttendance === 0
        ? 0
        : Number(
            ((presentAttendance / totalAttendance) * 100).toFixed(1)
          );

    const feeCollected =
      paidFees.length > 0 ? paidFees[0].total : 0;

    res.status(200).json({
      success: true,

      data: {
        overview: {
          totalStudents,
          activeStudents,
          totalFaculty,
          totalAdmins,
          totalHODs,
          totalParents,
          totalAccountants,

          attendancePercentage,

          feeCollected,
          pendingFees,

          pendingGrievances,
          pendingScholarships,
        },

        upcomingExams,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard",
    });
  }
};