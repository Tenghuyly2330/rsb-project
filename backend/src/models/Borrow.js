const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema({
      book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: true
      },
      borrower: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
      },
      owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
      },
      borrowDate: {
            type: Date,
            default: Date.now
      },
      dueDate: {
            type: Date,
            default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000)
      },
      returnDate: {
            type: Date
      },
      status: {
            type: String,
            enum: ['pending', 'borrowed', 'rejected', 'returned'],
            default: 'pending'
      }
}, { timestamps: true });

module.exports = mongoose.model('Borrow', borrowSchema);
