const Borrow = require('../models/Borrow');
const Book = require('../models/Book');
const ErrorResponse = require('../utils/errorResponse');

exports.borrowBook = async (userId, bookId) => {
      const book = await Book.findById(bookId);
      if (!book) {
            throw new ErrorResponse('Book not found', 404);
      }

      if (book.stock <= 0) {
            throw new ErrorResponse('Book is currently out of stock', 400);
      }

      if (book.addedBy && book.addedBy.toString() === userId.toString()) {
            throw new ErrorResponse('You cannot borrow a book that you created yourself', 400);
      }

      const existingBorrow = await Borrow.findOne({
            book: bookId,
            borrower: userId,
            status: { $in: ['pending', 'borrowed'] }
      });

      if (existingBorrow) {
            if (existingBorrow.status === 'pending') {
                  throw new ErrorResponse('Your borrow request is already pending owner approval', 400);
            }
            throw new ErrorResponse('You are currently borrowing this book', 400);
      }

      const borrow = await Borrow.create({
            book: bookId,
            borrower: userId,
            owner: book.addedBy || null,
            status: 'pending'
      });

      return await Borrow.findById(borrow._id).populate('book borrower', 'name email');
};

exports.approveBorrow = async (userId, borrowId, isAdmin = false) => {
      const borrow = await Borrow.findById(borrowId).populate('book');
      if (!borrow) {
            throw new ErrorResponse('Borrow request not found', 404);
      }

      if (borrow.status !== 'pending') {
            throw new ErrorResponse(`Request is already ${borrow.status}`, 400);
      }

      if (!isAdmin && borrow.owner && borrow.owner.toString() !== userId.toString()) {
            throw new ErrorResponse('Not authorized to approve this borrow request', 403);
      }

      if (borrow.book.stock <= 0) {
            throw new ErrorResponse('Book is currently out of stock', 400);
      }

      borrow.status = 'borrowed';
      borrow.borrowDate = new Date();
      borrow.dueDate = new Date(+new Date() + 7 * 24 * 60 * 60 * 1000);
      await borrow.save();

      const book = await Book.findById(borrow.book._id);
      if (book) {
            book.stock -= 1;
            await book.save();
      }

      return await Borrow.findById(borrow._id).populate('book borrower owner', 'name email');
};

exports.rejectBorrow = async (userId, borrowId, isAdmin = false) => {
      const borrow = await Borrow.findById(borrowId);
      if (!borrow) {
            throw new ErrorResponse('Borrow request not found', 404);
      }

      if (borrow.status !== 'pending') {
            throw new ErrorResponse(`Request is already ${borrow.status}`, 400);
      }

      if (!isAdmin && borrow.owner && borrow.owner.toString() !== userId.toString()) {
            throw new ErrorResponse('Not authorized to reject this borrow request', 403);
      }

      borrow.status = 'rejected';
      await borrow.save();

      return await Borrow.findById(borrow._id).populate('book borrower owner', 'name email');
};

exports.getOwnerBorrowRequests = async (ownerId) => {
      return await Borrow.find({ owner: ownerId })
            .populate('book')
            .populate('borrower', 'name email')
            .sort({ createdAt: -1 });
};

exports.getUserBorrows = async (userId) => {
      return await Borrow.find({ borrower: userId })
            .populate('book')
            .sort({ createdAt: -1 });
};

exports.returnBook = async (userId, borrowId, isAdmin = false) => {
      const borrow = await Borrow.findById(borrowId);
      if (!borrow) {
            throw new ErrorResponse('Borrow record not found', 404);
      }

      if (borrow.status === 'returned') {
            throw new ErrorResponse('This book has already been returned', 400);
      }

      if (!isAdmin && borrow.borrower.toString() !== userId.toString()) {
            throw new ErrorResponse('Not authorized to return this borrowed book', 403);
      }

      borrow.status = 'returned';
      borrow.returnDate = Date.now();
      await borrow.save();

      const book = await Book.findById(borrow.book);
      if (book) {
            book.stock += 1;
            await book.save();
      }

      return await Borrow.findById(borrow._id).populate('book borrower', 'name email');
};

exports.getAllBorrows = async () => {
      return await Borrow.find()
            .populate('book')
            .populate('borrower', 'name email role')
            .populate('owner', 'name email')
            .sort({ createdAt: -1 });
};
