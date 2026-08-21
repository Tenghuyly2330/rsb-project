const express = require('express');
const {
      borrowBook,
      approveBorrow,
      rejectBorrow,
      getOwnerRequests,
      returnBook,
      getUserBorrows,
      getAllBorrows
} = require('../controllers/borrowController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/:bookId', protect, borrowBook);
router.post('/approve/:borrowId', protect, approveBorrow);
router.post('/reject/:borrowId', protect, rejectBorrow);
router.get('/requests', protect, getOwnerRequests);
router.post('/return/:borrowId', protect, returnBook);
router.get('/my', protect, getUserBorrows);
router.get('/all', protect, authorize('admin'), getAllBorrows);

module.exports = router;
