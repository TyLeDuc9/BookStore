const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  shippingAddress: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "ShippingAddress", 
    required: true 
  },

  paymentMethod: { 
    type: String, 
    enum: ["COD", "Momo", "VNPay"], 
    default: "COD" 
  },
  paymentStatus: { 
    type: String, 
    enum: ["pending", "paid", "failed"], 
    default: "pending" 
  },
  transactionId: { type: String }, 

  totalQuantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  shippingFee: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "completed", "cancelled"], 
    default: "pending" 
  }
}, { timestamps: true });

// ---------------- Middleware ----------------
orderSchema.pre("save", function(next) {
  if (this.totalPrice > 300000) {  
    this.shippingFee = 0;
  } else {
    this.shippingFee = 25000;     // ngược lại 25k
  }

  // ✅ Cập nhật luôn tổng tiền cuối cùng
  this.totalAmount = this.totalPrice + this.shippingFee;
  next();
});

module.exports = mongoose.model("Order", orderSchema);
