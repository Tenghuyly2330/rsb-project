import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { BookOpen, Users, Bookmark, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardOverview = () => {
      const [stats, setStats] = useState(null);
      const [recentBorrows, setRecentBorrows] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState('');

      useEffect(() => {
            const fetchOverview = async () => {
                  try {
                        const [statsRes, borrowsRes] = await Promise.all([
                              api.get('/books/admin/stats'),
                              api.get('/borrows/all')
                        ]);
                        setStats(statsRes.data.data);
                        setRecentBorrows((borrowsRes.data.data || []).slice(0, 5));
                  } catch (err) {
                        setError(err.response?.data?.message || 'Failed to fetch overview stats');
                  } finally {
                        setLoading(false);
                  }
            };
            fetchOverview();
      }, []);

      if (loading) {
            return <div className="p-8 text-center text-slate-500">Loading system stats...</div>;
      }

      if (error) {
            return <div className="p-6 bg-red-50 text-red-600 rounded-xl m-6 border border-red-200">{error}</div>;
      }

      const statCards = [
            { title: 'Total Books', value: stats?.totalBooks || 0, icon: BookOpen, color: 'from-blue-500 to-indigo-600' },
            { title: 'All Users', value: stats?.totalUsers || 0, icon: Users, color: 'from-purple-500 to-pink-600' },
            { title: 'Active Borrows', value: stats?.activeBorrows || 0, icon: Bookmark, color: 'from-amber-500 to-orange-600' },
            { title: 'Low Stock Books', value: stats?.totalStockCount || 0, icon: AlertTriangle, color: 'from-rose-500 to-red-600' },
      ];

      return (
            <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
                  <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Overview</h1>
                        <p className="text-slate-500 text-sm mt-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis, vero.t</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statCards.map((card, idx) => {
                              const Icon = card.icon;
                              return (
                                    <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                          <div className="flex items-center justify-between">
                                                <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{card.title}</span>
                                                <div className={`p-3 rounded-xl bg-gradient-to-tr ${card.color} text-white shadow-md`}>
                                                      <Icon size={20} />
                                                </div>
                                          </div>
                                          <p className="text-3xl font-extrabold text-slate-900 mt-4">{card.value}</p>
                                    </div>
                              );
                        })}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                              <div className="flex items-center justify-between mb-6">
                                    <div>
                                          <h2 className="text-lg font-bold text-slate-900">Recent Borrow Activity</h2>
                                          <p className="text-xs text-slate-500">Lorem ipsum dolor sit amet.</p>
                                    </div>
                                    <Link to="/borrows" className="text-indigo-600 hover:text-indigo-700 font-semibold text-xs flex items-center gap-1">
                                          View All <ArrowUpRight size={14} />
                                    </Link>
                              </div>

                              <div className="space-y-3">
                                    {recentBorrows.length === 0 ? (
                                          <p className="text-slate-400 text-sm py-4 text-center">No active loans found</p>
                                    ) : (
                                          recentBorrows.map((b) => (
                                                <div key={b._id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                                                      <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center">
                                                                  <Bookmark size={18} />
                                                            </div>
                                                            <div>
                                                                  <p className="font-semibold text-sm text-slate-900">{b.book?.title || 'Book'}</p>
                                                                  <p className="text-xs text-slate-500">Borrowed by: {b.borrower?.name} ({b.borrower?.email})</p>
                                                            </div>
                                                      </div>
                                                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${b.status === 'borrowed' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                                            }`}>
                                                            {b.status}
                                                      </span>
                                                </div>
                                          ))
                                    )}
                              </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                              <div className="flex items-center justify-between mb-6">
                                    <div>
                                          <h2 className="text-lg font-bold text-slate-900">Low Stock Warning</h2>
                                          <p className="text-xs text-slate-500">Lorem ipsum dolor sit amet.</p>
                                    </div>
                                    <Link to="/books" className="text-indigo-600 hover:text-indigo-700 font-semibold text-xs flex items-center gap-1">
                                          Manage <ArrowUpRight size={14} />
                                    </Link>
                              </div>

                              <div className="space-y-3">
                                    {stats?.lowStockBooks?.length === 0 ? (
                                          <p className="text-slate-400 text-sm py-4 text-center">All books have healthy stock levels</p>
                                    ) : (
                                          stats?.lowStockBooks?.map((book) => (
                                                <div key={book._id} className="flex items-center justify-between p-3.5 rounded-xl bg-rose-50/50 border border-rose-100">
                                                      <div className="truncate mr-2">
                                                            <p className="font-medium text-sm text-slate-900 truncate">{book.title}</p>
                                                            <p className="text-xs text-slate-500">{book.author}</p>
                                                      </div>
                                                      <span className="px-2.5 py-1 bg-rose-100 text-rose-700 font-bold text-xs rounded-lg shrink-0">
                                                            Stock: {book.stock}
                                                      </span>
                                                </div>
                                          ))
                                    )}
                              </div>
                        </div>
                  </div>
            </div>
      );
};

export default DashboardOverview;
