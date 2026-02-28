const mongoose = require("mongoose");

const bookDiscountSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },          
  discountType: {
    type: String,
    enum: ["percentage", "fixed"],        
    required: true
  },
  value: { type: Number, required: true }, 
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true } 
}, { timestamps: true });

module.exports = mongoose.model("BookDiscount", bookDiscountSchema);
 