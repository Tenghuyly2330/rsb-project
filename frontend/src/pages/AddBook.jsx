import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const AddBook = () => {
      const navigate = useNavigate();
      const [formData, setFormData] = useState({
            title: '',
            author: '',
            description: '',
            isbn: '',
            category: 'Software Engineering',
            publishedYear: new Date().getFullYear(),
            price: '',
            stock: '',
            coverImage: ''
      });
      const [error, setError] = useState('');

      const handleChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
      };

      const handleSubmit = async (e) => {
            e.preventDefault();
            setError('');
            try {
                  await api.post('/books', {
                        ...formData,
                        price: Number(formData.price),
                        stock: Number(formData.stock),
                        publishedYear: Number(formData.publishedYear)
                  });
                  navigate('/admin');
            } catch (err) {
                  setError(err.response?.data?.message || 'Failed to add book');
            }
      };

      return (
            <div className="container max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
                  <Link to="/admin" className="btn btn-secondary mb-4 inline-block">
                        &larr; Back to Admin Dashboard
                  </Link>
                  <h2 className="text-2xl font-bold mb-4">Add New Book</h2>
                  {error && <div className="text-red-500 mb-4">{error}</div>}
                  <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                              <label className="block mb-2">Title</label>
                              <input type="text" name="title" placeholder='Enter book title' className="w-full p-2 border border-gray-400 text-gray-400 rounded" value={formData.title} onChange={handleChange} required />
                        </div>
                        <div className="mb-4">
                              <label className="block mb-2">Author</label>
                              <input type="text" name="author" placeholder='Enter author name' className="w-full p-2 border border-gray-400 text-gray-400 rounded" value={formData.author} onChange={handleChange} required />
                        </div>
                        <div className="mb-4">
                              <label className="block mb-2">Description</label>
                              <textarea name="description" placeholder='Enter book description' className="w-full p-2 border border-gray-400 text-gray-400 rounded" value={formData.description} onChange={handleChange} required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                    <label className="block mb-2">ISBN</label>
                                    <input type="text" name="isbn" placeholder='Enter book ISBN' className="w-full p-2 border border-gray-400 text-gray-400 rounded" value={formData.isbn} onChange={handleChange} required />
                              </div>
                              <div>
                                    <label className="block mb-2">Category</label>
                                    <select name="category" className="w-full p-2 border border-gray-400 text-gray-400 rounded" value={formData.category} onChange={handleChange}>
                                          <option value="Software Engineering">Software Engineering</option>
                                          <option value="DevOps">DevOps</option>
                                          <option value="Web Development">Web Development</option>
                                          <option value="Database & Systems">Database & Systems</option>
                                    </select>
                              </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                    <label className="block mb-2">Price ($)</label>
                                    <input type="number" name="price" step="0.01" placeholder='Enter book price' className="w-full p-2 border border-gray-400 text-gray-400 rounded" value={formData.price} onChange={handleChange} required />
                              </div>
                              <div>
                                    <label className="block mb-2">Stock</label>
                                    <input type="number" name="stock" placeholder='Enter book stock' className="w-full p-2 border border-gray-400 text-gray-400 rounded" value={formData.stock} onChange={handleChange} required />
                              </div>
                              <div>
                                    <label className="block mb-2">Published Year</label>
                                    <input type="number" name="publishedYear" placeholder='Enter book published year' className="w-full p-2 border border-gray-400 text-gray-400 rounded" value={formData.publishedYear} onChange={handleChange} required />
                              </div>
                        </div>
                        <div className="mb-4">
                              <label className="block mb-2">Cover Image URL (Optional)</label>
                              <input type="text" name="coverImage" placeholder='Enter book cover image URL' className="w-full p-2 border border-gray-400 text-gray-400 rounded" value={formData.coverImage} onChange={handleChange} />
                        </div>
                        <button type="submit" className="btn btn-primary w-full p-2">
                              Save Book
                        </button>
                  </form>
            </div>
      );
};

export default AddBook;
