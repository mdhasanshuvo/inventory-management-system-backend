import { body } from "express-validator";

export const createProductValidation = [
  body("productName").trim().isLength({ min: 2, max: 120 }).withMessage("Invalid product name"),
  body("category").isMongoId().withMessage("Valid category is required"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("stockQuantity").isInt({ min: 0 }).withMessage("Stock cannot be negative"),
  body("minimumStockThreshold")
    .isInt({ min: 0 })
    .withMessage("Minimum stock threshold must be a positive integer")
];

export const updateProductValidation = createProductValidation;
