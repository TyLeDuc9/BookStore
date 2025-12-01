const mongoose = require("mongoose");

const orderDetailSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    bookdetail_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookDetail",
      required: true,
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }, // giá sau giảm
    originalPrice: { type: Number }, // giá gốc
    subtotal: { type: Number }, // quantity * price
  },
  { timestamps: true }
);

// 👇 export đúng tên schema
module.exports = mongoose.model("OrderDetail", orderDetailSchema);
