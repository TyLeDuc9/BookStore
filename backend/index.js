const dotenv = require('dotenv');
dotenv.config(); 
require("./cron/cartReminderCron");
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

// Import routes
const cagtegoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const authorRoutes = require('./routes/authorRoutes');
const publisherRoutes = require('./routes/publisherRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const bookRoutes = require('./routes/bookRoutes');
const bookdetails = require('./routes/bookdetails');
const cartRoutes = require('./routes/cartRoutes');
const shippingAdressRoutes = require('./routes/shippingAdressRoutes');
const bookDiscountRoutes= require('./routes/bookDiscountRoutes')
const orderRoutes=require('./routes/orderRoutes')
const orderDetailRoutes=require('./routes/orderDetailRoutes')
const favoriteRoutes=require('./routes/favoriteRoutes')
const ratingRoutes=require('./routes/ratingRoutes')
const commentRoutes=require('./routes/commentRoutes')
const blogRoutes=require('./routes/blogRoutes')
const paymentRoutes=require('./routes/paymentRoutes')
const app = express();

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/category', cagtegoryRoutes);
app.use('/user', userRoutes);
app.use('/author', authorRoutes);
app.use('/publisher', publisherRoutes);
app.use('/banner', bannerRoutes);
app.use('/book', bookRoutes);
app.use('/book-detail', bookdetails);
app.use('/cart', cartRoutes);
app.use('/shipping-address', shippingAdressRoutes);
app.use('/discount', bookDiscountRoutes)
app.use('/order', orderRoutes)
app.use('/order-detail', orderDetailRoutes)
app.use('/favorite', favoriteRoutes)
app.use('/rating', ratingRoutes)
app.use('/comment', commentRoutes)
app.use('/blog', blogRoutes)
app.use('/payment', paymentRoutes)
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});