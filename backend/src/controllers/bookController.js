const bookService = require('../services/bookService');

exports.getBooks = async (req, res, next) => {
  try {
    const { books, total, page, limit, totalPages } = await bookService.getAllBooks(req.query);
    res.status(200).json({
      success: true,
      message: 'Books fetched successfully',
      data: books,
      pagination: { total, page, limit, totalPages }
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserBooks = async (req, res, next) => {
  try {
    const books = await bookService.getUserBooks(req.user._id);
    res.status(200).json({
      success: true,
      data: books
    });
  } catch (err) {
    next(err);
  }
};

exports.getBook = async (req, res, next) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Book fetched successfully',
      data: book
    });
  } catch (err) {
    next(err);
  }
};

exports.createBook = async (req, res, next) => {
  try {
    const data = await bookService.createBook(req.body, req.user?._id);
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data
    });
  } catch (err) {
    next(err);
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const book = await bookService.updateBook(req.params.id, req.body, req.user._id, isAdmin);
    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: book
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';
    await bookService.deleteBook(req.params.id, req.user._id, isAdmin);
    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const stats = await bookService.getAdminStats();
    res.status(200).json({
      success: true,
      message: 'Admin stats fetched successfully',
      data: stats
    });
  } catch (err) {
    next(err);
  }
};