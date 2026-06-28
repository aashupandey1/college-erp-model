import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import feeRoutes from "./routes/feeRoutes.js";
import libraryRoutes from "./routes/libraryRoutes.js";
import hostelRoutes from "./routes/hostelRoutes.js";
import transportRoutes from "./routes/transportRoutes.js";
import placementRoutes from "./routes/placementRoutes.js";
import researchRoutes from "./routes/researchRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import scholarshipRoutes from "./routes/scholarshipRoutes.js";
import communicationRoutes from "./routes/communicationRoutes.js";
import grievanceRoutes from "./routes/grievanceRoutes.js";
import hrRoutes from "./routes/hrRoutes.js";
import alumniRoutes from "./routes/alumniRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import labRoutes from "./routes/labRoutes.js";
import timetableRoutes from "./routes/timetableRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import busPassRoutes from "./routes/busPassRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, ".env"),
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "College ERP API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/hostel", hostelRoutes);
app.use("/api/transport", transportRoutes);
app.use("/api/placement", placementRoutes);
app.use("/api/research", researchRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/scholarship", scholarshipRoutes);
app.use("/api/communication", communicationRoutes);
app.use("/api/grievances", grievanceRoutes);
app.use("/api/hr", hrRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/labs", labRoutes);
app.use("/api/timetables", timetableRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/bus-passes", busPassRoutes);
app.use("/api/dashboard", dashboardRoutes);
connectDB();


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
