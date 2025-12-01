// const cron = require("node-cron");
// const Cart = require("../models/Cart");
// const User = require("../models/User");
// const sendMail = require("../utils/sendMail");

// // Cron job test mỗi 30s
// cron.schedule("*/30 * * * * *", async () => {
//     console.log("⏳ Cron Job: Kiểm tra giỏ hàng bị bỏ quên (test 30s)...");

//     try {
//         // Lấy thời điểm 30 giây trước để test
//         const thirtySecondsAgo = Date.now() - 30 * 1000;

//         // Tìm các giỏ hàng "active" chưa gửi mail và có sản phẩm
//         const abandonedCarts = await Cart.find({
//             status: "active",
//             notified: false,
//             items: { $exists: true, $ne: [] },
//             addedAt: { $lte: thirtySecondsAgo }
//         });

//         console.log(`Tìm thấy ${abandonedCarts.length} giỏ hàng cần nhắc`);

//         for (const cart of abandonedCarts) {
//             const user = await User.findById(cart.user_id);
//             if (!user) continue;

//             console.log(`📧 Đang gửi email tới: ${user.email}`);

//             // Gửi mail nhắc giỏ hàng
//             await sendMail({
//                 to: user.email,
//                 subject: "Bạn quên giỏ hàng rồi?",
//                 html: `
//           <h2>Xin chào ${user.name},</h2>
//           <p>Bạn vẫn còn sản phẩm trong giỏ hàng tại<span style="color:#007bff; font-weight:bold;">BookNest</span></p>
//           <p>Hãy quay lại để hoàn tất đơn hàng nhé!</p>
//           <a href="http://localhost:5173/gio-hang"
//           style="color: #fff; background: #007bff; margin-top:4px; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">
//           Xem giỏ hàng
//           </a>

//         `
//             });

//             // Cập nhật trạng thái giỏ đã nhắc
//             cart.notified = true;
//             cart.status = "abandoned"; // không bắt buộc
//             await cart.save();

//             console.log(`✅ Đã gửi email và cập nhật giỏ hàng userId: ${cart.user_id}`);
//         }

//         console.log("✅ Cron Job hoàn thành (test 30s).");
//     } catch (error) {
//         console.error("❌ Cron Job Error:", error);
//     }
// });
