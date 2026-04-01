import Product from "../models/Product.js";
import Order from "../models/Order.js";
import ApiError from "../utils/ApiError.js";
import { syncRestockQueueForProduct } from "./restockService.js";

const getProductMap = async (items) => {
  const ids = items.map((item) => item.productId);
  const uniqueCount = new Set(ids.map((id) => id.toString())).size;

  if (ids.length !== uniqueCount) {
    throw new ApiError(400, "This product is already added to the order.");
  }

  const products = await Product.find({ _id: { $in: ids } });
  const productMap = new Map(products.map((product) => [product._id.toString(), product]));

  if (products.length !== ids.length) {
    throw new ApiError(404, "One or more selected products do not exist");
  }

  return productMap;
};

export const createOrderWithStockValidation = async ({ customerName, products, userId }) => {
  const productMap = await getProductMap(products);
  let totalPrice = 0;
  const orderItems = [];

  for (const item of products) {
    const product = productMap.get(item.productId.toString());

    if (product.status !== "Active" || product.stockQuantity === 0) {
      throw new ApiError(400, "This product is currently unavailable.");
    }

    if (item.quantity > product.stockQuantity) {
      throw new ApiError(400, `Only ${product.stockQuantity} items available in stock`);
    }

    product.stockQuantity -= item.quantity;
    product.status = product.stockQuantity === 0 ? "Out of Stock" : "Active";
    await product.save();
    await syncRestockQueueForProduct(product);

    const unitPrice = product.price;
    const lineTotal = unitPrice * item.quantity;
    totalPrice += lineTotal;

    orderItems.push({
      productId: product._id,
      quantity: item.quantity,
      unitPrice,
      lineTotal
    });
  }

  const order = await Order.create({
    customerName,
    products: orderItems,
    totalPrice,
    createdBy: userId
  });

  return order;
};

export const cancelOrderAndRestoreStock = async (order) => {
  if (order.orderStatus === "Cancelled") {
    throw new ApiError(400, "Order is already cancelled");
  }

  if (order.orderStatus === "Delivered") {
    throw new ApiError(400, "Delivered order cannot be cancelled");
  }

  for (const item of order.products) {
    const product = await Product.findById(item.productId);

    if (!product) continue;

    product.stockQuantity += item.quantity;
    product.status = product.stockQuantity === 0 ? "Out of Stock" : "Active";
    await product.save();
    await syncRestockQueueForProduct(product);
  }

  order.orderStatus = "Cancelled";
  await order.save();

  return order;
};
