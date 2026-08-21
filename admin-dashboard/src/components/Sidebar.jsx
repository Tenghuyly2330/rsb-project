import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, BookOpen, Users, Bookmark, LogOut, X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
      const { user, logout } = useContext(AuthContext);
      const navigate = useNavigate();

      const handleLogout = () => {
            logout();
            navigate('/login');
      };

      const navItems = [
            { label: 'Overview', path: '/', icon: LayoutDashboard },
            { label: 'Books Catalog', path: '/books', icon: BookOpen },
            { label: 'Users', path: '/users', icon: Users },
            { label: 'Borrow Records', path: '/borrows', icon: Bookmark },
      ];

      const sidebarContent = (
            <div className="flex flex-col h-full">
                  {/* Brand Header */}
                  <div className="p-6 border-b border-slate-800 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                              <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-500/30">
                                    <BookOpen size={24} />
                              </div>
                              <div>
                                    <h1 className="font-bold text-lg leading-tight tracking-wide text-white">BookFlow</h1>
                                    <span className="text-xs text-indigo-400 font-medium">Rest-Book System</span>
                              </div>
                        </div>
                        <button
                              onClick={onClose}
                              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                              aria-label="Close sidebar"
                        >
                              <X size={20} />
                        </button>
                  </div>

                  <div className="p-4 mx-4 my-4 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-md shrink-0">
                              {user?.name?.[0] || 'A'}
                        </div>
                        <div className="overflow-hidden">
                              <p className="font-semibold text-sm truncate text-white">{user?.name || 'Administrator'}</p>
                              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                        </div>
                  </div>

                  <nav className="flex-1 px-4 space-y-1.5 py-2">
                        {navItems.map((item) => {
                              const Icon = item.icon;
                              return (
                                    <NavLink
                                          key={item.path}
                                          to={item.path}
                                          onClick={onClose}
                                          className={({ isActive }) =>
                                                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${isActive
                                                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-semibold'
                                                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                                                }`
                                          }
                                    >
                                          <Icon size={18} />
                                          {item.label}
                                    </NavLink>
                              );
                        })}
                  </nav>

                  <div className="p-4 border-t border-slate-800">
                        <button
                              onClick={handleLogout}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600/10 text-rose-400 hover:bg-rose-600 hover:text-white transition-all duration-200 font-medium text-sm"
                        >
                              <LogOut size={16} />
                              Sign Out
                        </button>
                  </div>
            </div>
      );

      return (
            <>
                  <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-100 h-screen sticky top-0 border-r border-slate-800 shadow-xl">
                        {sidebarContent}
                  </aside>

                  {isOpen && (
                        <div className="fixed inset-0 z-50 flex md:hidden">
                              <div
                                    className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
                                    onClick={onClose}
                              />
                              <aside className="relative flex flex-col w-72 max-w-[85vw] bg-slate-900 text-slate-100 h-full shadow-2xl">
                                    {sidebarContent}
                              </aside>
                        </div>
                  )}
            </>
      );
};

export default Sidebar;
