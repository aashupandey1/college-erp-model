import TransportRoute from "../models/TransportRoute.js";

export const getTransportRoutes = async (req, res) => {
  try {
    const routes = await TransportRoute.find()
      .populate("assignedStudents", "firstName lastName rollNumber")
      .sort({ routeName: 1 });

    res.status(200).json({ success: true, data: routes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch transport routes" });
  }
};

export const createTransportRoute = async (req, res) => {
  try {
    const route = await TransportRoute.create({
      ...req.body,
      createdBy: req.user?._id,
    });

    res.status(201).json({ success: true, data: route });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create transport route" });
  }
};

export const updateTransportRoute = async (req, res) => {
  try {
    const route = await TransportRoute.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!route) {
      return res.status(404).json({ success: false, message: "Transport route not found" });
    }

    res.status(200).json({ success: true, data: route });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update transport route" });
  }
};

export const deleteTransportRoute = async (req, res) => {
  try {
    const route = await TransportRoute.findByIdAndDelete(req.params.id);

    if (!route) {
      return res.status(404).json({ success: false, message: "Transport route not found" });
    }

    res.status(200).json({ success: true, message: "Transport route deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete transport route" });
  }
};
