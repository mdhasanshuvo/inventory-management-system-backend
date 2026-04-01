import { body } from "express-validator";

export const createOrderValidation = [
  body("customerName")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Customer name must be 2-100 characters"),
  body("products").isArray({ min: 1 }).withMessage("Products must be a non-empty array"),
  body("products.*.productId").isMongoId().withMessage("Valid productId is required"),
  body("products.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1")
];

export const updateOrderStatusValidation = [
  body("orderStatus")
    .isIn(["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"])
    .withMessage("Invalid order status")
];
