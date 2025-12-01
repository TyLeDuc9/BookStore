const express = require("express");
const router = express.Router();
const orderDetailController = require("../controllers/orderDetailController");

router.get("/:orderId", orderDetailController.getOrderDetailsByOrder); // Lấy chi tiết theo orderId
router.get("/:detailId", orderDetailController.getOrderDetailById); // Lấy 1 chi tiết
router.delete("/:detailId", orderDetailController.deleteOrderDetail); // Xóa 1 chi tiết

module.exports = router;
