import { body } from "express-validator";

export const createCategoryValidation = [
  body("categoryName")
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage("Category name must be 2-60 characters")
];
