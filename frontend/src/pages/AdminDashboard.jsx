import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Plus, Trash, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalBooks: 0, totalStock: 0, lowStockCount: 0 });
  const [books, setBooks] = useState([]);

  const loadDashboardData = async () => {
    try {
      const statsRes = await API.get('/books/stats');
      const booksRes = await API.get('/books?limit=50');
      setStats(statsRes.data.data);
      setBooks(booksRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      await API.delete(`/books/${id}`);
      loadDashboardData();
    }
  };

  return (
    <div className="container" style={{ padding: '30px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Admin Management Dashboard</h2>
        <Link to="/admin/books/new" className="btn btn-primary"><Plus size={16} /> Add New Book</Link>
      </div>

      {/* Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Total Books</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563eb' }}>{stats.totalBooks}</p>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Total Inventory Stock</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#16a34a' }}>{stats.totalStock}</p>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Low Stock Alerts</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc2626' }}>{stats.lowStockCount}</p>
        </div>
      </div>

      {/* Management Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>Title</th>
            <th style={{ padding: '12px' }}>Author</th>
            <th style={{ padding: '12px' }}>Category</th>
            <th style={{ padding: '12px' }}>Price</th>
            <th style={{ padding: '12px' }}>Stock</th>
            <th style={{ padding: '12px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '12px' }}>{book.title}</td>
              <td style={{ padding: '12px' }}>{book.author}</td>
              <td style={{ padding: '12px' }}>{book.category}</td>
              <td style={{ padding: '12px' }}>${book.price}</td>
              <td style={{ padding: '12px' }}>{book.stock}</td>
              <td style={{ padding: '12px', display: 'flex', gap: '10px' }}>
                <button onClick={() => handleDelete(book._id)} className="btn btn-danger" style={{ padding: '4px 8px' }}>
                  <Trash size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;