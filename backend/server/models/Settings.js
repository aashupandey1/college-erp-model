import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    collegeName: { type: String, default: "GreenTech Engineering College" },
    academicYear: { type: String, default: "2025-26" },
    currentSemester: { type: String, default: "6" },
    emailDomain: { type: String, default: "@college.edu" },
    notifications: {
      sms: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: false },
    },
    autoAlerts: {
      attendance: { type: Boolean, default: true },
      fee: { type: Boolean, default: true },
      result: { type: Boolean, default: false },
    },
    security: {
      twofa: { type: Boolean, default: false },
      sessionTimeout: { type: Boolean, default: true },
      auditLogs: { type: Boolean, default: true },
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);
