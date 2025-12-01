const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');
const favoriteController = require('../controllers/favoriteController');

// ✅ Quan trọng: để /all TRƯỚC /:userId
router.get("/all", verifyToken, verifyRole(['admin','employee']), favoriteController.getAllFavorites);

// Kiểm tra sản phẩm đã yêu thích
router.get('/check', favoriteController.isFavorite);

// Lấy danh sách sản phẩm yêu thích của user
router.get('/:userId', favoriteController.getFavoritesByUser);

// Thêm sản phẩm yêu thích
router.post('/', favoriteController.addFavorite);
router.delete('/:bookDetailId', favoriteController.deleteAllFavoritesByBookDetail);
// Xóa sản phẩm yêu thích
router.delete('/', favoriteController.removeFavorite);

module.exports = router;
