const Blog = require("../models/Blog");
const Book = require("../models/Book");

// =================== CREATE BLOG ===================
// =================== CREATE BLOG ===================
exports.createBlog = async (req, res) => {
  try {
    const { title, content, bookName } = req.body;

    if (!title || !content || !bookName) {
      return res.status(400).json({
        success: false,
        message: "Thiếu dữ liệu bắt buộc (title, content, bookName)",
      });
    }

    // ✅ Tìm sách theo tên (không phân biệt hoa/thường)
    const book = await Book.findOne({
      name: { $regex: new RegExp(bookName, "i") },
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sách có tên này",
      });
    }

    // ✅ Lấy danh sách ảnh từ Cloudinary
    const images = req.files?.map((file) => file.path) || [];

    // ✅ Tạo blog mới
    const blog = await Blog.create({
      title,
      content,
      bookId: book._id,
      images,
    });

    res.status(201).json({
      success: true,
      message: "Tạo blog thành công",
      blog,
    });
  } catch (error) {
    console.error("Lỗi khi tạo blog:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo blog",
      error: error.message,
    });
  }
};

// =================== GET ALL BLOGS ===================
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate({
        path: "bookId",
        select: "name author_id publisher_id",
        populate: [
          {
            path: "author_id",
            select: "name", // ✅ lấy tên tác giả
          },
          {
            path: "publisher_id",
            select: "name", // ✅ lấy tên nhà xuất bản (nếu cần)
          },
        ],
      })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      total: blogs.length,
      blogs,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách blog:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách blog",
      error: error.message,
    });
  }
};

// =================== GET BLOG BY ID ===================
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id)
      .populate("bookId", "name author_id publisher_id")
      .lean();

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy blog này",
      });
    }

    res.status(200).json({ success: true, blog });
  } catch (error) {
    console.error("Lỗi khi lấy blog theo ID:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy blog",
      error: error.message,
    });
  }
};

// =================== UPDATE BLOG ===================
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, bookName } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy blog để cập nhật",
      });
    }

    if (title) blog.title = title;
    if (content) blog.content = content;

    // ✅ Cập nhật sách nếu nhập tên mới
    if (bookName) {
      const book = await Book.findOne({
        name: { $regex: new RegExp(bookName, "i") },
      });
      if (!book) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy sách có tên này",
        });
      }
      blog.bookId = book._id;
    }

    // ✅ Nếu có upload ảnh mới thì ghi đè
    if (req.files && req.files.length > 0) {
      blog.images = req.files.map((file) => file.path);
    }

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Cập nhật blog thành công",
      blog,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật blog:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật blog",
      error: error.message,
    });
  }
};


// =================== DELETE BLOG ===================
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy blog để xóa",
      });
    }

    await blog.deleteOne();
    res.status(200).json({
      success: true,
      message: "Xóa blog thành công",
    });
  } catch (error) {
    console.error("Lỗi khi xóa blog:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa blog",
      error: error.message,
    });
  }
};
