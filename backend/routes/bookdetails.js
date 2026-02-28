const express = require('express');
const router = express.Router();
const uploadBookImage = require('../middlewares/uploadBook');
const bookdetailsController = require('../controllers/bookdetailsController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

router.get('/random', bookdetailsController.getRandomBooks);
router.get('/latest', bookdetailsController.getLatestBooks);
router.get('/search', bookdetailsController.searchBooks);
router.post('/buynow', bookdetailsController.buyNowCheckout);
router.get('/related/:id/:slug', bookdetailsController.getRelatedBooks);
router.get('/category/:id/:slug', bookdetailsController.getBooksByCategory);
router.get('/all/:id/:slug', bookdetailsController.getAllBooksByCategory);
router.get('/publisher/:id/:slug', bookdetailsController.getAllBooksByPublisher);


router.post(
  '/',
  verifyToken,
  verifyRole(['admin', 'employee']),
  uploadBookImage,
  bookdetailsController.createBookDetail
);

router.put(
  '/:id',
  verifyToken,
  verifyRole(['admin', 'employee']),
  uploadBookImage,
  bookdetailsController.updateBookDetail
);


router.get('/:id/:slug', bookdetailsController.getBookDetail);
router.get('/:id', bookdetailsController.getBookDetailById);

router.delete(
  '/:id',
  verifyToken,
  verifyRole(['admin']),
  bookdetailsController.deleteBookDetail
);

router.get('/', bookdetailsController.getAllBookDetails);

module.exports = router;