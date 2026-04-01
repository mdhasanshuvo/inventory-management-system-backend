import express from "express";
import { getRestockQueue, removeFromQueue, restockProduct } from "../controllers/restockController.js";

const router = express.Router();

/**
 * @swagger
 * /restock:
 *   get:
 *     summary: Get restock queue
 */
router.get("/", getRestockQueue);
router.post("/restock", restockProduct);
router.delete("/:id", removeFromQueue);

export default router;
