const mongoose = require('mongoose');

const bookDetailSchema = new mongoose.Schema({
    edition: { type: String },  // lần in
    pages: { type: Number },
    language: { type: String },
    stock_quantity: { type: Number, default: 0, min: 0 },
    dimensions: { type: String }, // ví dụ: "20x13x2 cm"
    weight: { type: Number }, // tính theo gram hoặc kg
    publication_year: { type: Number },
    cover_type: { type: String, enum: ['bìa mềm', 'bìa cứng'], default: 'bìa mềm' },
    volume: { type: Number },
    isbn: { type: String, unique: true, required: true }, // <-- Thêm ISBN
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    images: [{ type: String }],
    price: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('BookDetail', bookDetailSchema);
