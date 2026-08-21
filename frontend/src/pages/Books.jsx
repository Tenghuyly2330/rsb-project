import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Search, BookOpen, ChevronLeft, ChevronRight, User, ArrowUpRight, ChevronDown, Check } from 'lucide-react';

const CATEGORIES = [
      { label: 'All Categories', value: '', color: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200' },
      { label: 'Software Engineering', value: 'Software Engineering', color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' },
      { label: 'DevOps', value: 'DevOps', color: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300' },
      { label: 'Web Development', value: 'Web Development', color: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300' },
      { label: 'Database & Systems', value: 'Database & Systems', color: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300' },
      { label: 'Fiction', value: 'Fiction', color: 'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300' },
      { label: 'Science', value: 'Science', color: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' },
      { label: 'Design', value: 'Design', color: 'bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-700 dark:text-fuchsia-300' },
];

const CategoryDropdown = ({ value, onChange }) => {
      const [open, setOpen] = useState(false);
      const ref = useRef(null);
      const selected = CATEGORIES.find(c => c.value === value) || CATEGORIES[0];

      useEffect(() => {
            const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
            document.addEventListener('mousedown', handler);
            return () => document.removeEventListener('mousedown', handler);
      }, []);

      return (
            <div className="relative sm:w-60" ref={ref}>
                  {/* Trigger Button */}
                  <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        className="w-full flex items-center gap-2.5 pl-3.5 pr-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium shadow-sm hover:border-blue-400 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                  >
                        <span className="text-base">{selected.emoji}</span>
                        <span className="flex-1 text-left truncate">{selected.label}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                  </button>

                  {open && (
                        <div className="absolute z-50 top-full mt-2 w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700">
                                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Filter by Category</p>
                              </div>

                              <ul className="py-1.5 max-h-72 overflow-y-auto">
                                    {CATEGORIES.map((cat) => (
                                          <li key={cat.value}>
                                                <button
                                                      type="button"
                                                      onClick={() => { onChange(cat.value); setOpen(false); }}
                                                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/60 ${value === cat.value ? 'bg-blue-50 dark:bg-blue-950/30' : ''
                                                            }`}
                                                >
                                                      <span className={`flex-1 text-left ${value === cat.value ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'}`}>
                                                            {cat.label}
                                                      </span>
                                                      {value === cat.value && (
                                                            <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                                      )}
                                                </button>
                                          </li>
                                    ))}
                              </ul>
                        </div>
                  )}
            </div>
      );
};

const Books = () => {
      const [books, setBooks] = useState([]);
      const [search, setSearch] = useState('');
      const [category, setCategory] = useState('');
      const [page, setPage] = useState(1);
      const [totalPages, setTotalPages] = useState(1);

      const fetchBooks = async () => {
            try {
                  const res = await api.get('/books', {
                        params: { search, category, page, limit: 8 }
                  });
                  setBooks(res.data.data || []);
                  if (res.data.pagination) {
                        setTotalPages(res.data.pagination.totalPages || 1);
                  }
            } catch (error) {
                  console.log(error);
            }
      };

      useEffect(() => { fetchBooks(); }, [page, search, category]);

      return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                  <div className="mb-10 text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                                    Explore Books testing
                              </span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Pariatur, assumenda.
                        </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mb-10 max-w-2xl mx-auto">
                        <div className="relative flex-1">
                              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                              <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm transition-all"
                                    placeholder="Search by title, author..."
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                              />
                        </div>
                        <CategoryDropdown value={category} onChange={(val) => { setCategory(val); setPage(1); }} />
                  </div>

                  {books.length === 0 ? (
                        <div className="text-center py-20">
                              <BookOpen className="w-14 h-14 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                              <h3 className="font-semibold text-slate-500 mb-1">No books found</h3>
                              <p className="text-xs text-slate-400">Try adjusting your search or category.</p>
                        </div>
                  ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                              {books.map((book) => (
                                    <Link
                                          key={book._id}
                                          to={`/books/${book._id}`}
                                          className="group block rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-slate-800"
                                    >
                                          <div className="relative h-52 overflow-hidden">
                                                <img
                                                      src={book.coverImage}
                                                      alt={book.title}
                                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                                <span className={`absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[30px] shadow-sm`}>
                                                      {book.category}
                                                </span>
                                                <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-[30px] shadow-sm ${book.stock > 0 ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                                                      {book.stock > 0 ? `${book.stock} left` : 'Out of stock'}
                                                </span>
                                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                                      <h3 className="text-white font-bold text-base leading-tight line-clamp-1 drop-shadow">{book.title}</h3>
                                                      <p className="text-slate-300 text-xs mt-0.5 line-clamp-1">By {book.author}</p>
                                                </div>
                                          </div>

                                          <div className="p-4">
                                                {book.addedBy && (
                                                      <div className="flex items-center gap-1.5 mb-3">
                                                            <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                                                                  <User className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                                            </div>
                                                            <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                                  by <span className="font-medium text-slate-700 dark:text-slate-200">{book.addedBy.name}</span>
                                                            </span>
                                                      </div>
                                                )}
                                                <div className="flex items-center justify-between">
                                                      <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">${book.price}</span>
                                                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 group-hover:bg-blue-600 group-hover:text-white px-3 py-1.5 rounded-xl transition-colors duration-200">
                                                            Details <ArrowUpRight className="w-3.5 h-3.5" />
                                                      </span>
                                                </div>
                                          </div>
                                    </Link>
                              ))}
                        </div>
                  )}

                  {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-12">
                              <button
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                    className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm cursor-pointer"
                              >
                                    <ChevronLeft className="w-5 h-5" />
                              </button>
                              <span className="text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-2xl">
                                    {page} / {totalPages}
                              </span>
                              <button
                                    disabled={page === totalPages}
                                    onClick={() => setPage(page + 1)}
                                    className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm cursor-pointer"
                              >
                                    <ChevronRight className="w-5 h-5" />
                              </button>
                        </div>
                  )}
            </div>
      );
};

export default Books;