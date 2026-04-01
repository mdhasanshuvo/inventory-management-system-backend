import express from "express";
import { getDashboard } from "../controllers/dashboardController.js";

const router = express.Router();

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get dashboard metrics
 */
router.get("/", getDashboard);

export default router;
