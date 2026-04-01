import mongoose from "mongoose";

const restockQueueSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      required: true
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0
    },
    minimumStockThreshold: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { timestamps: true }
);

const RestockQueue = mongoose.model("RestockQueue", restockQueueSchema);

export default RestockQueue;
