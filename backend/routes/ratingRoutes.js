const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");

// 🟢 Tạo hoặc thêm rating mới
router.post("/", ratingController.createRating);

// 🟢 Kiểm tra người dùng đã rating chưa
router.get("/check", ratingController.checkUserRated);

// 🟢 Thống kê tất cả sách kèm số lượt và trung bình rating
router.get("/summary", ratingController.getAllBooksWithRatings);

// 🟢 Lấy danh sách rating theo sách
router.get("/book/:bookId", ratingController.getRatingsByBook);

// 🟢 Lấy danh sách rating theo user
router.get("/user/:userId", ratingController.getRatingsByUser);

// 🟢 Cập nhật rating (ví dụ khi user đổi điểm)
router.put("/:id", ratingController.updateRating);
router.delete("/:bookId", ratingController.deleteAllRatingsByBook);
// 🟢 Xóa rating theo id
router.delete("/:id", ratingController.deleteRating);

module.exports = router;
