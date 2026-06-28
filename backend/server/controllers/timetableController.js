import Timetable from "../models/Timetable.js";

export const getTimetables = async (req, res) => {
  try {
    const timetables = await Timetable.find()
      .populate("faculty", "firstName lastName name")
      .sort({ day: 1, startTime: 1 });

    return res.status(200).json({ success: true, data: timetables });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch timetables" });
  }
};

export const createTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.create({
      ...req.body,
      createdBy: req.user?._id,
    });

    return res.status(201).json({ success: true, data: timetable });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to create timetable" });
  }
};

export const updateTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!timetable) {
      return res
        .status(404)
        .json({ success: false, message: "Timetable not found" });
    }

    return res.status(200).json({ success: true, data: timetable });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to update timetable" });
  }
};

export const deleteTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndDelete(req.params.id);
    if (!timetable) {
      return res
        .status(404)
        .json({ success: false, message: "Timetable not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Timetable deleted successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete timetable" });
  }
};

