import express from "express";
import { login, me, signup } from "../controllers/authController.js";
import { loginValidation, signupValidation } from "../validators/authValidator.js";
import validateRequest from "../middlewares/validateRequest.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a user
 */
router.post("/signup", signupValidation, validateRequest, signup);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 */
router.post("/login", loginValidation, validateRequest, login);
router.get("/me", authMiddleware, me);

export default router;
