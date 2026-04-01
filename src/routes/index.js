import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import authRoutes from "./authRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import productRoutes from "./productRoutes.js";
import orderRoutes from "./orderRoutes.js";
import restockRoutes from "./restockRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import activityRoutes from "./activityRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/categories", authMiddleware, categoryRoutes);
router.use("/products", authMiddleware, productRoutes);
router.use("/orders", authMiddleware, orderRoutes);
router.use("/restock", authMiddleware, restockRoutes);
router.use("/dashboard", authMiddleware, dashboardRoutes);
router.use("/activity", authMiddleware, activityRoutes);

export default router;
