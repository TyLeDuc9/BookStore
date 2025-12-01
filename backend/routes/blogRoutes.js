const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');
const uploadBlogImages = require('../middlewares/uploadBlog');

// 🟩 Phải verifyToken trước verifyRole
router.post("/", verifyToken, verifyRole(['admin', 'employee']), uploadBlogImages, blogController.createBlog);
router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);
router.put("/:id", verifyToken, verifyRole(['admin', 'employee']), uploadBlogImages, blogController.updateBlog);
router.delete("/:id", verifyToken, verifyRole(['admin', 'employee']), blogController.deleteBlog);

module.exports = router;
