import Category from "../models/Category.js";
import ApiError from "../utils/ApiError.js";
import { createActivityLog } from "../services/activityLogService.js";

export const createCategory = async (req, res, next) => {
  try {
    const { categoryName } = req.body;

    const exists = await Category.findOne({ categoryName });
    if (exists) {
      throw new ApiError(409, "Category name already exists");
    }

    const category = await Category.create({ categoryName });

    await createActivityLog({
      action: "Category Created",
      details: `Category '${category.categoryName}' created`,
      actor: req.user._id
    });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};
