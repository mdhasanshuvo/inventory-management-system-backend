import express from "express";
import { createProduct, getProducts, updateProduct } from "../controllers/productController.js";
import validateRequest from "../middlewares/validateRequest.js";
import { createProductValidation, updateProductValidation } from "../validators/productValidator.js";

const router = express.Router();

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create product
 *   get:
 *     summary: Get products
 */
router.post("/", createProductValidation, validateRequest, createProduct);
router.put("/:id", updateProductValidation, validateRequest, updateProduct);
router.get("/", getProducts);

export default router;
