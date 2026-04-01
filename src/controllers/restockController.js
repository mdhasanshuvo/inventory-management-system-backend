import RestockQueue from "../models/RestockQueue.js";
import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";
import { syncRestockQueueForProduct } from "../services/restockService.js";
import { createActivityLog } from "../services/activityLogService.js";

export const getRestockQueue = async (req, res, next) => {
  try {
    const queue = await RestockQueue.find()
      .populate("product", "productName status")
      .sort({ stockQuantity: 1, updatedAt: -1 });

    res.json({ success: true, data: queue });
  } catch (error) {
    next(error);
  }
};

export const restockProduct = async (req, res, next) => {
  try {
    const { productId, addedStock } = req.body;

    if (addedStock <= 0) {
      throw new ApiError(400, "addedStock must be greater than 0");
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    product.stockQuantity += Number(addedStock);
    await product.save();
    await syncRestockQueueForProduct(product);

    await createActivityLog({
      action: "Product Restocked",
      details: `Product '${product.productName}' restocked by ${addedStock}`,
      actor: req.user._id
    });

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const removeFromQueue = async (req, res, next) => {
  try {
    const { id } = req.params;

    const removed = await RestockQueue.findByIdAndDelete(id);
    if (!removed) {
      throw new ApiError(404, "Queue item not found");
    }

    res.json({ success: true, message: "Removed from restock queue" });
  } catch (error) {
    next(error);
  }
};
