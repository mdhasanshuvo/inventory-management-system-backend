import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         categoryName:
 *           type: string
 */
const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 60
    }
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
