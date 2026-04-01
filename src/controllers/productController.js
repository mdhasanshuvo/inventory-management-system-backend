import Product from "../models/Product.js";
import Category from "../models/Category.js";
import ApiError from "../utils/ApiError.js";
import { syncRestockQueueForProduct } from "../services/restockService.js";
import { createActivityLog } from "../services/activityLogService.js";

export const createProduct = async (req, res, next) => {
  try {
    const { productName, category, price, stockQuantity, minimumStockThreshold } = req.body;

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      throw new ApiError(404, "Category not found");
    }

    const product = await Product.create({
      productName,
      category,
      price,
      stockQuantity,
      minimumStockThreshold
    });

    await syncRestockQueueForProduct(product);

    await createActivityLog({
      action: "Product Added",
      details: `Product '${product.productName}' was added`,
      actor: req.user._id
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (typeof updates.stockQuantity === "number" && updates.stockQuantity < 0) {
      throw new ApiError(400, "Stock cannot be negative");
    }

    const product = await Product.findById(id);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    Object.assign(product, updates);
    await product.save();
    await syncRestockQueueForProduct(product);

    await createActivityLog({
      action: "Stock Updated",
      details: `Product '${product.productName}' updated. Stock: ${product.stockQuantity}`,
      actor: req.user._id
    });

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const { search = "", category, page = 1, limit = 10 } = req.query;

    const query = {
      productName: { $regex: search, $options: "i" }
    };

    if (category) {
      query.category = category;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("category", "categoryName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total
      }
    });
  } catch (error) {
    next(error);
  }
};
