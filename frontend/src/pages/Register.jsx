import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, Mail, Lock, User, UserPlus, AlertCircle } from 'lucide-react';

const Register = () => {
      const [name, setName] = useState('');
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState('');
      const [loading, setLoading] = useState(false);
      const { register } = useContext(AuthContext);
      const navigate = useNavigate();

      const handleSubmit = async (e) => {
            e.preventDefault();
            setError('');
            setLoading(true);
            try {
                  await register(name, email, password);
                  navigate('/');
            } catch (err) {
                  setError(err.response?.data?.message || 'Failed to register');
            } finally {
                  setLoading(false);
            }
      };

      return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10 bg-slate-50 dark:bg-slate-950">
                  <div className="w-full max-w-md">
                        {/* Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8">
                              {/* Brand */}
                              <div className="flex flex-col items-center mb-8">
                                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                                          <BookOpen className="w-7 h-7 text-white" />
                                    </div>
                                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create an account</h1>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Join the BookFlow community today</p>
                              </div>

                              {error && (
                                    <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center gap-2.5 text-red-600 dark:text-red-400 text-sm">
                                          <AlertCircle className="w-4 h-4 shrink-0" />
                                          {error}
                                    </div>
                              )}

                              <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                                          <div className="relative">
                                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                                <input
                                                      type="text"
                                                      placeholder="John Doe"
                                                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                      value={name}
                                                      onChange={(e) => setName(e.target.value)}
                                                      required
                                                />
                                          </div>
                                    </div>

                                    <div>
                                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                                          <div className="relative">
                                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                                <input
                                                      type="email"
                                                      placeholder="you@example.com"
                                                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                      value={email}
                                                      onChange={(e) => setEmail(e.target.value)}
                                                      required
                                                />
                                          </div>
                                    </div>

                                    <div>
                                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                                          <div className="relative">
                                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                                <input
                                                      type="password"
                                                      placeholder="Min. 6 characters"
                                                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                      value={password}
                                                      onChange={(e) => setPassword(e.target.value)}
                                                      required
                                                      minLength={6}
                                                />
                                          </div>
                                    </div>

                                    <button
                                          type="submit"
                                          disabled={loading}
                                          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all text-sm"
                                    >
                                          {loading ? (
                                                <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                          ) : (
                                                <UserPlus className="w-4 h-4" />
                                          )}
                                          {loading ? 'Creating account...' : 'Create Account'}
                                    </button>
                              </form>

                              <p className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                                          Login here
                                    </Link>
                              </p>
                        </div>
                  </div>
            </div>
      );
};

export default Register;
