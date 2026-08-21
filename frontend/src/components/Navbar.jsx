import { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { BookOpen, LayoutDashboard, User, LogOut, Bookmark, ChevronDown, Settings, Sun, Moon, Bell, Menu, X } from 'lucide-react';
import ProfileModal from './ProfileModal';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchPendingRequests = async () => {
    if (!user) return;
    try {
      const res = await api.get('/borrows/requests');
      const pending = (res.data.data || []).filter(r => r.status === 'pending');
      setPendingCount(pending.length);
    } catch (err) {
      // ignore silently if not logged in or error
    }
  };

  useEffect(() => {
    fetchPendingRequests();
    const interval = setInterval(fetchPendingRequests, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [navigate]);

  return (
    <>
      <nav className="bg-slate-900 text-slate-100 shadow-lg relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          <Link to="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <span>BookFlow</span>
          </Link>

          <div className="hidden sm:flex items-center gap-3 sm:gap-5">
            <Link
              to="/books"
              className="text-slate-300 hover:text-white font-medium text-sm transition-colors px-2 py-1"
            >
              Explore Books
            </Link>

            {user && (
              <button
                onClick={() => navigate('/dashboard')}
                title={pendingCount > 0 ? `${pendingCount} pending borrow requests!` : 'Borrow Notifications'}
                className="relative p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all duration-200 cursor-pointer"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-slate-900 animate-pulse">
                    {pendingCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all duration-200 cursor-pointer"
            >
              {theme === 'light' ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400" />
              )}
            </button>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full px-3.5 py-1.5 text-white transition-all duration-200 cursor-pointer text-sm font-medium"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline-block max-w-[120px] truncate">{user.name}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col z-50">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700">
                      <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{user.email}</p>
                      <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[11px] font-bold capitalize ${user.role === 'admin'
                        ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                        : 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300'
                        }`}>
                        {user.role} Account
                      </span>
                    </div>

                    <div className="p-1.5 space-y-0.5">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          setProfileModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-lg transition-colors text-left font-medium cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-slate-400" /> Profile Settings
                      </button>

                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-lg transition-colors font-medium"
                      >
                        <Bookmark className="w-4 h-4 text-slate-400" /> My Dashboard
                      </Link>

                      {user.role === 'admin' && (
                        <Link
                          to="http://localhost:3001/admin" target="_blank"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors font-semibold"
                        >
                          <LayoutDashboard className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Admin Panel
                        </Link>
                      )}
                    </div>

                    <div className="p-1.5 border-t border-slate-100 dark:border-slate-700">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors font-semibold cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-500" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-slate-300 hover:text-white font-medium text-sm px-3 py-1.5">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-1.5 rounded-lg shadow-md transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            {user && (
              <button
                onClick={() => navigate('/dashboard')}
                className="relative p-2 rounded-full bg-slate-800 text-slate-300 border border-slate-700"
              >
                <Bell className="w-4 h-4" />
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white animate-pulse">
                    {pendingCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-800 text-slate-300 border border-slate-700"
            >
              {theme === 'light' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-800 bg-slate-900 px-4 pb-4 pt-2 space-y-1 animate-in slide-in-from-top duration-200">
            <Link
              to="/books"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-medium transition-colors"
            >
              <BookOpen className="w-4 h-4" /> Explore Books
            </Link>

            {user ? (
              <>
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-white leading-tight">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => { setMobileMenuOpen(false); setProfileModalOpen(true); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-medium transition-colors text-left"
                >
                  <Settings className="w-4 h-4" /> Profile Settings
                </button>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-medium transition-colors"
                >
                  <Bookmark className="w-4 h-4" /> My Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-purple-400 hover:bg-purple-900/30 rounded-xl text-sm font-semibold transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-red-400 hover:bg-red-950/30 rounded-xl text-sm font-semibold transition-colors text-left mt-1 border-t border-slate-800 pt-3"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-medium text-center transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold text-center transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      <ProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
    </>
  );
};

export default Navbar;