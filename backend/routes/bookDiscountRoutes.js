const express = require("express");
const router = express.Router();
const discountController = require("../controllers/bookDiscountController")
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');
// CRUD routes
router.get("/", discountController.getAllDiscounts);
router.post("/", verifyToken, verifyRole(['admin']), discountController.createDiscount);
router.get("/:id", discountController.getDiscountById);
router.get("/active", discountController.getActiveDiscount); // lấy discount hiện tại áp dụng toàn bộ
router.put("/:id", verifyToken, verifyRole(['admin']), discountController.updateDiscount);
router.delete("/:id", verifyToken, verifyRole(['admin']), discountController.deleteDiscount);

module.exports = router;
