const borrowService = require('../services/borrowService');

exports.borrowBook = async (req, res, next) => {
      try {
            const borrow = await borrowService.borrowBook(req.user._id, req.params.bookId);
            res.status(201).json({
                  success: true,
                  message: 'Borrow request submitted successfully. Awaiting book owner approval.',
                  data: borrow
            });
      } catch (err) {
            next(err);
      }
};

exports.approveBorrow = async (req, res, next) => {
      try {
            const isAdmin = req.user.role === 'admin';
            const borrow = await borrowService.approveBorrow(req.user._id, req.params.borrowId, isAdmin);
            res.status(200).json({
                  success: true,
                  message: 'Borrow request approved successfully',
                  data: borrow
            });
      } catch (err) {
            next(err);
      }
};

exports.rejectBorrow = async (req, res, next) => {
      try {
            const isAdmin = req.user.role === 'admin';
            const borrow = await borrowService.rejectBorrow(req.user._id, req.params.borrowId, isAdmin);
            res.status(200).json({
                  success: true,
                  message: 'Borrow request rejected',
                  data: borrow
            });
      } catch (err) {
            next(err);
      }
};

exports.getOwnerRequests = async (req, res, next) => {
      try {
            const requests = await borrowService.getOwnerBorrowRequests(req.user._id);
            res.status(200).json({
                  success: true,
                  data: requests
            });
      } catch (err) {
            next(err);
      }
};

exports.returnBook = async (req, res, next) => {
      try {
            const isAdmin = req.user.role === 'admin';
            const borrow = await borrowService.returnBook(req.user._id, req.params.borrowId, isAdmin);
            res.status(200).json({
                  success: true,
                  message: 'Book returned successfully',
                  data: borrow
            });
      } catch (err) {
            next(err);
      }
};

exports.getUserBorrows = async (req, res, next) => {
      try {
            const borrows = await borrowService.getUserBorrows(req.user._id);
            res.status(200).json({
                  success: true,
                  data: borrows
            });
      } catch (err) {
            next(err);
      }
};

exports.getAllBorrows = async (req, res, next) => {
      try {
            const borrows = await borrowService.getAllBorrows();
            res.status(200).json({
                  success: true,
                  data: borrows
            });
      } catch (err) {
            next(err);
      }
};
