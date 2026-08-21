import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Shield, Trash2, UserCheck } from 'lucide-react';

const UsersManagement = () => {
      const [users, setUsers] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState('');
      const [message, setMessage] = useState('');

      const fetchUsers = async () => {
            setLoading(true);
            try {
                  const res = await api.get('/users');
                  setUsers(res.data.data || []);
            } catch (err) {
                  setError(err.response?.data?.message || 'Failed to fetch users');
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => {
            fetchUsers();
      }, []);

      const handleRoleToggle = async (userId, currentRole) => {
            const newRole = currentRole === 'admin' ? 'user' : 'admin';
            try {
                  await api.put(`/users/${userId}/role`, { role: newRole });
                  setMessage(`User role updated to ${newRole}`);
                  fetchUsers();
            } catch (err) {
                  setError(err.response?.data?.message || 'Failed to update user role');
            }
      };

      const handleDelete = async (userId) => {
            if (!window.confirm('Are you sure you want to delete this user?')) return;
            try {
                  await api.delete(`/users/${userId}`);
                  setMessage('User deleted successfully');
                  fetchUsers();
            } catch (err) {
                  setError(err.response?.data?.message || 'Failed to delete user');
            }
      };

      return (
            <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
                  <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Registered Users</h1>
                        <p className="text-slate-500 text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, soluta.</p>
                  </div>

                  {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-200">{error}</div>}
                  {message && <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl text-sm border border-emerald-200">{message}</div>}

                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        {loading ? (
                              <div className="p-8 text-center text-slate-400">Loading users...</div>
                        ) : (
                              <div className="overflow-x-auto">
                                    <table className="w-full min-w-[600px] text-left border-collapse">
                                          <thead>
                                                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                      <th className="p-4 pl-6">User</th>
                                                      <th className="p-4">Email</th>
                                                      <th className="p-4">Role</th>
                                                      <th className="p-4">Joined Date</th>
                                                      <th className="p-4 pr-6 text-right">Actions</th>
                                                </tr>
                                          </thead>
                                          <tbody className="divide-y divide-slate-100 text-sm">
                                                {users.map((u) => (
                                                      <tr key={u._id} className="hover:bg-slate-50/60 transition-colors">
                                                            <td className="p-4 pl-6 flex items-center gap-3">
                                                                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center">
                                                                        {u.name?.[0] || 'U'}
                                                                  </div>
                                                                  <span className="font-semibold text-slate-900">{u.name}</span>
                                                            </td>
                                                            <td className="p-4 text-slate-600 font-mono text-xs">{u.email}</td>
                                                            <td className="p-4">
                                                                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                                                                        }`}>
                                                                        {u.role === 'admin' ? <Shield size={12} /> : <UserCheck size={12} />}
                                                                        {u.role}
                                                                  </span>
                                                            </td>
                                                            <td className="p-4 text-slate-500 text-xs">
                                                                  {new Date(u.createdAt).toLocaleDateString()}
                                                            </td>
                                                            <td className="p-4 pr-6 text-right space-x-2">
                                                                  <button
                                                                        onClick={() => handleRoleToggle(u._id, u.role)}
                                                                        className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 rounded-lg transition-colors"
                                                                  >
                                                                        Toggle Role ({u.role === 'admin' ? 'Make User' : 'Make Admin'})
                                                                  </button>
                                                                  <button
                                                                        onClick={() => handleDelete(u._id)}
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
            </div>
      );
};

export default UsersManagement;
