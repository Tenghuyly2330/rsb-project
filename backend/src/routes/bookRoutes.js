const express = require('express');
const {
      getBooks,
      getUserBooks,
      getBook,
      createBook,
      updateBook,
      deleteBook,
      getStats
} = require('../controllers/bookController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/my', protect, getUserBooks);
router.get('/admin/stats', protect, authorize('admin'), getStats);

router
      .route('/')
      .get(getBooks)
      .post(protect, createBook);

router
      .route('/:id')
      .get(getBook)
      .put(protect, updateBook)
      .delete(protect, deleteBook);

module.exports = router;