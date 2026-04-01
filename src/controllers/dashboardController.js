import { getDashboardMetrics } from "../services/dashboardService.js";

export const getDashboard = async (req, res, next) => {
  try {
    const metrics = await getDashboardMetrics();
    res.json({ success: true, data: metrics });
  } catch (error) {
    next(error);
  }
};
