import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldAlert, Lock, Mail } from 'lucide-react';

const Login = () => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState('');
      const [loading, setLoading] = useState(false);
      const { login } = useContext(AuthContext);
      const navigate = useNavigate();

      const handleSubmit = async (e) => {
            e.preventDefault();
            setError('');
            setLoading(true);
            try {
                  await login(email, password);
                  navigate('/');
            } catch (err) {
                  setError(err.response?.data?.message || err.message || 'Login failed');
            } finally {
                  setLoading(false);
            }
      };

      return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-md shadow-2xl space-y-6">
                        <div className="text-center space-y-2">
                              <div className="inline-flex p-3 bg-indigo-600/10 text-indigo-500 rounded-2xl border border-indigo-500/20 mb-2">
                                    <ShieldAlert size={32} />
                              </div>
                              <h1 className="text-2xl font-bold text-white">Admin Access</h1>
                              <p className="text-slate-400 text-sm">Sign in to control rest-book management dashboard</p>
                        </div>

                        {error && (
                              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm text-center">
                                    {error}
                              </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                              <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Admin Email</label>
                                    <div className="relative">
                                          <Mail className="absolute left-3.5 top-3 text-slate-500" size={18} />
                                          <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="admin@example.com"
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                          />
                                    </div>
                              </div>

                              <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Password</label>
                                    <div className="relative">
                                          <Lock className="absolute left-3.5 top-3 text-slate-500" size={18} />
                                          <input
                                                type="password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                          />
                                    </div>
                              </div>

                              <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50 mt-2"
                              >
                                    {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                              </button>
                        </form>
                  </div>
            </div>
      );
};

export default Login;
