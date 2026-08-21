import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { PlusCircle, Search, Edit2, Trash2, Wand2, UserCheck } from 'lucide-react';

const BooksManagement = () => {
      const [books, setBooks] = useState([]);
      const [search, setSearch] = useState('');
      const [category, setCategory] = useState('');
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState('');
      const [message, setMessage] = useState('');

      const [isCustomCategory, setIsCustomCategory] = useState(false);
      const [showModal, setShowModal] = useState(false);
      const [editingId, setEditingId] = useState(null);
      const [formData, setFormData] = useState({
            title: '',
            author: '',
            description: '',
            isbn: '',
            category: 'Software Engineering',
            publishedYear: 2024,
            price: 19.99,
            stock: 10,
            coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500'
      });

      const generateIsbn = () => {
            const group = Math.floor(100 + Math.random() * 900);
            const publisher = Math.floor(1000 + Math.random() * 9000);
            const titleNum = Math.floor(10 + Math.random() * 90);
            const check = Math.floor(Math.random() * 10);
            return `978-${group}-${publisher}-${titleNum}-${check}`;
      };

      const fetchBooks = async () => {
            setLoading(true);
            try {
                  const res = await api.get('/books', {
                        params: { search, category, limit: 50 }
                  });
                  setBooks(res.data.data || []);
            } catch (err) {
                  setError(err.response?.data?.message || 'Failed to fetch books');
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => {
            fetchBooks();
      }, [search, category]);

      const handleOpenAdd = () => {
            setEditingId(null);
            setIsCustomCategory(false);
            setFormData({
                  title: '',
                  author: '',
                  description: '',
                  isbn: generateIsbn(),
                  category: 'Software Engineering',
                  publishedYear: 2024,
                  price: 19.99,
                  stock: 10,
                  coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500'
            });
            setShowModal(true);
      };

      const handleOpenEdit = (book) => {
            setEditingId(book._id);
            setIsCustomCategory(false);
            setFormData({
                  title: book.title,
                  author: book.author,
                  description: book.description,
                  isbn: book.isbn,
                  category: book.category,
                  publishedYear: book.publishedYear,
                  price: book.price,
                  stock: book.stock,
                  coverImage: book.coverImage
            });
            setShowModal(true);
      };

      const handleSubmit = async (e) => {
            e.preventDefault();
            setError('');
            setMessage('');
            try {
                  if (editingId) {
                        await api.put(`/books/${editingId}`, formData);
                        setMessage('Book updated successfully');
                  } else {
                        await api.post('/books', formData);
                        setMessage('Book created successfully');
                  }
                  setShowModal(false);
                  fetchBooks();
            } catch (err) {
                  setError(err.response?.data?.message || 'Action failed');
            }
      };

      const handleDelete = async (bookId) => {
            if (!window.confirm('Are you sure you want to delete this book?')) return;
            try {
                  await api.delete(`/books/${bookId}`);
                  setMessage('Book deleted successfully');
                  fetchBooks();
            } catch (err) {
                  setError(err.response?.data?.message || 'Failed to delete book');
            }
      };

      return (
            <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Books Catalog</h1>
                              <p className="text-slate-500 text-sm">Manage inventory, prices, stock, creators, and descriptions</p>
                        </div>
                        <button
                              onClick={handleOpenAdd}
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm shadow-lg shadow-indigo-600/30 transition-all"
                        >
                              <PlusCircle size={18} /> Add New Book
                        </button>
                  </div>

                  {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-200">{error}</div>}
                  {message && <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl text-sm border border-emerald-200">{message}</div>}

                  <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="relative flex-1">
                              <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
                              <input
                                    type="text"
                                    placeholder="Search by title, author, description..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                              />
                        </div>
                        <select
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                              <option value="">All Categories</option>
                              <option value="Software Engineering">Software Engineering</option>
                              <option value="DevOps">DevOps</option>
                              <option value="Web Development">Web Development</option>
                              <option value="Database & Systems">Database & Systems</option>
                              <option value="Fiction">Fiction</option>
                              <option value="Science">Science</option>
                        </select>
                  </div>

                  {/* Books Table */}
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        {loading ? (
                              <div className="p-8 text-center text-slate-400">Loading catalog...</div>
                        ) : books.length === 0 ? (
                              <div className="p-8 text-center text-slate-400">No books found</div>
                        ) : (
                              <div className="overflow-x-auto">
                                    <table className="w-full min-w-[700px] text-left border-collapse">
                                          <thead>
                                                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                      <th className="p-4 pl-6">Book</th>
                                                      <th className="p-4">User Created</th>
                                                      <th className="p-4">Category</th>
                                                      <th className="p-4">ISBN</th>
                                                      <th className="p-4">Price</th>
                                                      <th className="p-4">Stock</th>
                                                      <th className="p-4 pr-6 text-right">Actions</th>
                                                </tr>
                                          </thead>
                                          <tbody className="divide-y divide-slate-100 text-sm">
                                                {books.map((book) => (
                                                      <tr key={book._id} className="hover:bg-slate-50/60 transition-colors">
                                                            <td className="p-4 pl-6 flex items-center gap-3">
                                                                  <img src={book.coverImage} alt={book.title} className="w-12 h-16 object-cover rounded-lg shadow-sm" />
                                                                  <div>
                                                                        <p className="font-semibold text-slate-900 line-clamp-1">{book.title}</p>
                                                                        <p className="text-xs text-slate-500">By {book.author}</p>
                                                                  </div>
                                                            </td>
                                                            {/* UserCreated Column */}
                                                            <td className="p-4 text-slate-700">
                                                                  <div className="flex items-center gap-1.5">
                                                                        <UserCheck size={14} className="text-indigo-500" />
                                                                        <span className="font-medium text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">
                                                                              {book.addedBy?.name || 'System / Admin'}
                                                                        </span>
                                                                  </div>
                                                            </td>
                                                            <td className="p-4 text-slate-600">
                                                                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-lg font-medium">
                                                                        {book.category}
                                                                  </span>
                                                            </td>
                                                            <td className="p-4 text-slate-500 text-xs font-mono">{book.isbn}</td>
                                                            <td className="p-4 font-bold text-indigo-600">${book.price}</td>
                                                            <td className="p-4">
                                                                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${book.stock > 5 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                                                        }`}>
                                                                        {book.stock} left
                                                                  </span>
                                                            </td>
                                                            <td className="p-4 pr-6 text-right space-x-2">
                                                                  <button
                                                                        onClick={() => handleOpenEdit(book)}
                                                                        className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                                                                  >
                                                                        <Edit2 size={16} />
                                                                  </button>
                                                                  <button
                                                                        onClick={() => handleDelete(book._id)}
                                                                        className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                                  >
                                                                        <Trash2 size={16} />
                                                                  </button>
                                                            </td>
                                                      </tr>
                                                ))}
                                          </tbody>
                                    </table>
                              </div>
                        )}
                  </div>

                  {/* Add / Edit Modal */}
                  {showModal && (
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                              <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
                                    <h2 className="text-xl font-bold text-slate-900 mb-4">{editingId ? 'Edit Book' : 'Add New Book'}</h2>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                          <div>
                                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title</label>
                                                <input
                                                      type="text"
                                                      required
                                                      value={formData.title}
                                                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                />
                                          </div>

                                          <div>
                                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Author</label>
                                                <input
                                                      type="text"
                                                      required
                                                      value={formData.author}
                                                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                />
                                          </div>

                                          <div>
                                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                                                <textarea
                                                      required
                                                      rows={3}
                                                      value={formData.description}
                                                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                />
                                          </div>

                                          <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                      <div className="flex justify-between items-center mb-1">
                                                            <label className="text-xs font-bold text-slate-700 uppercase">ISBN</label>
                                                            <button
                                                                  type="button"
                                                                  onClick={() => setFormData({ ...formData, isbn: generateIsbn() })}
                                                                  className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                                                            >
                                                                  <Wand2 size={12} /> Auto
                                                            </button>
                                                      </div>
                                                      <input
                                                            type="text"
                                                            required
                                                            value={formData.isbn}
                                                            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                                                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                      />
                                                </div>
                                                <div>
                                                      <div className="flex justify-between items-center mb-1">
                                                            <label className="text-xs font-bold text-slate-700 uppercase">Category</label>
                                                            <button
                                                                  type="button"
                                                                  onClick={() => setIsCustomCategory(!isCustomCategory)}
                                                                  className="text-xs text-indigo-600 font-semibold hover:underline"
                                                            >
                                                                  {isCustomCategory ? 'Select Existing' : '+ Custom'}
                                                            </button>
                                                      </div>
                                                      {isCustomCategory ? (
                                                            <input
                                                                  type="text"
                                                                  required
                                                                  placeholder="Enter new category"
                                                                  value={formData.category}
                                                                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                            />
                                                      ) : (
                                                            <select
                                                                  value={formData.category}
                                                                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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

                                          <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Year</label>
                                                      <input
                                                            type="number"
                                                            required
                                                            value={formData.publishedYear}
                                                            onChange={(e) => setFormData({ ...formData, publishedYear: parseInt(e.target.value) })}
                                                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                      />
                                                </div>
                                                <div>
                                                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Price ($)</label>
                                                      <input
                                                            type="number"
                                                            step="0.01"
                                                            required
                                                            value={formData.price}
                                                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                      />
                                                </div>
                                                <div>
                                                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Stock</label>
                                                      <input
                                                            type="number"
                                                            required
                                                            value={formData.stock}
                                                            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                      />
                                                </div>
                                          </div>

                                          <div>
                                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cover Image URL</label>
                                                <input
                                                      type="url"
                                                      value={formData.coverImage}
                                                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                                                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                />
                                          </div>

                                          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                                <button
                                                      type="button"
                                                      onClick={() => setShowModal(false)}
                                                      className="px-4 py-2 text-slate-600 font-medium text-sm hover:bg-slate-100 rounded-xl"
                                                >
                                                      Cancel
                                                </button>
                                                <button
                                                      type="submit"
                                                      className="px-5 py-2 bg-indigo-600 text-white font-medium text-sm rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-600/30"
                                                >
                                                      {editingId ? 'Save Changes' : 'Create Book'}
                                                </button>
                                          </div>
                                    </form>
                              </div>
                        </div>
                  )}
            </div>
      );
};

export default BooksManagement;
