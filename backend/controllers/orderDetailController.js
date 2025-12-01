const OrderDetail = require("../models/OrderDetail");
const Order = require("../models/Order"); 
// -------------------- Lấy chi tiết đơn hàng --------------------
exports.getOrderDetailsByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // ✅ Lấy đơn hàng để lấy phí ship
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    // ✅ Lấy chi tiết đơn hàng
    const details = await OrderDetail.find({ order_id: orderId })
      .populate({
        path: "bookdetail_id",
        populate: {
          path: "book_id",
          select: "name"
        }
      });

    // ✅ Trả về cùng phí ship
    res.json({
      shippingFee: order.shippingFee,   // thêm thông tin phí ship
      totalAmount: order.totalAmount,   // tổng tiền
      orderDetails: details
    });

  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy chi tiết đơn hàng", error: err.message });
  }
};
// -------------------- Lấy 1 chi tiết đơn hàng --------------------
exports.getOrderDetailById = async (req, res) => {
  try {
    const { detailId } = req.params;
    const detail = await OrderDetail.findById(detailId).populate("bookdetail_id");

    if (!detail) {
      return res.status(404).json({ message: "Không tìm thấy chi tiết đơn hàng" });
    }

    res.json(detail);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy chi tiết đơn hàng", error: err.message });
  }
};

// -------------------- Xóa chi tiết đơn hàng --------------------
exports.deleteOrderDetail = async (req, res) => {
  try {
    const { detailId } = req.params;
    await OrderDetail.findByIdAndDelete(detailId);

    res.json({ message: "Đã xóa chi tiết đơn hàng" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xóa chi tiết đơn hàng", error: err.message });
  }
};
