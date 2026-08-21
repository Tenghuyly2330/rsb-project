const Book = require('../models/Book');
const User = require('../models/User');
const Borrow = require('../models/Borrow');
const ErrorResponse = require('../utils/errorResponse');

exports.getAllBooks = async (queryParams) => {
  const { page = 1, limit = 10, search, category, sort } = queryParams;

  const query = {};

  if (category) {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { author: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  let sortOption = { createdAt: -1 };
  if (sort) {
    if (sort === 'price') sortOption = { price: 1 };
    if (sort === '-price') sortOption = { price: -1 };
    if (sort === 'title') sortOption = { title: 1 };
    if (sort === 'year') sortOption = { publishedYear: -1 };
  }

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const total = await Book.countDocuments(query);
  const books = await Book.find(query)
    .populate('addedBy', 'name email')
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum);

  return { books, total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) };
};

exports.getUserBooks = async (userId) => {
  return await Book.find({ addedBy: userId }).sort({ createdAt: -1 });
};

exports.getBookById = async (id) => {
  const book = await Book.findById(id).populate('addedBy', 'name email');
  if (!book) {
    throw new ErrorResponse(`Book not found with id of ${id}`, 404);
  }
  return book;
};

exports.createBook = async (bookData, userId) => {
  if (userId) {
    bookData.addedBy = userId;
  }
  return await Book.create(bookData);
};

exports.updateBook = async (id, updateData, userId, isAdmin = false) => {
  const book = await Book.findById(id);

  if (!book) {
    throw new ErrorResponse(`Book not found with id of ${id}`, 404);
  }

  if (!isAdmin && book.addedBy && book.addedBy.toString() !== userId.toString()) {
    throw new ErrorResponse('Not authorized to update this book', 403);
  }

  Object.assign(book, updateData);
  await book.save();
  return book;
};

exports.deleteBook = async (id, userId, isAdmin = false) => {
  const book = await Book.findById(id);

  if (!book) {
    throw new ErrorResponse(`Book not found with id of ${id}`, 404);
  }

  if (!isAdmin && book.addedBy && book.addedBy.toString() !== userId.toString()) {
    throw new ErrorResponse('Not authorized to delete this book', 403);
  }

  await book.deleteOne();
  return book;
};

exports.getAdminStats = async () => {
  const totalBooks = await Book.countDocuments();
  const totalUsers = await User.countDocuments();
  const totalBorrows = await Borrow.countDocuments();
  const activeBorrows = await Borrow.countDocuments({ status: 'borrowed' });

  const totalStockResult = await Book.aggregate([
    { $group: { _id: null, totalStock: { $sum: '$stock' } } }
  ]);

  const lowStockBooks = await Book.find({ stock: { $lt: 5 } });

  return {
    totalBooks,
    totalUsers,
    totalBorrows,
    activeBorrows,
    totalStock: totalStockResult[0] ? totalStockResult[0].totalStock : 0,
    totalStockCount: lowStockBooks.length,
    lowStockBooks
  };
};
