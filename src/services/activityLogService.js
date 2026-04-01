import ActivityLog from "../models/ActivityLog.js";

export const createActivityLog = async ({ action, details, actor }) => {
  await ActivityLog.create({ action, details, actor });
};
