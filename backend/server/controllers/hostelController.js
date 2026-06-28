import HostelRoom from "../models/HostelRoom.js";

export const getRooms = async (req, res) => {
  try {
    const rooms = await HostelRoom.find().populate("assignedStudents", "firstName lastName rollNumber").sort({ roomNumber: 1 });
    res.status(200).json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch hostel rooms" });
  }
};

export const createRoom = async (req, res) => {
  try {
    const exists = await HostelRoom.findOne({
      roomNumber: req.body.roomNumber,
      block: req.body.block,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Room already exists.",
      });
    }
    const room = await HostelRoom.create({
      ...req.body,
      createdBy: req.user?._id,
    });

    res.status(201).json({ success: true, data: room });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Room already exists.",
      });
    }
    res.status(500).json({ success: false, message: "Failed to create hostel room" });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const room = await HostelRoom.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!room) {
      return res.status(404).json({ success: false, message: "Hostel room not found" });
    }

    res.status(200).json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update hostel room" });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const room = await HostelRoom.findByIdAndDelete(req.params.id);

    if (!room) {
      return res.status(404).json({ success: false, message: "Hostel room not found" });
    }

    res.status(200).json({ success: true, message: "Hostel room deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete hostel room" });
  }
};
