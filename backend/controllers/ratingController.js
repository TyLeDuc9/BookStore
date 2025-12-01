const Rating = require("../models/Rating");
const Book = require("../models/Book");
const mongoose = require("mongoose");
exports.deleteAllRatingsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    if (!bookId) {
      return res.status(400).json({ message: "Thiếu bookId trong yêu cầu." });
    }
    const result = await Rating.deleteMany({ bookId });

    return res.status(200).json({
      message: `Đã xóa tất cả đánh giá của sách có ID: ${bookId}`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Lỗi khi xóa rating:", error);
    return res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
};
exports.getAllBooksWithRatings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const sortOption = req.query.sort || "newest";
    const skip = (page - 1) * limit;

    const pipeline = [
      // Gom nhóm theo bookId + userId để tính rating của từng người
      {
        $group: {
          _id: { bookId: "$bookId", userId: "$userId" },
          rating: { $avg: "$rating" }, // nếu 1 user có thể rate nhiều lần, lấy trung bình
          latestCreatedAt: { $max: "$createdAt" },
        },
      },
      // Gom nhóm lại theo bookId
      {
        $group: {
          _id: "$_id.bookId",
          totalRatings: { $sum: 1 },
          averageRating: { $avg: "$rating" },
          users: {
            $push: {
              userId: "$_id.userId",
              rating: "$rating",
            },
          },
          latestCreatedAt: { $max: "$latestCreatedAt" },
        },
      },
      // Lấy thông tin sách
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: "$book" },
      // Lấy thông tin user
      {
        $lookup: {
          from: "users",
          localField: "users.userId",
          foreignField: "_id",
          as: "userInfos",
        },
      },
      // Kết hợp user info với rating tương ứng
      {
        $addFields: {
          users: {
            $map: {
              input: "$users",
              as: "u",
              in: {
                $mergeObjects: [
                  "$$u",
                  {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$userInfos",
                          as: "info",
                          cond: { $eq: ["$$info._id", "$$u.userId"] },
                        },
                      },
                      0,
                    ],
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          bookId: "$_id",
          "book.name": 1,
          totalRatings: 1,
          averageRating: { $round: ["$averageRating", 1] },
          users: {
            _id: 1,
            name: 1,
            email: 1,
            rating: 1,
          },
          latestCreatedAt: 1,
        },
      },
      {
        $sort:
          sortOption === "oldest"
            ? { latestCreatedAt: 1 }
            : { latestCreatedAt: -1 },
      },
      { $skip: skip },
      { $limit: limit },
    ];

    // Đếm tổng số sách có rating
    const totalCountAgg = await Rating.aggregate([
      { $group: { _id: "$bookId" } },
      { $count: "total" },
    ]);
    const total = totalCountAgg[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    const result = await Rating.aggregate(pipeline);

    res.json({
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


exports.createRating = async (req, res) => {
  try {
    const { bookId, rating } = req.body;
    const userId = req.user?._id || req.body.userId;

    if (!bookId || rating === undefined) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc." });
    }

    // Kiểm tra rating hiện tại của user
    const existing = await Rating.findOne({ userId, bookId });

    if (existing) {
      if (rating === 0) {
        // Nếu rating = 0 => xóa
        await existing.deleteOne();
        return res.status(200).json({ message: "Đã xóa đánh giá." });
      } else {
        // Nếu đã đánh giá và rating khác 0 => cập nhật
        existing.rating = rating;
        existing.updatedAt = new Date();
        const updated = await existing.save();
        return res.status(200).json(updated);
      }
    }

    if (rating === 0) {
      // Nếu chưa có đánh giá mà rating=0 => không làm gì
      return res.status(200).json({ message: "Chưa có đánh giá để xóa." });
    }

    // Nếu chưa đánh giá, tạo mới
    const newRating = new Rating({ userId, bookId, rating });
    const saved = await newRating.save();
    res.status(201).json(saved);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRatingsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const ratings = await Rating.find({ bookId })
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 Lấy tất cả đánh giá của một user
exports.getRatingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const ratings = await Rating.find({ userId })
      .populate("bookId", "title author")
      .sort({ createdAt: -1 });

    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 Cập nhật đánh giá
exports.updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    const updated = await Rating.findByIdAndUpdate(
      id,
      { rating, updatedAt: new Date() },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Không tìm thấy đánh giá." });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 Xóa đánh giá
exports.deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Rating.findByIdAndDelete(id);

    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy đánh giá." });

    res.status(200).json({ message: "Đã xóa đánh giá thành công." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.checkUserRated = async (req, res) => {
  try {
    const { userId, bookId } = req.query;
    const existing = await Rating.findOne({ userId, bookId });
    res.json({ isRated: !!existing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
