import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "../config/db.js";
import User from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../.env"),
});

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({
      identifier: "admin",
    });

    if (existingAdmin) {
      console.log("✅ Admin already exists.");
      process.exit();
    }

    await User.create({
      name: "System Administrator",
      identifier: "admin",
      password: "Admin@123",
      role: "admin",
      email: "admin@collegeerp.com",
      department: "Administration",
      status: "active",
    });

    console.log("🎉 Admin created successfully.");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();