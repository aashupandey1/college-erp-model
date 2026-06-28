import StaffMember from "../models/StaffMember.js";

export const getStaffMembers = async (req, res) => {
  try {
    const staff = await StaffMember.find().sort({ name: 1 });
    res.status(200).json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch staff members" });
  }
};

export const createStaffMember = async (req, res) => {
  try {
    const staffMember = await StaffMember.create({
      ...req.body,
      createdBy: req.user?._id,
    });

    res.status(201).json({ success: true, data: staffMember });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create staff member" });
  }
};

export const updateStaffMember = async (req, res) => {
  try {
    const staffMember = await StaffMember.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!staffMember) {
      return res.status(404).json({ success: false, message: "Staff member not found" });
    }

    res.status(200).json({ success: true, data: staffMember });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update staff member" });
  }
};

export const deleteStaffMember = async (req, res) => {
  try {
    const staffMember = await StaffMember.findByIdAndDelete(req.params.id);

    if (!staffMember) {
      return res.status(404).json({ success: false, message: "Staff member not found" });
    }

    res.status(200).json({ success: true, message: "Staff member deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete staff member" });
  }
};
