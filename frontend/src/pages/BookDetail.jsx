import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Bookmark, ArrowLeft, CheckCircle2 } from 'lucide-react';

const BookDetail = () => {
      const { id } = useParams();
      const { user } = useContext(AuthContext);
      const navigate = useNavigate();

      const [book, setBook] = useState(null);
      const [loading, setLoading] = useState(true);
      const [borrowing, setBorrowing] = useState(false);
      const [error, setError] = useState('');
      const [message, setMessage] = useState('');

      const fetchBook = async () => {
            try {
                  const res = await api.get(`/books/${id}`);
                  setBook(res.data.data);
            } catch (err) {
                  setError(err.response?.data?.message || 'Book not found');
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => {
            fetchBook();
      }, [id]);

      const handleBorrow = async () => {
            if (!user) {
                  navigate('/login');
                  return;
            }
            setBorrowing(true);
            setError('');
            setMessage('');
            try {
                  const res = await api.post(`/borrows/${id}`);
                  setMessage(res.data.message || 'Borrow request submitted successfully! Awaiting owner approval.');
                  fetchBook();
            } catch (err) {
                  setError(err.response?.data?.message || 'Failed to borrow book');
            } finally {
                  setBorrowing(false);
            }
      };

      if (loading) return <div className="max-w-4xl mx-auto px-4 py-12 text-center text-slate-500">Loading book details...</div>;
      if (error && !book) return <div className="max-w-4xl mx-auto px-4 py-12 text-red-500">{error}</div>;
      if (!book) return null;

      const isOwner = user && book.addedBy && (book.addedBy._id === user.id || book.addedBy === user.id);

      return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                  <Link
                        to="/books"
                        className="inline-flex items-center gap-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl mb-6 transition-colors"
                  >
                        <ArrowLeft className="w-4 h-4" /> Back to Books
                  </Link>

                  {error && <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm">{error}</div>}
                  {message && (
                        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5" /> {message}
                        </div>
                  )}

                  <div className="card-box rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row gap-8 border shadow-lg">
                        <div className="w-full md:w-64 flex-shrink-0">
                              <img
                                    src={book.coverImage}
                                    alt={book.title}
                                    className="w-full h-80 object-cover rounded-xl shadow-md"
                              />
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                              <div>
                                    <div className="flex items-center gap-2 mb-2">
                                          <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">
                                                {book.category}
                                          </span>
                                    </div>

                                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">{book.title}</h1>

                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                          By <strong className="text-slate-900 dark:text-slate-200">{book.author}</strong>
                                          {book.addedBy && (
                                                <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">
                                                      (Added by {book.addedBy.name})
                                                </span>
                                          )}
                                    </p>

                                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-6">
                                          {book.description}
                                    </p>

                                    <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 space-y-1 mb-6">
                                          <p><strong>ISBN:</strong> <span className="font-mono text-slate-800 dark:text-slate-200">{book.isbn}</span></p>
                                          <p><strong>Published Year:</strong> {book.publishedYear}</p>
                                    </div>
                              </div>

                              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-4">
                                    <div>
                                          <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">${book.price}</span>
                                          <span className={`block text-xs font-medium ${book.stock > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                                                {book.stock > 0 ? `In Stock (${book.stock} available)` : 'Out of Stock'}
                                          </span>
                                    </div>

                                    <button
                                          onClick={handleBorrow}
                                          disabled={book.stock <= 0 || borrowing || isOwner}
                                          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
                                    >
                                          <Bookmark className="w-4 h-4" /> {isOwner ? 'Your Book' : borrowing ? 'Requesting...' : 'Request to Borrow'}
                                    </button>
                              </div>
                        </div>
                  </div>
            </div>
      );
};

export default BookDetail;
