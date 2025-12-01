const Comment = require("../models/Comment");
exports.deleteAllCommentsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!bookId) {
      return res.status(400).json({ message: "Thiếu bookId!" });
    }

    // Kiểm tra xem có bình luận nào của sách này không
    const existingComments = await Comment.find({ bookId });
    if (existingComments.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy bình luận nào cho cuốn sách này!",
      });
    }

    // Xóa tất cả bình luận theo bookId
    const result = await Comment.deleteMany({ bookId });

    res.status(200).json({
      message: `Đã xóa ${result.deletedCount} bình luận của sách ${bookId}`,
    });
  } catch (error) {
    console.error("Lỗi khi xóa bình luận:", error);
    res.status(500).json({
      message: "Đã xảy ra lỗi khi xóa bình luận của sách!",
      error: error.message,
    });
  }
};

exports.getAllComments = async (req, res) => {
  try {
    // 📌 Lấy query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const sortBy = req.query.sort || "newest"; // newest | oldest
    const skip = (page - 1) * limit;

    // 📌 Sắp xếp
    const sortOption = sortBy === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    // 📌 Đếm tổng số bình luận
    const total = await Comment.countDocuments();

    // 📌 Lấy danh sách có phân trang
    const comments = await Comment.find()
      .populate("userId", "name email") // người bình luận
      .populate("bookId", "name") // sách
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    // 📌 Trả về dữ liệu
    res.status(200).json({
      message: "Lấy tất cả bình luận thành công!",
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      data: comments,
    });
  } catch (error) {
    console.error("❌ Lỗi server khi lấy tất cả bình luận:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};


// 📌 Tạo bình luận mới
exports.createComment = async (req, res) => {
  try {
    const { bookId, description, isAnonymous } = req.body;
    const userId = req.user.id; // Lấy từ JWT

    if (!bookId || !description) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc." });
    }

    const newComment = new Comment({
      userId,
      bookId,
      description,
      isAnonymous,
    });

    await newComment.save();

    res.status(201).json({
      message: "Thêm bình luận thành công!",
      comment: newComment,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi tạo bình luận", error });
  }
};

// 📌 Lấy tất cả bình luận theo bookId
exports.getCommentsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const comments = await Comment.find({ bookId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy bình luận", error });
  }
};

// 📌 Lấy tất cả bình luận theo userId
exports.getCommentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const comments = await Comment.find({ userId })
      .populate("bookId", "title author")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy bình luận của người dùng", error });
  }
};

// 📌 Cập nhật bình luận (chỉ cho phép chủ sở hữu)
exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { description } = req.body;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Không tìm thấy bình luận." });
    }

    // Kiểm tra quyền sở hữu
    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ message: "Bạn không có quyền sửa bình luận này." });
    }

    comment.description = description;
    await comment.save();

    res.status(200).json({
      message: "Cập nhật bình luận thành công!",
      comment,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi cập nhật bình luận", error });
  }
};

// 📌 Xóa bình luận (chỉ cho phép chủ sở hữu)
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Không tìm thấy bình luận." });
    }

    // Kiểm tra quyền sở hữu
    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ message: "Bạn không có quyền xóa bình luận này." });
    }

    await comment.deleteOne();

    res.status(200).json({ message: "Xóa bình luận thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi xóa bình luận", error });
  }
};
