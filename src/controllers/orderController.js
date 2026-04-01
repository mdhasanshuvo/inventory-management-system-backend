import Order from "../models/Order.js";
import ApiError from "../utils/ApiError.js";
import {
  cancelOrderAndRestoreStock,
  createOrderWithStockValidation
} from "../services/orderService.js";
import { createActivityLog } from "../services/activityLogService.js";

export const createOrder = async (req, res, next) => {
  try {
    const order = await createOrderWithStockValidation({
      customerName: req.body.customerName,
      products: req.body.products,
      userId: req.user._id
    });

    await createActivityLog({
      action: "Order Created",
      details: `Order '${order._id}' created for ${order.customerName}`,
      actor: req.user._id
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const { status, date } = req.query;

    const query = {};

    if (status) {
      query.orderStatus = status;
    }

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: start, $lte: end };
    }

    const orders = await Order.find(query)
      .populate("products.productId", "productName")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    if (orderStatus === "Cancelled") {
      const cancelledOrder = await cancelOrderAndRestoreStock(order);
      await createActivityLog({
        action: "Order Cancelled",
        details: `Order '${cancelledOrder._id}' was cancelled and stock restored`,
        actor: req.user._id
      });

      return res.json({ success: true, data: cancelledOrder });
    }

    order.orderStatus = orderStatus;
    await order.save();

    await createActivityLog({
      action: "Order Status Changed",
      details: `Order '${order._id}' changed to ${order.orderStatus}`,
      actor: req.user._id
    });

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};
