const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware')
router.get("/",  verifyToken, verifyRole(['admin', 'employee']), commentController.getAllComments);
// 📌 Tạo bình luận (chỉ người đăng nhập mới được bình luận)
router.post("/", verifyToken, commentController.createComment);

// 📌 Lấy bình luận theo sách
router.get("/book/:bookId", commentController.getCommentsByBook);

// 📌 Lấy bình luận theo người dùng
router.get("/user/:userId", commentController.getCommentsByUser);

router.delete("/:bookId",  verifyToken, verifyRole(['admin']), commentController.deleteAllCommentsByBook);
// 📌 Cập nhật bình luận (chỉ chủ sở hữu)
router.put("/:commentId", verifyToken, commentController.updateComment);

// 📌 Xóa bình luận (chỉ chủ sở hữu)
router.delete("/:commentId", verifyToken, commentController.deleteComment);

module.exports = router;
