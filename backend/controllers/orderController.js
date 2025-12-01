const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const OrderDetail = require("../models/OrderDetail");
const BookDetail=require("../models/BookDetails")
const ShippingAddress = require("../models/ShippingAddress");

exports.revenue = async (req, res) => {
  try {
    const type = req.query.type || "day"; // day, month, year
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const sortType = req.query.sort === "asc" ? 1 : -1;
    const skip = (page - 1) * limit;
    let groupStage = {};
    let sortStage = {};

    if (type === "day") {
      groupStage = {
        _id: {
          day: { $dayOfMonth: "$createdAt" },
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" }
        },
        totalRevenue: { $sum: "$totalAmount" },
        totalOrders: { $sum: 1 },
        date: { $first: "$createdAt" } // thêm trường này
      };

      sortStage = { date: req.query.sort === "oldest" ? 1 : -1 }; // sort giống getAllOrders
    } else if (type === "month") {
      groupStage = {
        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
        totalRevenue: { $sum: "$totalAmount" },
        totalOrders: { $sum: 1 },
        date: { $first: "$createdAt" }
      };
      sortStage = { date: req.query.sort === "oldest" ? 1 : -1 };
    } else if (type === "year") {
      groupStage = {
        _id: { year: { $year: "$createdAt" } },
        totalRevenue: { $sum: "$totalAmount" },
        totalOrders: { $sum: 1 },
        date: { $first: "$createdAt" }
      };
      sortStage = { date: req.query.sort === "oldest" ? 1 : -1 };
    }
    // ======= QUERY LẤY DATA PHÂN TRANG =======
    const data = await Order.aggregate([
      { $match: { status: "completed" } },
      { $group: groupStage },
      { $sort: sortStage },
      { $skip: skip },
      { $limit: limit }
    ]);

    // ======= TÍNH TỔNG GROUP =======
    const totalGroups = await Order.aggregate([
      { $match: { status: "completed" } },
      { $group: groupStage }
    ]);

    const total = totalGroups.length;
    const totalPages = Math.ceil(total / limit);

    return res.json({
      pagination: {
        total,
        page,
        limit,
        totalPages
      },
      data
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
// ================== HELPER ==================
const calculateShippingFee = (totalPrice) => {
  return totalPrice > 300000 ? 0 : 25000;
};


exports.createOrderBuyNow = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, shippingAddressId, bookdetailId, quantity, paymentMethod } = req.body;

    if (!userId || !shippingAddressId || !bookdetailId || !quantity) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    // Lấy thông tin sách
    const bookDetail = await BookDetail.findById(bookdetailId);
    if (!bookDetail) return res.status(404).json({ message: "Sản phẩm không tồn tại" });

    // ⭐ KIỂM TRA TỒN KHO
    if (bookDetail.stock_quantity < quantity) {
      return res.status(400).json({
        message: "Sản phẩm không đủ số lượng trong kho",
      });
    }

    // ⭐ TRỪ STOCK
    await BookDetail.updateOne(
      { _id: bookdetailId },
      { $inc: { stock_quantity: -quantity } },
      { session }
    );

    // Lấy địa chỉ giao hàng
    const address = await ShippingAddress.findById(shippingAddressId);
    if (!address) return res.status(404).json({ message: "Địa chỉ giao hàng không tồn tại" });

    // Tính tổng tiền
    const totalPrice = bookDetail.price * quantity;
    const shippingFee = calculateShippingFee(totalPrice);
    const totalAmount = totalPrice + shippingFee;

    // Tạo order
    const newOrder = await Order.create(
      [
        {
          userId,
          shippingAddress: shippingAddressId,
          paymentMethod: paymentMethod || "COD",
          paymentStatus: "pending",
          totalQuantity: quantity,
          totalPrice,
          shippingFee,
          totalAmount,
          status: "pending",
        },
      ],
      { session }
    );

    // Tạo chi tiết đơn hàng
    const orderDetail = await OrderDetail.create(
      [
        {
          order_id: newOrder[0]._id,
          bookdetail_id: bookdetailId,
          quantity,
          price: bookDetail.price,
          originalPrice: bookDetail.originalPrice || bookDetail.price,
          subtotal: totalPrice,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Mua ngay thành công!",
      order: newOrder[0],
      orderDetail: orderDetail[0],
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ Lỗi mua ngay:", error);
    res.status(500).json({ message: "Lỗi server khi mua ngay", error });
  }
};
// ================== UPDATE ORDER STATUS ==================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatus = ["pending", "confirmed", "completed", "cancelled"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    // Tạo object update
    const updateData = { status };

    // 🔥 Logic tự cập nhật trạng thái thanh toán
    if (status === "completed") {
      updateData.paymentStatus = "paid";
    }
    if (status === "cancelled") {
      updateData.paymentStatus = "failed";
    }

    // Cập nhật DB
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái thành công",
      order: updatedOrder,
    });

  } catch (error) {
    console.error("❌ Lỗi update trạng thái:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật trạng thái" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu orderId",
      });
    }

    // --- Lấy thông tin Order ---
    const order = await Order.findById(orderId)
      .populate("userId", "fullName email phone")
      .populate("shippingAddress");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    // --- Lấy chi tiết đơn hàng và populate tên sách ---
    const orderDetails = await OrderDetail.find({ order_id: orderId })
      .populate({
        path: "bookdetail_id",
        populate: {
          path: "book_id",      // populate từ BookDetail -> Book
          select: "name",       // chỉ lấy trường name
        },
      });

    return res.status(200).json({
      success: true,
      order: {
        ...order.toObject(),
        orderDetails,
      },
    });

  } catch (error) {
    console.error("❌ Lỗi khi lấy đơn hàng theo ID:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy chi tiết đơn hàng",
    });
  }
};

