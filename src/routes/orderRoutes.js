import express from "express";
import { createOrder, getOrders, updateOrderStatus } from "../controllers/orderController.js";
import validateRequest from "../middlewares/validateRequest.js";
import { createOrderValidation, updateOrderStatusValidation } from "../validators/orderValidator.js";

const router = express.Router();

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create order
 *   get:
 *     summary: Get orders by status/date
 */
router.post("/", createOrderValidation, validateRequest, createOrder);
router.get("/", getOrders);
router.patch("/:id/status", updateOrderStatusValidation, validateRequest, updateOrderStatus);

export default router;
