import mongoose from "mongoose";
import { PRODUCT_STATUSES } from "../utils/constants.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         productName:
 *           type: string
 *         category:
 *           type: string
 *         price:
 *           type: number
 *         stockQuantity:
 *           type: number
 *         minimumStockThreshold:
 *           type: number
 *         status:
 *           type: string
 */
const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    minimumStockThreshold: {
      type: Number,
      required: true,
      min: 0,
      default: 5
    },
    status: {
      type: String,
      enum: PRODUCT_STATUSES,
      default: "Active"
    }
  },
  { timestamps: true }
);

productSchema.pre("validate", function updateStatus(next) {
  this.status = this.stockQuantity === 0 ? "Out of Stock" : "Active";
  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
