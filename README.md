📚 BookNest – MERN Stack Project

BookNest là một dự án website bán sách / đọc sách online được xây dựng theo kiến trúc MERN Stack, bao gồm các chức năng: xem chi tiết sách, tìm kiếm, giỏ hàng (nếu bạn thêm), lưu sách yêu thích, đăng nhập, cập nhật thông tin người dùng,…

📩 Liên hệ
Gmail: ducty9963@gmail.com
Facebook: https://www.facebook.com/eucyldt/

🚀 Công nghệ sử dụng

### 🔹 Frontend

- React.js
- Redux Toolkit
- Axios
- React Router
- TailwindCSS

### 🔹 Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT – xác thực người dùng
- bcryptjs – mã hóa mật khẩu

## 🎯 Chức năng chính

- Đăng ký, đăng nhập bằng JWT, đổi mật khẩu, lấy lại mật khẩu
- Xem, thêm sản phẩm giỏ hàng, mua hàng, thanh toán
- Tìm kiếm sách, loc theo giá, danh mục thể loại, nhà xuất bản
- Thêm sách vào danh sách yêu thích, đánh giá, bình luận
- Cập nhật thông tin cá nhân


## 📥 Cài đặt dự án

### 🔹 1. Clone dự án

```bash
git clone https://github.com/TyLeDuc9/BookStore.git
cd BookStore

⚙ Backend Setup
cd backend
npm install

🔹 Tạo file .env
MONGO_URL=mongodb://localhost:27017/yourdb
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_pass
CLIENT_URL=your_url_web
VNP_TMNCODE=your_vnpay_code
VNP_HASH_SECRET=your_secret_key

🔹 Chạy Backend
npm start

💻 Frontend Setup
🔹 Cài đặt thư viện
cd frontend
npm install

🔹 Tạo file .env

VITE_GOOGLE_CLIENT_ID=your_key

🔹 Chạy Frontend
npm run dev

🌐 Truy cập website

👉 https://bookstore-1-3bb1.onrender.com
```
