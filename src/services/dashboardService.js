import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const getDashboardMetrics = async () => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [
    totalOrdersToday,
    pendingOrders,
    completedOrders,
    lowStockItemsCount,
    revenueResult,
    productSummary
  ] = await Promise.all([
    Order.countDocuments({ createdAt: { $gte: todayStart, $lte: todayEnd } }),
    Order.countDocuments({ orderStatus: "Pending" }),
    Order.countDocuments({ orderStatus: "Delivered" }),
    Product.countDocuments({ $expr: { $lt: ["$stockQuantity", "$minimumStockThreshold"] } }),
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: todayStart, $lte: todayEnd },
          orderStatus: { $ne: "Cancelled" }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" }
        }
      }
    ]),
    Product.find()
      .sort({ stockQuantity: 1 })
      .limit(8)
      .select("productName stockQuantity minimumStockThreshold")
      .lean()
  ]);

  return {
    totalOrdersToday,
    pendingVsCompleted: {
      pending: pendingOrders,
      completed: completedOrders
    },
    lowStockItemsCount,
    revenueToday: revenueResult[0]?.total || 0,
    productSummary: productSummary.map((item) => ({
      productName: item.productName,
      stockText:
        item.stockQuantity < item.minimumStockThreshold
          ? `${item.stockQuantity} left (Low Stock)`
          : `${item.stockQuantity} available (OK)`
    }))
  };
};
