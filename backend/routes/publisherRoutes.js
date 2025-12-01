const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');
const publisherController = require('../controllers/publisherController');
const parser = require('../middlewares/uploadPublisher'); 

router.get('/all', publisherController.getAllPublisher);
router.get('/:id', publisherController.getPublisherById);

router.post(
  '/',
  verifyToken,
  verifyRole(['admin', 'employee']),
  parser.single('image'), 
  publisherController.createPublisher
);

router.put(
  '/:id',
  verifyToken,verifyRole(['admin', 'employee']),
  parser.single('image'),
  publisherController.updatePublisher
);

router.delete(
  '/:id',
  verifyToken,
  verifyRole(['admin']),
  publisherController.deletePublisher
);

module.exports = router;
