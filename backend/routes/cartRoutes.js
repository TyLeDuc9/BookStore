const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');
const cartController = require('../controllers/cartController');

router.get('/', verifyToken, cartController.getCart);
router.get("/all", cartController.getAllCarts);
router.delete('/:id',verifyToken,verifyRole(['admin']), cartController.deleteCartById);
router.post('/add', verifyToken, cartController.addToCart);
router.put('/update', verifyToken, cartController.updateItem);
router.delete('/remove', verifyToken, cartController.removeItem);
router.delete('/clear', verifyToken, cartController.clearCart);

module.exports = router;
