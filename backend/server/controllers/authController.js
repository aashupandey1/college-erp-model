import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      identifier: user.identifier,
    },
    process.env.JWT_SECRET || "college-erp-dev-secret",
    { expiresIn: "7d" }
  );
};

export const loginUser = async (req, res) => {
  const { identifier, password, role } = req.body;

  if (!identifier || !password || !role) {
    return res.status(400).json({
      success: false,
      message: "Identifier, password and role are required",
    });
  }

  try {
    const normalizedRole = role.toLowerCase();
    const user = await User.findOne({
      identifier: identifier.trim().toLowerCase(),
      role: normalizedRole,
    });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (user.status !== "active") {
      return res.status(403).json({ success: false, message: "Account is not active" });
    }

    const token = signToken(user);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        identifier: user.identifier,
        email: user.email,
        department: user.department,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      role: req.user.role,
      identifier: req.user.identifier,
      email: req.user.email,
      department: req.user.department,
    },
  });
};
