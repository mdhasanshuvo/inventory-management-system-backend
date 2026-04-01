import RestockQueue from "../models/RestockQueue.js";

const getPriority = (stock, threshold) => {
  if (stock === 0) return "High";
  if (threshold - stock <= 2) return "Low";
  return "Medium";
};

export const syncRestockQueueForProduct = async (product) => {
  const { _id, stockQuantity, minimumStockThreshold } = product;

  if (stockQuantity < minimumStockThreshold) {
    const priority = getPriority(stockQuantity, minimumStockThreshold);
    await RestockQueue.findOneAndUpdate(
      { product: _id },
      {
        product: _id,
        priority,
        stockQuantity,
        minimumStockThreshold
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return;
  }

  await RestockQueue.findOneAndDelete({ product: _id });
};
