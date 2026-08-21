import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { X, User, Mail, Lock, CheckCircle2 } from 'lucide-react';

const ProfileModal = ({ isOpen, onClose }) => {
      const { user, updateUser } = useContext(AuthContext);
      const [name, setName] = useState(user?.name || '');
      const [email, setEmail] = useState(user?.email || '');
      const [password, setPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState('');
      const [message, setMessage] = useState('');

      if (!isOpen) return null;

      const handleSubmit = async (e) => {
            e.preventDefault();
            setError('');
            setMessage('');

            if (password && password !== confirmPassword) {
                  setError('Passwords do not match');
                  return;
            }

            setLoading(true);
            try {
                  const res = await api.put('/auth/profile', {
                        name,
                        email,
                        password: password.trim() ? password : undefined
                  });
                  updateUser(res.data.data);
                  setMessage('Profile updated successfully!');
                  setPassword('');
                  setConfirmPassword('');
                  setTimeout(() => {
                        setMessage('');
                        onClose();
                  }, 1200);
            } catch (err) {
                  setError(err.response?.data?.message || 'Failed to update profile');
            } finally {
                  setLoading(false);
            }
      };

      return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                  <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-lg shadow-black/10 relative" >
                        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
                              <X size={20} />
                        </button>

                        <div className="mb-6">
                              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Account Profile</h2>
                              <p className="text-slate-500 text-sm">Update your personal profile information</p>
                        </div>

                        {error && (
                              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-200" >
                                    {error}
                              </div>
                        )}

                        {message && (
                              <div className="mb-4 p-3 bg-emerald-50 text-emerald-600 rounded-xl text-sm border border-emerald-200" >
                                    <CheckCircle2 size={18} /> {message}
                              </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                              <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                                    <div className="relative">
                                          <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                          <input type="text" placeholder='Enter New Name' required value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 pr-3 py-2 text-gray-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"/>
                                    </div>
                              </div>

                              <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                                    <div className="relative">
                                          <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                                          <input type="email" placeholder='Enter New Email' required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-3 py-2 text-gray-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"/>
                                    </div>
                              </div>

                              <div className="border-t border-slate-200 pt-3">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                          New Password <span className="font-normal text-slate-500">(Leave blank to keep unchanged)</span>
                                    </label>
                                    <div className="relative">
                                          <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                                          <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full text-gray-900 pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"/>
                                    </div>
                              </div>

                              {password && (
                                    <div>
                                          <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                                          <div className="relative">
                                                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                                                <input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"/>
                                          </div>
                                    </div>
                              )}

                              <div className="flex justify-end gap-2 mt-2">
                                    <button type="button" onClick={onClose} className="btn btn-secondary px-4 py-2 cursor-pointer text-sm">
                                          Cancel
                                    </button>
                                    <button type="submit" disabled={loading} className="btn btn-primary px-4 py-2 cursor-pointer text-sm">
                                          {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                              </div>
                        </form>
                  </div>
            </div>
      );
};

export default ProfileModal;
