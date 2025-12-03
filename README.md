📩 Liên hệ

Gmail: ducty9963@gmail.com

Facebook: https://www.facebook.com/eucyldt/

🚀 Công nghệ sử dụng
🔹 Frontend

React.js

Redux Toolkit

Axios

React Router

Tailwind CSS

🔹 Backend

Node.js

Express.js

MongoDB / Mongoose

JWT – xác thực người dùng

bcryptjs – mã hóa mật khẩu

🎯 Chức năng chính

✔ Đăng ký, đăng nhập bằng JWT

✔ Đổi mật khẩu, quên mật khẩu

✔ Xem chi tiết sách

✔ Tìm kiếm theo tên, lọc theo giá, thể loại, nhà xuất bản

✔ Thêm sách vào danh sách yêu thích

✔ Đánh giá, bình luận sách

✔ Cập nhật thông tin cá nhân

✔ (Tuỳ chọn) Giỏ hàng, thanh toán VNPay

📥 Cài đặt dự án
🔹 1. Clone dự án
git clone https://github.com/TyLeDuc9/BookStore.git
cd BookStore

⚙ Backend Setup
📌 Cài đặt thư viện
cd backend
npm install

📌 Tạo file .env
MONGO_URL=mongodb://localhost:27017/yourdb
JWT_SECRET=your_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret_key

# Google Login
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_SECRET=your_secret_key

# Email Service
EMAIL_USER=your_email
EMAIL_PASS=your_pass

CLIENT_URL=your_frontend_url

# VNPay
VNP_TMNCODE=your_vnpay_code
VNP_HASH_SECRET=your_secret_key

📌 Chạy Backend
npm start

💻 Frontend Setup
📌 Cài đặt thư viện
cd frontend
npm install

📌 Tạo file .env
VITE_GOOGLE_CLIENT_ID=your_key

📌 Chạy Frontend
npm run dev

🌐 Truy cập website

👉 https://bookstore-1-3bb1.onrender.com