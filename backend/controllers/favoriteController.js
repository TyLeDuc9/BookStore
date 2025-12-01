const Favorite = require('../models/Favorite');
const BookDetail = require('../models/BookDetails');
const User = require('../models/User');
const BookDiscount = require('../models/BookDiscount');
exports.deleteAllFavoritesByBookDetail = async (req, res) => {
  try {
    const { bookDetailId } = req.params;

    const result = await Favorite.deleteMany({ bookDetailId });

    res.status(200).json({
      message: `Đã xóa ${result.deletedCount} lượt thích của bookDetailId ${bookDetailId}`,
    });
  } catch (err) {
    console.error("❌ Lỗi xóa tất cả lượt thích theo bookDetailId:", err);
    res.status(500).json({ message: "Lỗi server khi xóa lượt thích" });
  }
};
exports.addFavorite = async (req, res) => {
  const { userId, bookDetailId } = req.body;

  try {
    // Kiểm tra tồn tại
    const existing = await Favorite.findOne({ userId, bookDetailId });
    if (existing) {
      return res.status(400).json({ message: "Sản phẩm đã có trong yêu thích" });
    }

    // Tạo mới
    const favorite = new Favorite({ userId, bookDetailId });
    await favorite.save();

    res.status(201).json({
      message: "Đã thêm vào yêu thích",
      favorite,
    });
  } catch (err) {
    console.error("❌ Lỗi thêm yêu thích:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
exports.removeFavorite = async (req, res) => {
  const { userId, bookDetailId } = req.body;

  try {
    const deleted = await Favorite.findOneAndDelete({ userId, bookDetailId });
    if (!deleted) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại trong yêu thích" });
    }

    res.status(200).json({ message: "Đã xóa khỏi yêu thích" });
  } catch (err) {
    console.error("❌ Lỗi xóa yêu thích:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
exports.getFavoritesByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // 1️⃣ Lấy danh sách yêu thích và populate chi tiết sách
    const favorites = await Favorite.find({ userId })
      .populate({
        path: 'bookDetailId',
        populate: { path: 'book_id', model: 'Book' },
      });

    // 2️⃣ Lấy các chương trình giảm giá đang hoạt động
    const now = new Date();
    const activeDiscounts = await BookDiscount.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    });

    // 3️⃣ Gắn giá giảm vào từng bookDetail
    const favoritesWithDiscount = favorites.map((fav) => {
      const bookDetail = fav.bookDetailId;

      if (!bookDetail) return fav; // nếu populate lỗi

      const price = bookDetail.price;

      // Giả sử chỉ có 1 chương trình giảm giá toàn hệ thống
      const discount = activeDiscounts.length > 0 ? activeDiscounts[0] : null;

      let finalPrice = price;
      if (discount) {
        if (discount.discountType === 'percentage') {
          finalPrice = price - (price * discount.value) / 100;
        } else if (discount.discountType === 'fixed') {
          finalPrice = Math.max(price - discount.value, 0);
        }
      }

      return {
        ...fav._doc,
        bookDetailId: {
          ...bookDetail._doc,
          finalPrice,
          discount: discount
            ? {
                title: discount.title,
                type: discount.discountType,
                value: discount.value,
              }
            : null,
        },
      };
    });

    // 4️⃣ Trả về kết quả
    res.status(200).json(favoritesWithDiscount);
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách yêu thích:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
exports.isFavorite = async (req, res) => {
  const { userId, bookDetailId } = req.query;

  try {
    const exists = await Favorite.findOne({ userId, bookDetailId });
    res.status(200).json({ isFavorite: !!exists });
  } catch (err) {
    console.error("❌ Lỗi kiểm tra yêu thích:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
exports.getAllFavorites = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const sortBy = req.query.sort || "newest";
    const skip = (page - 1) * limit;
    const sortOption = sortBy === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    const total = await Favorite.countDocuments();

    const favorites = await Favorite.find()
      .populate({ path: "userId", select: "name email" })
      .populate({
        path: "bookDetailId",
        populate: { path: "book_id", model: "Book" },
      })
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    // 🟢 Đếm số lượt thích cho từng cuốn (dùng cache để tối ưu)
    const countCache = new Map();
    for (const fav of favorites) {
      const bookDetailId = fav.bookDetailId?._id?.toString();
      if (bookDetailId && !countCache.has(bookDetailId)) {
        const count = await Favorite.countDocuments({ bookDetailId });
        countCache.set(bookDetailId, count);
      }
    }

    // 🟢 Gắn thêm trường "totalLikesOfBook"
    const favoritesWithCounts = favorites.map((fav) => ({
      ...fav._doc,
      totalLikesOfBook: countCache.get(fav.bookDetailId?._id?.toString()) || 0,
    }));

    res.status(200).json({
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      data: favoritesWithCounts,
    });
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách yêu thích:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
