import express from "express";
import { getRecentActivities } from "../controllers/activityController.js";
const router = express.Router();

/**
 * @swagger
 * /activity:
 *   get:
 *     summary: Get latest activity logs
 */
router.get("/", getRecentActivities);

export default router;
