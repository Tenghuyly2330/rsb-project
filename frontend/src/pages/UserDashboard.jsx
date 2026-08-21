import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { BookOpen, PlusCircle, Bookmark, CheckCircle2, RotateCcw, Trash2, Wand2, Bell, Check, X, Mail, User } from 'lucide-react';

const UserDashboard = () => {
      const { user } = useContext(AuthContext);
      const [activeTab, setActiveTab] = useState('books'); 

      const [myBooks, setMyBooks] = useState([]);
      const [myBorrows, setMyBorrows] = useState([]);
      const [ownerRequests, setOwnerRequests] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState('');
      const [message, setMessage] = useState('');

      const [showAddModal, setShowAddModal] = useState(false);
      const [isCustomCategory, setIsCustomCategory] = useState(false);
      const [formData, setFormData] = useState({
            title: '',
            author: '',
            description: '',
            isbn: '',
            category: 'Software Engineering',
            publishedYear: new Date().getFullYear(),
            price: 19.99,
            stock: 5,
            coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500'
      });

      const generateIsbn = () => {
            const group = Math.floor(100 + Math.random() * 900);
            const publisher = Math.floor(1000 + Math.random() * 9000);
            const titleNum = Math.floor(10 + Math.random() * 90);
            const check = Math.floor(Math.random() * 10);
            return `978-${group}-${publisher}-${titleNum}-${check}`;
      };

      const handleOpenAddModal = () => {
            setIsCustomCategory(false);
            setFormData({
                  title: '',
                  author: '',
                  description: '',
                  isbn: generateIsbn(),
                  category: 'Software Engineering',
                  publishedYear: new Date().getFullYear(),
                  price: 19.99,
                  stock: 5,
                  coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500'
            });
            setShowAddModal(true);
      };

      const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                  const [booksRes, borrowsRes, requestsRes] = await Promise.all([
                        api.get('/books/my'),
                        api.get('/borrows/my'),
                        api.get('/borrows/requests')
                  ]);
                  setMyBooks(booksRes.data.data || []);
                  setMyBorrows(borrowsRes.data.data || []);
                  setOwnerRequests(requestsRes.data.data || []);
            } catch (err) {
                  setError(err.response?.data?.message || 'Failed to load user data');
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => {
            fetchData();
      }, []);

      const handleAddBook = async (e) => {
            e.preventDefault();
            setError('');
            setMessage('');
            try {
                  await api.post('/books', formData);
                  setMessage('Book created successfully!');
                  setShowAddModal(false);
                  fetchData();
            } catch (err) {
                  setError(err.response?.data?.message || 'Failed to create book');
            }
      };

      const handleDeleteBook = async (bookId) => {
            if (!window.confirm('Are you sure you want to delete this book?')) return;
            try {
                  await api.delete(`/books/${bookId}`);
                  setMessage('Book deleted successfully');
                  fetchData();
            } catch (err) {
                  setError(err.response?.data?.message || 'Failed to delete book');
            }
      };

      const handleApproveRequest = async (borrowId) => {
            setError('');
            setMessage('');
            try {
                  await api.post(`/borrows/approve/${borrowId}`);
                  setMessage('Borrow request approved successfully!');
                  fetchData();
            } catch (err) {
                  setError(err.response?.data?.message || 'Failed to approve request');
            }
      };

      const handleRejectRequest = async (borrowId) => {
            setError('');
            setMessage('');
            try {
                  await api.post(`/borrows/reject/${borrowId}`);
                  setMessage('Borrow request rejected');
                  fetchData();
            } catch (err) {
                  setError(err.response?.data?.message || 'Failed to reject request');
            }
      };

      const handleReturnBook = async (borrowId) => {
            setError('');
            setMessage('');
            try {
                  await api.post(`/borrows/return/${borrowId}`);
                  setMessage('Book returned successfully!');
                  fetchData();
            } catch (err) {
                  setError(err.response?.data?.message || 'Failed to return book');
            }
      };

      const pendingRequests = ownerRequests.filter(r => r.status === 'pending');

      if (loading) {
            return <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-500">Loading dashboard...</div>;
      }

      return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                              <h1 className="text-3xl font-bold tracking-tight mb-1">User Dashboard</h1>
                              <p className="text-slate-500 dark:text-slate-400">
                                    Welcome back, <strong className="text-slate-900 dark:text-white">{user?.name}</strong>! Manage your books and borrowing notifications.
                              </p>
                        </div>
                        <button
                              onClick={handleOpenAddModal}
                              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-md transition-colors cursor-pointer"
                        >
                              <PlusCircle className="w-5 h-5" /> Add New Book
                        </button>
                  </div>

                  {error && <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm">{error}</div>}
                  {message && <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl mb-6 text-sm">{message}</div>}

                  <div className="flex border-b border-slate-200 dark:border-slate-700 mb-8 overflow-x-auto gap-2">
                        <button
                              onClick={() => setActiveTab('books')}
                              className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'books'
                                          ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                          : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                    }`}
                        >
                              <BookOpen className="w-4 h-4" /> My Books ({myBooks.length})
                        </button>

                        <button
                              onClick={() => setActiveTab('requests')}
                              className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'requests'
                                          ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                          : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                    }`}
                        >
                              <Bell className="w-4 h-4" /> Borrow Requests
                              {pendingRequests.length > 0 && (
                                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                                          {pendingRequests.length}
                                    </span>
                              )}
                        </button>

                        <button
                              onClick={() => setActiveTab('borrows')}
                              className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'borrows'
                                          ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                          : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                    }`}
                        >
                              <Bookmark className="w-4 h-4" /> My Loans ({myBorrows.filter(b => b.status === 'borrowed').length} Active)
                        </button>
                  </div>

                  {/* Tab 1: My Books */}
                  {activeTab === 'books' && (
                        <div>
                              {myBooks.length === 0 ? (
                                    <div className="card-box p-12 rounded-2xl text-center">
                                          <p className="text-slate-500">You haven't added any books yet.</p>
                                          <button
                                                onClick={handleOpenAddModal}
                                                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
                                          >
                                                Add Your First Book
                                          </button>
                                    </div>
                              ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                          {myBooks.map((book) => (
                                                <div key={book._id} className="card-box rounded-2xl overflow-hidden p-4 flex flex-col justify-between border">
                                                      <div>
                                                            <img src={book.coverImage} alt={book.title} className="w-full h-44 object-cover rounded-xl mb-3" />
                                                            <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{book.title}</h3>
                                                            <p className="text-xs text-slate-500 mb-2">By {book.author}</p>
                                                            <div className="flex justify-between text-xs font-semibold my-2">
                                                                  <span>Price: <strong className="text-blue-600 dark:text-blue-400">${book.price}</strong></span>
                                                                  <span>Stock: <strong>{book.stock}</strong></span>
                                                            </div>
                                                      </div>
                                                      <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                                                            <button
                                                                  onClick={() => handleDeleteBook(book._id)}
                                                                  className="inline-flex items-center gap-1 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                                            >
                                                                  <Trash2 className="w-3.5 h-3.5" /> Delete
                                                            </button>
                                                      </div>
                                                </div>
                                          ))}
                                    </div>
                              )}
                        </div>
                  )}

                  {/* Tab 2: Borrow Requests */}
                  {activeTab === 'requests' && (
                        <div>
                              {ownerRequests.length === 0 ? (
                                    <div className="card-box p-12 rounded-2xl text-center">
                                          <p className="text-slate-500">No borrow requests received for your books yet.</p>
                                    </div>
                              ) : (
                                    <div className="space-y-4">
                                          {ownerRequests.map((reqItem) => (
                                                <div
                                                      key={reqItem._id}
                                                      className="card-box p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border"
                                                >
                                                      <div className="flex items-center gap-4">
                                                            {reqItem.book?.coverImage && (
                                                                  <img src={reqItem.book.coverImage} alt={reqItem.book?.title} className="w-16 h-20 object-cover rounded-lg shadow-sm" />
                                                            )}
                                                            <div>
                                                                  <h4 className="font-bold text-slate-900 dark:text-white text-base">{reqItem.book?.title}</h4>
                                                                  <p className="text-xs text-slate-500 mb-2">Author: {reqItem.book?.author}</p>

                                                                  {/* Borrower Contact Info Block */}
                                                                  <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                                                                        <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                                                                              <User className="w-3.5 h-3.5 text-blue-500" /> Borrower Name: <span className="text-blue-600 dark:text-blue-400">{reqItem.borrower?.name}</span>
                                                                        </p>
                                                                        <p className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                                                              <Mail className="w-3.5 h-3.5 text-blue-500" /> Email (Gmail): <span className="font-medium text-slate-900 dark:text-white">{reqItem.borrower?.email}</span>
                                                                        </p>
                                                                  </div>
                                                            </div>
                                                      </div>

                                                      <div className="flex items-center gap-3 self-end md:self-center">
                                                            {reqItem.status === 'pending' ? (
                                                                  <>
                                                                        <button
                                                                              onClick={() => handleRejectRequest(reqItem._id)}
                                                                              className="inline-flex items-center gap-1.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 font-semibold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                                                                        >
                                                                              <X className="w-4 h-4" /> Reject
                                                                        </button>
                                                                        <button
                                                                              onClick={() => handleApproveRequest(reqItem._id)}
                                                                              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-colors shadow-md cursor-pointer"
                                                                        >
                                                                              <Check className="w-4 h-4" /> Approve
                                                                        </button>
                                                                  </>
                                                            ) : reqItem.status === 'borrowed' ? (
                                                                  <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold">
                                                                        Approved & Active
                                                                  </span>
                                                            ) : reqItem.status === 'rejected' ? (
                                                                  <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-xs font-bold">
                                                                        Rejected
                                                                  </span>
                                                            ) : (
                                                                  <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
                                                                        Returned
                                                                  </span>
                                                            )}
                                                      </div>
                                                </div>
                                          ))}
                                    </div>
                              )}
                        </div>
                  )}

                  {/* Tab 3: My Loans */}
                  {activeTab === 'borrows' && (
                        <div>
                              {myBorrows.length === 0 ? (
                                    <div className="card-box p-12 rounded-2xl text-center">
                                          <p className="text-slate-500">You haven't requested or borrowed any books.</p>
                                    </div>
                              ) : (
                                    <div className="space-y-4">
                                          {myBorrows.map((borrow) => (
                                                <div key={borrow._id} className="card-box p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border">
                                                      <div className="flex items-center gap-4">
                                                            {borrow.book?.coverImage && (
                                                                  <img src={borrow.book.coverImage} alt={borrow.book?.title} className="w-14 h-18 object-cover rounded-lg shadow-sm" />
                                                            )}
                                                            <div>
                                                                  <h4 className="font-bold text-slate-900 dark:text-white text-base">{borrow.book?.title || 'Unknown Book'}</h4>
                                                                  <p className="text-xs text-slate-500">By {borrow.book?.author}</p>
                                                                  <p className="text-xs text-slate-400 mt-1">Requested: {new Date(borrow.createdAt).toLocaleDateString()}</p>
                                                            </div>
                                                      </div>

                                                      <div className="flex items-center gap-3">
                                                            {borrow.status === 'pending' ? (
                                                                  <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-3.5 py-1.5 rounded-full text-xs font-bold">
                                                                        Pending Owner Approval
                                                                  </span>
                                                            ) : borrow.status === 'borrowed' ? (
                                                                  <>
                                                                        <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3.5 py-1.5 rounded-full text-xs font-bold">
                                                                              Active Loan (Due {new Date(borrow.dueDate).toLocaleDateString()})
                                                                        </span>
                                                                        <button
                                                                              onClick={() => handleReturnBook(borrow._id)}
                                                                              className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3.5 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
                                                                        >
                                                                              <RotateCcw className="w-3.5 h-3.5" /> Return
                                                                        </button>
                                                                  </>
                                                            ) : borrow.status === 'rejected' ? (
                                                                  <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-3.5 py-1.5 rounded-full text-xs font-bold">
                                                                        Request Rejected
                                                                  </span>
                                                            ) : (
                                                                  <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
                                                                        <CheckCircle2 className="w-3.5 h-3.5" /> Returned
                                                                  </span>
                                                            )}
                                                      </div>
                                                </div>
                                          ))}
                                    </div>
                              )}
                        </div>
                  )}

                  {/* Add Book Modal */}
                  {showAddModal && (
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                              <div className="card-box w-full max-w-lg p-6 rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                                    <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Add a New Book</h2>
                                    <form onSubmit={handleAddBook} className="space-y-4">
                                          <div>
                                                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">Title</label>
                                                <input
                                                      type="text"
                                                      required
                                                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                      value={formData.title}
                                                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                />
                                          </div>

                                          <div>
                                                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">Author</label>
                                                <input
                                                      type="text"
                                                      required
                                                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                      value={formData.author}
                                                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                                />
                                          </div>

                                          <div>
                                                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">Description</label>
                                                <textarea
                                                      required
                                                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[80px]"
                                                      value={formData.description}
                                                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                />
                                          </div>

                                          <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                      <div className="flex justify-between items-center mb-1">
                                                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">ISBN</label>
                                                            <button
                                                                  type="button"
                                                                  onClick={() => setFormData({ ...formData, isbn: generateIsbn() })}
                                                                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                                                            >
                                                                  <Wand2 className="w-3 h-3" /> Auto
                                                            </button>
                                                      </div>
                                                      <input
                                                            type="text"
                                                            required
                                                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                            value={formData.isbn}
                                                            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                                                      />
                                                </div>

                                                <div>
                                                      <div className="flex justify-between items-center mb-1">
                                                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category</label>
                                                            <button
                                                                  type="button"
                                                                  onClick={() => setIsCustomCategory(!isCustomCategory)}
                                                                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                                                            >
                                                                  {isCustomCategory ? 'Select' : '+ Custom'}
                                                            </button>
                                                      </div>
                                                      {isCustomCategory ? (
                                                            <input
                                                                  type="text"
                                                                  required
                                                                  placeholder="Custom category"
                                                                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                                  value={formData.category}
                                                                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                            />
                                                      ) : (
                                                            <select
                                                                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                                                                  value={formData.category}
                                                                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                            >
                                                                  <option value="Software Engineering">Software Engineering</option>
                                                                  <option value="DevOps">DevOps</option>
                                                                  <option value="Web Development">Web Development</option>
                                                                  <option value="Database & Systems">Database & Systems</option>
                                                                  <option value="Fiction">Fiction</option>
                                                                  <option value="Science">Science</option>
                                                                  <option value="Design">Design</option>
                                                            </select>
                                                      )}
                                                </div>
                                          </div>

                                          <div className="grid grid-cols-3 gap-3">
                                                <div>
                                                      <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">Year</label>
                                                      <input
                                                            type="number"
                                                            required
                                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                                                            value={formData.publishedYear}
                                                            onChange={(e) => setFormData({ ...formData, publishedYear: parseInt(e.target.value) || 2024 })}
                                                      />
                                                </div>
                                                <div>
                                                      <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">Price ($)</label>
                                                      <input
                                                            type="number"
                                                            step="0.01"
                                                            required
                                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                                                            value={formData.price}
                                                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                                      />
                                                </div>
                                                <div>
                                                      <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">Stock</label>
                                                      <input
                                                            type="number"
                                                            required
                                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                                                            value={formData.stock}
                                                            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                                                      />
                                                </div>
                                          </div>

                                          <div>
                                                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">Cover Image URL</label>
                                                <input
                                                      type="url"
                                                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                                                      value={formData.coverImage}
                                                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                                                />
                                          </div>

                                          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                                                <button
                                                      type="button"
                                                      onClick={() => setShowAddModal(false)}
                                                      className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                                                >
                                                      Cancel
                                                </button>
                                                <button
                                                      type="submit"
                                                      className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-colors cursor-pointer"
                                                >
                                                      Create Book
                                                </button>
                                          </div>
                                    </form>
                              </div>
                        </div>
                  )}
            </div>
      );
};

export default UserDashboard;
