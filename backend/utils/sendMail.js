const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = async function sendMail({ to, subject, html }) {
  try {
    await transporter.sendMail({
      from: `"Book Store" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log(`✅ Email đã gửi tới ${to}`);
  } catch (err) {
    console.error("❌ Lỗi gửi mail:", err);
    throw err;
  }
};