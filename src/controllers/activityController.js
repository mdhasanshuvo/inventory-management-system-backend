import ActivityLog from "../models/ActivityLog.js";

export const getRecentActivities = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const logs = await ActivityLog.find()
      .populate("actor", "name email")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};
