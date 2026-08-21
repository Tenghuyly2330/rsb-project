import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Bookmark, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';

const BorrowRecordsManagement = () => {
      const [borrows, setBorrows] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState('');
      const [message, setMessage] = useState('');

      const fetchBorrows = async () => {
            setLoading(true);
            try {
                  const res = await api.get('/borrows/all');
                  setBorrows(res.data.data || []);
            } catch (err) {
                  setError(err.response?.data?.message || 'Failed to fetch borrow records');
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => {
            fetchBorrows();
      }, []);

      const handleReturn = async (borrowId) => {
            try {
                  await api.post(`/borrows/return/${borrowId}`);
                  setMessage('Book marked as returned');
                  fetchBorrows();
            } catch (err) {
                  setError(err.response?.data?.message || 'Failed to mark returned');
            }
      };

      return (
            <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
                  <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Borrow Records</h1>
                        <p className="text-slate-500 text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis, vero.</p>
                  </div>

                  {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-200">{error}</div>}
                  {message && <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl text-sm border border-emerald-200">{message}</div>}

                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        {loading ? (
                              <div className="p-8 text-center text-slate-400">Loading loan records...</div>
                        ) : (
                              <div className="overflow-x-auto">
                                    <table className="w-full min-w-[650px] text-left border-collapse">
                                          <thead>
                                                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                      <th className="p-4 pl-6">Book Title</th>
                                                      <th className="p-4">Borrower</th>
                                                      <th className="p-4">Borrow Date</th>
                                                      <th className="p-4">Due Date</th>
                                                      <th className="p-4">Status</th>
                                                      <th className="p-4 pr-6 text-right">Action</th>
                                                </tr>
                                          </thead>
                                          <tbody className="divide-y divide-slate-100 text-sm">
                                                {borrows.map((b) => (
                                                      <tr key={b._id} className="hover:bg-slate-50/60 transition-colors">
                                                            <td className="p-4 pl-6 flex items-center gap-3">
                                                                  {b.book?.coverImage && (
                                                                        <img src={b.book.coverImage} alt={b.book?.title} className="w-10 h-14 object-cover rounded shadow-sm" />
                                                                  )}
                                                                  <div>
                                                                        <p className="font-semibold text-slate-900 line-clamp-1">{b.book?.title || 'Unknown Book'}</p>
                                                                        <p className="text-xs text-slate-500">By {b.book?.author}</p>
                                                                  </div>
                                                            </td>
                                                            <td className="p-4">
                                                                  <p className="font-medium text-slate-800">{b.borrower?.name || 'N/A'}</p>
                                                                  <p className="text-xs text-slate-500 font-mono">{b.borrower?.email}</p>
                                                            </td>
                                                            <td className="p-4 text-slate-600 text-xs">{new Date(b.borrowDate).toLocaleDateString()}</td>
                                                            <td className="p-4 text-slate-600 text-xs">{new Date(b.dueDate).toLocaleDateString()}</td>
                                                            <td className="p-4">
                                                                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${b.status === 'borrowed' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                                                        }`}>
                                                                        {b.status === 'borrowed' ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
                                                                        {b.status}
                                                                  </span>
                                                            </td>
                                                            <td className="p-4 pr-6 text-right">
                                                                  {b.status === 'borrowed' && (
                                                                        <button
                                                                              onClick={() => handleReturn(b._id)}
                                                                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition-colors"
                                                                        >
                                                                              <RotateCcw size={14} /> Force Return
                                                                        </button>
                                                                  )}
                                                            </td>
                                                      </tr>
                                                ))}
                                          </tbody>
                                    </table>
                              </div>
                        )}
                  </div>
            </div>
      );
};

export default BorrowRecordsManagement;