exports.getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.query; // pending, confirmed, completed, cancelled
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const sortType = req.query.sort || "newest";
    const sortValue = sortType === "oldest" ? 1 : -1;

    // Tổng số đơn theo status
    const total = await Order.countDocuments({ status });

    // Lấy đơn hàng theo status
    const orders = await Order.find({ status })
      .populate("userId", "fullName email phone")
      .populate("shippingAddress")
      .sort({ createdAt: sortValue })
      .skip(skip)
      .limit(limit);

    const finalList = [];
    for (let order of orders) {
      const details = await OrderDetail.find({ order_id: order._id }).populate("bookdetail_id");
      finalList.push({ ...order.toObject(), orderDetails: details });
    }

    return res.status(200).json({
      success: true,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      orders: finalList,
    });

  } catch (err) {
    console.error("Lỗi lấy đơn hàng:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
exports.getAllOrders = async (req, res) => {
  try {
    // --- Phân trang ---
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // --- Sort: newest | oldest ---
    const sortType = req.query.sort || "newest";
    const sortValue = sortType === "oldest" ? 1 : -1;

    // --- Tổng số đơn ---
    const totalOrders = await Order.countDocuments();

    // --- Lấy danh sách đơn hàng ---
    const orders = await Order.find()
      .populate("userId", "fullName email phone")
      .populate("shippingAddress")
      .sort({ createdAt: sortValue })  // ⭐ Sort theo newest/oldest
      .skip(skip)
      .limit(limit);

    // --- Lấy orderDetails cho từng order ---
    const finalList = [];

    for (let order of orders) {
      const details = await OrderDetail.find({ order_id: order._id })
        .populate("bookdetail_id");

      finalList.push({
        ...order.toObject(),
        orderDetails: details,
      });
    }

    return res.status(200).json({
      success: true,
      page,
      limit,
      totalOrders,
      orders: finalList,
    });

  } catch (err) {
    console.error("Lỗi lấy tất cả đơn hàng:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
// ================== CREATE ORDER FROM CART ==================
exports.createOrderFromCart = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, shippingAddressId, paymentMethod } = req.body;

    if (!userId || !shippingAddressId) {
      return res.status(400).json({ message: "Thiếu thông tin người dùng hoặc địa chỉ giao hàng" });
    }

    // Lấy giỏ hàng
    const cart = await Cart.findOne({ user_id: userId, status: "active" })
      .populate("items.bookdetail_id");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống" });
    }

    // Lấy địa chỉ
    const address = await ShippingAddress.findById(shippingAddressId);
    if (!address) {
      return res.status(404).json({ message: "Địa chỉ giao hàng không tồn tại" });
    }

    // ⭐ KIỂM TRA TỒN KHO TRƯỚC
    for (const item of cart.items) {
      if (item.bookdetail_id.stock_quantity < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: `Sản phẩm '${item.bookdetail_id.isbn}' không đủ số lượng`,
        });
      }
    }

    // ⭐ TRỪ KHO TỪNG SẢN PHẨM
    for (const item of cart.items) {
      await BookDetail.updateOne(
        { _id: item.bookdetail_id._id },
        { $inc: { stock_quantity: -item.quantity } },
        { session }
      );
    }

    // Tính phí ship
    const shippingFee = calculateShippingFee(cart.totalPrice);
    const totalAmount = cart.totalPrice + shippingFee;

    // Tạo Order
    const newOrder = await Order.create(
      [
        {
          userId,
          shippingAddress: shippingAddressId,
          paymentMethod: paymentMethod || "COD",
          paymentStatus: "pending",
          totalQuantity: cart.totalQuantity,
          totalPrice: cart.totalPrice,
          shippingFee,
          totalAmount,
          status: "pending",
        },
      ],
      { session }
    );

    // Tạo OrderDetail
    const orderDetails = cart.items.map((item) => ({
      order_id: newOrder[0]._id,
      bookdetail_id: item.bookdetail_id._id,
      quantity: item.quantity,
      price: item.price,
      originalPrice: item.bookdetail_id.originalPrice || item.price,
      subtotal: item.quantity * item.price,
    }));

    await OrderDetail.insertMany(orderDetails, { session });

    // Cập nhật giỏ hàng đã đặt
    cart.status = "ordered";
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Đặt hàng thành công!",
      order: newOrder[0],
      orderDetails,
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ Lỗi khi tạo đơn hàng:", error.message);
    console.error(error.stack); // ⭐ In lỗi chi tiết
    return res.status(500).json({
      message: "Lỗi server khi tạo đơn hàng",
      error: error.message
    });
  }
};

// ================== GET ALL ORDERS BY USER ==================
exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Lấy page và limit từ query, mặc định page=1, limit=20
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Tổng số đơn hàng
    const total = await Order.countDocuments({ userId });

    // Lấy đơn hàng theo phân trang
    const orders = await Order.find({ userId })
      .populate("shippingAddress")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      orders,
    });
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách đơn hàng:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách đơn hàng" });
  }
};


