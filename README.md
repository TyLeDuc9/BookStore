# BookNest – MERN Stack Bookstore
BookNest là một website bán sách và đọc sách online được xây dựng bằng MERN Stack (MongoDB, Express.js, React.js, Node.js).

Dự án mô phỏng một hệ thống E-commerce thực tế, cho phép người dùng tìm kiếm sách, xem chi tiết, mua sách, lưu sách yêu thích, đánh giá và bình luận, đồng thời cung cấp trang quản trị dành cho Admin và Employee để quản lý sản phẩm, đơn hàng và người dùng.

🔹Demo Website
🔹https://bookstore-1-3bb1.onrender.com

Công nghệ sử dụng
🔹 Frontend
- React.js – xây dựng giao diện người dùng
- Redux Toolkit – quản lý state toàn cục
- Axios – gọi API từ backend
- React Router – điều hướng trang
- TailwindCSS – thiết kế giao diện responsive
- React Icons – sử dụng icon UI

🔹 Backend
- Node.js
- Express.js – xây dựng RESTful API
- MongoDB – cơ sở dữ liệu NoSQL
- Mongoose – ORM cho MongoDB
- JWT (JSON Web Token) – xác thực người dùng
- bcryptjs – mã hóa mật khẩu
- Cloudinary – upload và lưu trữ hình ảnh
- Nodemailer – gửi email reset mật khẩu
- VNPay Payment Gateway – thanh toán online
- Google OAuth – đăng nhập bằng Google

🔹 Chức năng chính
- Người dùng (User)
- Đăng ký tài khoản
- Đăng nhập bằng JWT Authentication
- Đăng nhập bằng Google OAuth
- Cập nhật thông tin cá nhân
- Đổi mật khẩu
- Quên mật khẩu và đặt lại mật khẩu qua email
- Xem danh sách sách
- Xem chi tiết sách
- Tìm kiếm sách theo tên
- Lọc sách theo:
- Giá
- Danh mục
- Nhà xuất bản
- Thêm sách vào giỏ hàng
- Đặt hàng và thanh toán
- Thêm sách vào danh sách yêu thích
- Đánh giá và bình luận sách

🔹 Hệ thống đơn hàng
- Quản lý giỏ hàng
- Tạo đơn hàng
- Thanh toán online (VNPay)
- Theo dõi trạng thái đơn hàng
- Lưu địa chỉ giao hàng

🔹 Admin / Employee Dashboard
- Quản lý sách
- Quản lý danh mục
- Quản lý nhà xuất bản
- Quản lý đơn hàng
- Quản lý người dùng
- Phân quyền Admin / Employee / User

🔹Tài khoản demo
- Admin: Admin@gmail.com | password:123456
- Employee: minh@gmail.com | password:123456
- Khi đăng nhập có quyền admin hoặc employee ở phần đầu trang sẽ hiển thị dashboard. Khi click vào sẽ điều hướng
đến trang quản lý và phân quyền tương thích.