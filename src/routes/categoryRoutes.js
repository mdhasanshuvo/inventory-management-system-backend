import express from "express";
import { createCategory, getCategories } from "../controllers/categoryController.js";
import validateRequest from "../middlewares/validateRequest.js";
import { createCategoryValidation } from "../validators/categoryValidator.js";

const router = express.Router();

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create category
 *     security:
 *       - bearerAuth: []
 *   get:
 *     summary: Get categories
 *     security:
 *       - bearerAuth: []
 */
router.post("/", createCategoryValidation, validateRequest, createCategory);
router.get("/", getCategories);

export default router;
